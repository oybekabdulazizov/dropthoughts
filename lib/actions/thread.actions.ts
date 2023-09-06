'use server';

import { revalidatePath } from 'next/cache';
import Thread from '../models/thread.model';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';

interface Props {
  text: string;
  authorId: string;
  communityId: string | null;
  path: string;
}

export async function createThread({
  text,
  authorId,
  communityId,
  path,
}: Props): Promise<void> {
  try {
    connectToDB();
    console.log(text, authorId, communityId, path);
    const newThread = await Thread.create({
      text,
      authorId,
      communityId,
    });
    console.log(newThread);

    await User.findByIdAndUpdate(authorId, {
      $push: { threads: newThread._id },
    });
  } catch (error: any) {
    throw new Error(`Error creating the thread. ${error.message}`);
    // console.log('Failed to add a thread.');
    // console.log(error);
  }

  revalidatePath(path);
}
