'use server';

import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';

interface CreateThread_Props {
  text: string;
  author: string;
  community: string | null;
  path: string;
}

export async function createThread({
  text,
  author,
  community,
  path,
}: CreateThread_Props): Promise<void> {
  try {
    connectToDB();

    const newThread = await Thread.create({
      text,
      author,
      community,
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: newThread._id },
    });
  } catch (error: any) {
    throw new Error(`(createThread): ${error.message}`);
  }

  revalidatePath(path);
}

// ========================================================================================================

interface FetchThreads_Props {
  pageNumber: number;
  pageSize: number;
}

export async function fetchThreads({
  pageNumber = 1,
  pageSize = 20,
}: FetchThreads_Props) {
  try {
    connectToDB();

    const skipThreads = (pageNumber - 1) * pageSize;

    // Fetching threads with no parent thread, i.e. top-level threads
    const threadsQuery = Thread.find({
      parentThreadId: { $in: [null, undefined] },
    })
      .sort({ createdAt: 'desc' })
      .skip(skipThreads)
      .limit(pageSize)
      .populate({ path: 'author', model: User })
      .populate({
        path: 'childrenThreads',
        populate: {
          path: 'author',
          model: User,
          select: '_id id name image',
        },
      });

    const totalThreadsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const threads = await threadsQuery.exec();

    const isNext = totalThreadsCount > skipThreads * threads.length;

    return { threads, isNext };
  } catch (error: any) {
    throw new Error(`(fetchThreads): ${error.message}`);
  }
}

// ========================================================================================================

export async function fetchThread(threadId: string) {
  try {
    connectToDB();

    const thread = await Thread.findById(threadId)
      .populate({
        path: 'author',
        model: User,
        select: '_id id name image',
      })
      .populate({
        path: 'childrenThreads',
        populate: [
          {
            path: 'author',
            model: User,
            select: '_id id name parentThreadId image',
          },
          {
            path: 'childrenThreads',
            model: Thread,
            populate: {
              path: 'author',
              model: User,
              select: '_id id name parentThreadId image',
            },
          },
        ],
      });

    return thread;
  } catch (error: any) {
    throw new Error(`(fetchThread): ${error.message}`);
  }
}

// ========================================================================================================

interface AddCommentToThread_Props {
  threadId: string;
  commentText: string;
  author: string;
  path: string;
}

export async function addCommentToThread({
  threadId,
  commentText,
  author,
  path,
}: AddCommentToThread_Props) {
  try {
    connectToDB();
    const tId = threadId;

    const originalThread = await Thread.findById(tId);
    if (!originalThread)
      throw new Error('addCommentToThread(): Thread not found!');

    const newCommentThread = await Thread.create({
      text: commentText,
      author: author,
      community: null,
      parentThreadId: threadId,
    });

    originalThread.childrenThreads.push(newCommentThread._id);
    await originalThread.save();

    await User.findByIdAndUpdate(author, {
      $push: { threads: newCommentThread._id },
    });
  } catch (error: any) {
    throw new Error(
      `(addCommentToThread): Failed to add a comment to the thread. ${error.message}`
    );
  }

  revalidatePath(path);
}

// ========================================================================================================

interface AddLike_Props {
  threadId: string;
  userId: string;
  path: string;
}
export async function addLike({ threadId, userId, path }: AddLike_Props) {
  try {
    connectToDB();

    await Thread.findByIdAndUpdate(
      threadId,
      {
        $push: { likes: userId },
      },
      { new: true, returnOriginal: false }
    );

    await User.findByIdAndUpdate(
      userId,
      {
        $push: { likedThreads: threadId },
      },
      { new: true, returnOriginal: false }
    );
  } catch (error: any) {
    throw new Error(`(addLike): ${error.message}`);
  }

  revalidatePath(path);
}

// ========================================================================================================

interface RemoveLike_Props {
  threadId: string;
  userId: string;
  path: string;
}
export async function removeLike({ threadId, userId, path }: RemoveLike_Props) {
  try {
    connectToDB();

    await Thread.findByIdAndUpdate(
      threadId,
      {
        $pull: { likes: { $in: [userId] } },
      },
      { new: true, returnOriginal: false }
    );

    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { likedThreads: { $in: [threadId] } },
      },
      { new: true, returnOriginal: false }
    );
  } catch (error: any) {
    throw new Error(`(removeLike): ${error.message}`);
  }

  revalidatePath(path);
}
