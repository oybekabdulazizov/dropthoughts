import UserCard from '@/components/cards/UserCard';
import {
  fetchUser,
  fetchUserFollowers,
  fetchUserFollowings,
} from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  if (!params || !params.id) {
    redirect('/');
  }

  const currentUser_clerk = await currentUser();
  if (!currentUser_clerk) redirect('/auth/sign-in');

  const currentUser_db = await fetchUser(currentUser_clerk.id);
  if (!currentUser_db) redirect('/auth/onboarding');

  const user_db = await fetchUser(params.id);

  const userWithFollowers = await fetchUserFollowers(user_db._id);

  return (
    <div>
      <h1 className='head-text'>Followers</h1>
      {userWithFollowers.followers.map((follower: any, i: any) => (
        <UserCard
          key={follower._id}
          idUser_clerk={follower.idUser_clerk}
          name={follower.name}
          username={follower.username}
          image={follower.image}
          thoughts={follower.thoughts}
          nth={i}
          resultLength={userWithFollowers.followers.length}
        />
      ))}
    </div>
  );
}