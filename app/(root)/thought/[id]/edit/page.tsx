import PostThought from '@/components/forms/PostThought';
import { fetchThought } from '@/lib/actions/thought.actions';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const currentUser_clerk = await currentUser();
  if (!currentUser_clerk) {
    redirect('/auth/sign-in');
  }

  const currentUser_db = await fetchUser(currentUser_clerk.id);
  if (!currentUser_db) {
    redirect('/auth/onboarding');
  }

  if (!params) {
    redirect('/');
  }

  const thought = await fetchThought(params.id);
  if (!thought || thought.errorCode === 404) {
    redirect('/');
  }

  const thoughtDetails = {
    thoughtId: JSON.stringify(thought._id),
    thought: thought.text,
    image: thought.image,
    authorId: JSON.stringify(thought.author._id),
  };

  return (
    <div>
      <h1 className='head-text'>Create Thought</h1>
      <PostThought thoughtDetails={thoughtDetails} />
    </div>
  );
}