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

  if (
    JSON.stringify(thought.author._id) !== JSON.stringify(currentUser_db._id)
  ) {
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
      <h1 className='head-text'>Edit Thought</h1>
      <p className='text-base-semibold text-light-2 my-3'>
        Antyhing you wanna change or add?
      </p>
      <PostThought thoughtDetails={thoughtDetails} repost={thought.repost} />
    </div>
  );
}
