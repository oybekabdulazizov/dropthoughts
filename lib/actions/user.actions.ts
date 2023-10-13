'use server';

import { revalidatePath } from 'next/cache';
import User from '../models/user.model';
import { connectToDB } from '../mongoose';
import Thought from '../models/thought.model';
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

export async function fetchUserThoughts(author_id: string) {
  try {
    connectToDB();

    const thoughtsByUser = await User.findById(author_id).populate({
      path: 'thoughts',
      model: Thought,
      options: {
        author: { $ne: author_id },
        sort: { createdAt: 'desc' },
      },
      populate: [
        {
          path: 'author',
          model: User,
          select: 'name image idUser_clerk _id username',
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
    });

    return thoughtsByUser;
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

    const userThoughts = await Thought.find({ author: authorId });

    const childThoughtIds = userThoughts.reduce((acc: any, thought: any) => {
      return acc.concat(thought.childrenThoughts);
    }, []);

    const replies = await Thought.find({
      _id: { $in: childThoughtIds },
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

// ========================================================================================================

interface FollowUser_Props {
  userToBeFollowedId: string;
  currentUserId: string;
  pathname: string;
}

export async function followUser({
  userToBeFollowedId,
  currentUserId,
  pathname,
}: FollowUser_Props) {
  try {
    connectToDB();

    const userToBeFollowed = await User.findById(userToBeFollowedId);
    if (!userToBeFollowed)
      throw new Error('(followUser): Cannot follow as the user is not found!');

    const currentUser_db = await User.findById(currentUserId);
    if (!currentUser_db)
      throw new Error(
        '(followUser): Cannot follow as the current user is not found!'
      );

    await User.findByIdAndUpdate(currentUser_db._id, {
      $push: { following: userToBeFollowed._id },
    });

    await User.findByIdAndUpdate(userToBeFollowed._id, {
      $push: { followers: currentUser_db._id },
    });
  } catch (error: any) {
    if (error.message.includes('Cast to ObjectId failed')) {
      return {
        errorCode: 404,
        errorMessage: 'User not found!',
      };
    } else {
      throw new Error(`(followUser): ${error.message}`);
    }
  }

  revalidatePath(pathname);
}

// ========================================================================================================

export async function fetchUserFollowings(user_id: string) {
  try {
    connectToDB();

    const user = await User.findById(user_id);
    if (!user) throw new Error('(fetchUserFollowings): User not found!');

    const usersWithFollowings = await User.findById(user._id).populate({
      path: 'following',
      model: User,
    });

    return usersWithFollowings;
  } catch (error: any) {
    if (error.message.includes('Cast to ObjectId failed')) {
      return {
        errorCode: 404,
        errorMessage: 'User not found!',
      };
    } else {
      throw new Error(`(fetchUserFollowings): ${error.message}`);
    }
  }
}
