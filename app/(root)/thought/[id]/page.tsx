import ThoughtCard from '@/components/cards/ThoughtCard';
import React from 'react';
import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import { fetchThought } from '@/lib/actions/thought.actions';
import NewComment from '@/components/forms/NewComment';

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const thoughtId = params.id;

  const currentUser_clerk = await currentUser();
  if (!currentUser_clerk) {
    redirect('/auth/sign-in');
  }

  const user_db = await fetchUser(currentUser_clerk.id);
  if (!user_db) {
    redirect('/auth/onboarding');
  }

  const thought = await fetchThought(thoughtId);

  if (!thought || thought.errorCode === 404) {
    redirect('/');
  }

  return (
    <section className='relative'>
      <div>
        <ThoughtCard
          key={thought._id}
          thoughtId={thought._id}
          currentUserId_clerk={currentUser_clerk.id}
          thought={thought.text}
          image={thought.image}
          author={thought.author}
          createdAt={thought.createdAt}
          comments={thought.childrenThoughts}
          likes={thought.likes}
        />
      </div>
      <div>
        <NewComment
          thoughtId={JSON.stringify(thought._id)}
          currentUserImg_db={user_db.image}
          currentUserId_db={JSON.stringify(user_db._id)}
          currentUserName_db={user_db.name!}
        />
      </div>
      <div className='mt-8'>
        {thought.childrenThoughts.map((childThought: any) => (
          <ThoughtCard
            key={childThought._id}
            thoughtId={childThought._id}
            currentUserId_clerk={currentUser_clerk.id}
            thought={childThought.text}
            image={childThought.image}
            author={childThought.author}
            createdAt={childThought.createdAt}
            comments={childThought.childrenThoughts}
            isComment={true}
            likes={childThought.likes}
          />
        ))}
      </div>
    </section>
  );
}
