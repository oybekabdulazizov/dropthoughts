'use server';

import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';
import Like from '../models/like.model';

interface CreateThread_Props {
  text: string;
  author: string;
  path: string;
}

export async function createThread({
  text,
  author,
  path,
}: CreateThread_Props): Promise<void> {
  try {
    connectToDB();

    const newThread = await Thread.create({
      text,
      author,
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
          select: '_id idUser_clerk name image',
        },
      })
      .populate({
        path: 'likes',
        populate: [
          {
            path: 'user',
            model: User,
            select: '_id idUser_clerk name image',
          },
          { path: 'thread', model: Thread, select: '_id text' },
        ],
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

export async function fetchAllThreads() {
  try {
    connectToDB();

    const threads = await Thread.find({});
    return threads;
  } catch (error: any) {
    throw new Error(`(fetchAllThreads): ${error.message}`);
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
        select: '_id idUser_clerk name image',
      })
      .populate({
        path: 'childrenThreads',
        populate: [
          {
            path: 'author',
            model: User,
            select: '_id idUser_clerk name image',
          },
          {
            path: 'childrenThreads',
            model: Thread,
            populate: {
              path: 'author',
              model: User,
              select: '_id idUser_clerk name image',
            },
          },
          {
            path: 'likes',
            model: Like,
            populate: [
              {
                path: 'user',
                model: User,
                select: '_id name image',
              },
              { path: 'thread', model: Thread, select: '_id text' },
            ],
          },
        ],
      })
      .populate({
        path: 'likes',
        populate: [
          {
            path: 'user',
            model: User,
            select: '_id name image',
          },
          { path: 'thread', model: Thread, select: '_id text' },
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
      throw new Error('(addCommentToThread): Thread not found!');

    const newCommentThread = await Thread.create({
      text: commentText,
      author: author,
      parentThreadId: threadId,
    });

    originalThread.childrenThreads.push(newCommentThread._id);
    await originalThread.save();

    await User.findByIdAndUpdate(author, {
      $push: { threads: newCommentThread._id },
    });
  } catch (error: any) {
    throw new Error(`(addCommentToThread): ${error.message}`);
  }

  revalidatePath(path);
}

// ========================================================================================================

interface UpdateThread_Props {
  threadId: string;
  content: string;
  path: string;
}

export async function updateThread({
  threadId,
  content,
  path,
}: UpdateThread_Props) {
  try {
    connectToDB();

    await Thread.findByIdAndUpdate(threadId, { text: content });
  } catch (error: any) {
    throw new Error(`(updateThread): ${error.message}`);
  }

  revalidatePath(path);
}
