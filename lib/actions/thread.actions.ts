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
    throw new Error(`Error creating the thread. ${error.message}`);
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
          select: '_id name parentThreadId image',
        },
      });

    const totalThreadsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const threads = await threadsQuery.exec();

    const isNext = totalThreadsCount > skipThreads * threads.length;

    return { threads, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch threads. ${error.message}`);
  }
}
