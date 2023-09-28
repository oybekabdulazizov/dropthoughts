'use server';

import { revalidatePath } from 'next/cache';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';
import Thread from '../models/thread.model';
import Like from '../models/like.model';

interface UpdateUser_Props {
  idUser_clerk: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  idUser_clerk,
  username,
  name,
  bio,
  image,
  path,
}: UpdateUser_Props) {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { idUser_clerk: idUser_clerk },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );
  } catch (error: any) {
    if (error.message.includes('Cast to ObjectId failed')) {
      return {
        errorCode: 404,
      };
    } else {
      throw new Error(`(updateUser): ${error.message}`);
    }
  }

  if (path === '/profile/edit') {
    revalidatePath(path);
  }
}

// ========================================================================================================

export async function fetchUser(idUser_clerk: string) {
  try {
    connectToDB();
    const user = await User.findOne({ idUser_clerk: idUser_clerk });
    return user;
  } catch (error: any) {
    throw new Error(`(fetchUser): ${error.message}`);
  }
}

// ========================================================================================================

export async function fetchUserThreads(author_id: string) {
  try {
    connectToDB();

    const threadsByUser = await User.findById(author_id).populate({
      path: 'threads',
      model: Thread,
      options: {
        author: { $ne: author_id },
        sort: { createdAt: 'desc' },
      },
      populate: [
        {
          path: 'author',
          model: User,
          select: 'name image idUser_clerk _id',
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
    });

    return threadsByUser;
  } catch (error: any) {
    if (error.message.includes('Cast to ObjectId failed')) {
      return {
        errorCode: 404,
      };
    } else {
      throw new Error(`(fetchUserPosts): ${error.message}`);
    }
  }
}

// ========================================================================================================

export async function getReplies(authorId: string) {
  try {
    connectToDB();

    const userThreads = await Thread.find({ author: authorId });

    const childThreadIds = userThreads.reduce((acc, thread) => {
      return acc.concat(thread.childrenThreads);
    }, []);

    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: authorId },
    })
      .sort({ createdAt: 'desc' })
      .populate({
        path: 'author',
        model: User,
        select: '_id idUser_clerk name image',
      });

    return replies;
  } catch (error: any) {
    throw new Error(`(getReplies): ${error.message}`);
  }
}

// ========================================================================================================

export async function fetchUsers() {
  try {
    connectToDB();

    const users = await User.find({});
    return users;
  } catch (error: any) {
    throw new Error(`(fetchUsers): ${error.message}`);
  }
}
