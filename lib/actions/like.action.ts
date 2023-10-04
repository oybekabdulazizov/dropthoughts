'use server';

import { revalidatePath } from 'next/cache';
import Like from '../models/like.model';
import { connectToDB } from '../mongoose';
import User from '../models/user.model';
import Thought from '../models/thought.model';

interface AddLike_Props {
  thoughtId: string;
  userId: string;
  path: string;
}

export async function addLike({ thoughtId, userId, path }: AddLike_Props) {
  try {
    connectToDB();

    const newLike = await Like.create({
      thought: thoughtId,
      user: userId,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { likedThoughts: newLike._id },
    });

    await Thought.findByIdAndUpdate(thoughtId, {
      $push: { likes: newLike._id },
    });
  } catch (error: any) {
    throw new Error(`(addLike): ${error.message}`);
  }

  revalidatePath(path);
}

// ========================================================================================================

interface RemoveLike_Props {
  thoughtId: string;
  userId: string;
  path: string;
}

export async function removeLike({
  thoughtId,
  userId,
  path,
}: RemoveLike_Props) {
  try {
    connectToDB();

    const likeToRemove = await Like.findOne({
      thought: thoughtId,
      user: userId,
    });

    await Thought.findByIdAndUpdate(thoughtId, {
      $pull: { likes: { $in: [likeToRemove._id] } },
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { likedThoughts: { $in: [likeToRemove._id] } },
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

    const userThoughts = await Thought.find({ author: userId });

    const likes = userThoughts.reduce((acc, thought) => {
      return acc.concat(thought.likes);
    }, []);

    const likesForUserThoughts = await Like.find({
      _id: { $in: likes },
    }).populate([
      { path: 'user', model: User, select: '_id name image' },
      { path: 'thought', model: Thought, select: '_id text' },
    ]);

    return likesForUserThoughts;
  } catch (error: any) {
    throw new Error(`(getLikes): ${error.message}`);
  }
}

// ========================================================================================================

export async function fetchUserLikedThoughts(userId: string) {
  try {
    connectToDB();

    const userLikes = await Like.find({ user: userId }).populate({
      path: 'thought',
      model: Thought,
      populate: [
        { path: 'author', model: User },
        {
          path: 'childrenThoughts',
          model: Thought,
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
            { path: 'thought', model: Thought, select: '_id text' },
          ],
        },
      ],
    });

    const userLikedThoughts = userLikes.reduce((acc, item) => {
      return acc.concat(item.thought);
    }, []);

    return userLikedThoughts;
  } catch (error: any) {
    throw new Error(`(fetchUserLikedThoughts): ${error.message}`);
  }
}
