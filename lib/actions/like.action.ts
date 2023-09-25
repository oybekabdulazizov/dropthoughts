'use server';

import { revalidatePath } from 'next/cache';
import Like from '../models/like.model';
import { connectToDB } from '../mongoose';
import User from '../models/user.model';
import Thread from '../models/thread.model';

interface AddLike_Props {
  threadId: string;
  userId: string;
  path: string;
}

export async function addLike({ threadId, userId, path }: AddLike_Props) {
  try {
    connectToDB();

    const newLike = await Like.create({
      thread: threadId,
      user: userId,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { likedThreads: newLike._id },
    });

    await Thread.findByIdAndUpdate(threadId, {
      $push: { likes: newLike._id },
    });
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

    const likeToRemove = await Like.findOne({
      thread: threadId,
      user: userId,
    });

    await Thread.findByIdAndUpdate(threadId, {
      $pull: { likes: { $in: [likeToRemove._id] } },
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { likedThreads: { $in: [likeToRemove._id] } },
    });

    await Like.findByIdAndDelete(likeToRemove._id);
  } catch (error: any) {
    throw new Error(`(removeLike): ${error.message}`);
  }

  revalidatePath(path);
}

// ========================================================================================================

export async function getLikes(userId: string) {
  try {
    connectToDB();

    const allLikes = await Like.find({});

    const userThreads = await Thread.find({ author: userId });

    const likes = userThreads.reduce((acc, thread) => {
      return acc.concat(thread.likes);
    }, []);

    const likesForUserThreads = await Like.find({
      _id: { $in: likes },
    }).populate([
      { path: 'user', model: User, select: '_id name image' },
      { path: 'thread', model: Thread, select: '_id text' },
    ]);

    return likesForUserThreads;
  } catch (error: any) {
    throw new Error(`(getLikes): ${error.message}`);
  }
}

// ========================================================================================================

export async function fetchUserLikedThreads(userId: string) {
  try {
    connectToDB();

    const userLikes = await Like.find({ user: userId }).populate({
      path: 'thread',
      model: Thread,
      populate: [
        { path: 'author', model: User },
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
          populate: [
            {
              path: 'user',
              model: User,
              select: '_id idUser_clerk name image',
            },
            { path: 'thread', model: Thread, select: '_id text' },
          ],
        },
      ],
    });
    const userLikedThreads = userLikes.reduce((acc, item) => {
      return acc.concat(item.thread);
    }, []);

    return userLikedThreads;
  } catch (error: any) {
    throw new Error(`(fetchUserLikedThreads): ${error.message}`);
  }
}
