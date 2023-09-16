import ThreadCard from '@/components/cards/ThreadCard';
import React from 'react';
import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import { fetchThread } from '@/lib/actions/thread.actions';
import Comment from '@/components/forms/Comment';

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const userFromClerk = await currentUser();
  if (!userFromClerk) {
    redirect('/auth/sign-in');
  }

  const userFromDB = await fetchUser(userFromClerk.id);
  if (!userFromDB) {
    redirect('/auth/onboarding');
  }

  const thread = await fetchThread(params.id);

  if (!thread) {
    redirect('/');
  }

  return (
    <section className='relative'>
      <div>
        <ThreadCard
          key={thread._id}
          threadId={thread._id}
          currentUserIdClerk={userFromClerk.id || null}
          parentThreadId={thread.parentThreadId}
          content={thread.text}
          author={thread.author}
          createdAt={thread.createdAt}
          comments={thread.childrenThreads}
          likes={thread.likes}
        />
      </div>
      <div className='mt-6'>
        <Comment
          threadId={JSON.stringify(thread._id)}
          currentUserImg={userFromDB.image}
          currentUserId={JSON.stringify(userFromDB._id)}
          currentUserName={userFromDB.name!}
        />
      </div>
      <div className='mt-8'>
        {thread.childrenThreads.map((childThread: any, i: number) => (
          <ThreadCard
            key={childThread._id}
            threadId={childThread._id}
            currentUserIdClerk={userFromClerk?.id || null}
            parentThreadId={childThread.parentThreadId}
            content={childThread.text}
            author={childThread.author}
            createdAt={childThread.createdAt}
            comments={childThread.childrenThreads}
            isComment={true}
            nth={i}
            likes={childThread.likes}
          />
        ))}
      </div>
    </section>
  );
}
