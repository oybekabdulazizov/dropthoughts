import ThreadCard from '@/components/cards/ThreadCard';
import React from 'react';
import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import { fetchThread } from '@/lib/actions/thread.actions';

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const userFromDB = await fetchUser(user.id);
  if (!userFromDB?.onboarded) {
    redirect('/onboarding');
  }

  const {
    _id,
    parentThreadId,
    text,
    author,
    community,
    createdAt,
    childrenThreads,
  } = await fetchThread(params.id);

  return (
    <section className='relative'>
      <div>
        <ThreadCard
          key={_id}
          threadId={_id}
          currentUserId={user?.id || ''}
          parentThreadId={parentThreadId}
          content={text}
          author={author}
          community={community}
          createdAt={createdAt}
          comments={childrenThreads}
        />
      </div>
    </section>
  );
}
