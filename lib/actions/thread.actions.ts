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
