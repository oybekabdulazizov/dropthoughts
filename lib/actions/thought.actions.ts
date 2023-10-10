'use server';

import { revalidatePath } from 'next/cache';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';
import Like from '../models/like.model';
import Thought from '../models/thought.model';

interface CreateThought_Props {
  text: string;
  author: string;
  image: string;
  repost: boolean;
  path: string;
}

export async function createThought({
  text,
  author,
  image,
  repost,
  path,
}: CreateThought_Props): Promise<void> {
  try {
    connectToDB();

    const newThought = await Thought.create({
      text,
      author,
      image,
      repost,
    });

    await User.findByIdAndUpdate(author, {
      $push: { thoughts: newThought._id },
    });
  } catch (error: any) {
    throw new Error(`(createThought): ${error.message}`);
  }

  revalidatePath(path);
}

// ========================================================================================================

interface FetchThoughts_Props {
  page: number;
  limit: number;
}

export async function fetchThoughts({
  page = 1,
  limit = 20,
}: FetchThoughts_Props) {
  try {
    connectToDB();

    const skip = (page - 1) * limit;

    // Fetching thoughts with no parent thought, i.e. top-level thoughts
    const thoughts = await Thought.find({
      parentThoughtId: { $in: [null, undefined] },
    })
      .sort({ createdAt: 'desc' })
      .skip(skip)
      .limit(limit)
      .populate({ path: 'author', model: User })
      .populate({
        path: 'childrenThoughts',
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
          { path: 'thought', model: Thought, select: '_id text' },
        ],
      });

    const totalThoughtsCount = await Thought.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const hasNext = totalThoughtsCount > skip + thoughts.length;

    return { thoughts, hasNext };
  } catch (error: any) {
    throw new Error(`(fetchThoughts): ${error.message}`);
  }
}

// ========================================================================================================

export async function fetchAllThoughts() {
  try {
    connectToDB();

    const thoughts = await Thought.find({})
      .sort({ createdAt: 'desc' })
      .populate({ path: 'author', model: User })
      .populate({
        path: 'childrenThoughts',
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
          { path: 'thought', model: Thought, select: '_id text' },
        ],
      });

    return thoughts;
  } catch (error: any) {
    throw new Error(`(fetchAllThoughts): ${error.message}`);
  }
}

// ========================================================================================================

export async function fetchThought(thoughtId: string) {
  try {
    connectToDB();

    const thought = await Thought.findById(thoughtId)
      .populate({
        path: 'author',
        model: User,
        select: '_id idUser_clerk name image username',
      })
      .populate({
        path: 'childrenThoughts',
        populate: [
          {
            path: 'author',
            model: User,
            select: '_id idUser_clerk name image username',
          },
          {
            path: 'childrenThoughts',
            model: Thought,
            populate: {
              path: 'author',
              model: User,
              select: '_id idUser_clerk name image username',
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
              { path: 'thought', model: Thought, select: '_id text' },
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
          { path: 'thought', model: Thought, select: '_id text' },
        ],
      });

    return thought;
  } catch (error: any) {
    if (error.message.includes('Cast to ObjectId failed')) {
      return {
        errorCode: 404,
      };
    } else {
      throw new Error(`(fetchThought): ${error.message}`);
    }
  }
}

// ========================================================================================================

interface AddCommentToThought_Props {
  thoughtId: string;
  commentText: string;
  image: string;
  author: string;
  path: string;
}

export async function addCommentToThought({
  thoughtId,
  commentText,
  image,
  author,
  path,
}: AddCommentToThought_Props) {
  try {
    connectToDB();

    const originalThought = await Thought.findById(thoughtId);
    if (!originalThought)
      throw new Error('(addCommentToThought): Thought not found!');

    const newCommentThought = await Thought.create({
      text: commentText,
      image,
      author: author,
      parentThoughtId: thoughtId,
    });

    originalThought.childrenThoughts.push(newCommentThought._id);
    await originalThought.save();

    await User.findByIdAndUpdate(author, {
      $push: { thoughts: newCommentThought._id },
    });
  } catch (error: any) {
    if (error.message.includes('Cast to ObjectId failed')) {
      return {
        errorCode: 404,
      };
    } else {
      throw new Error(`(addCommentToThought): ${error.message}`);
    }
  }

  revalidatePath(path);
}

// ========================================================================================================

interface UpdateThought_Props {
  thoughtId: string;
  thought: string;
  image: string;
  path: string;
}

export async function updateThought({
  thoughtId,
  thought,
  image,
  path,
}: UpdateThought_Props) {
  try {
    connectToDB();

    await Thought.findByIdAndUpdate(thoughtId, { text: thought, image });
  } catch (error: any) {
    if (error.message.includes('Cast to ObjectId failed')) {
      return {
        errorCode: 404,
      };
    } else {
      throw new Error(`(updateThought): ${error.message}`);
    }
  }

  revalidatePath(path);
}
