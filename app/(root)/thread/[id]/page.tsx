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
  const threadId = params.id;

  const currentUser_clerk = await currentUser();
  if (!currentUser_clerk) {
    redirect('/auth/sign-in');
  }

  const user_db = await fetchUser(currentUser_clerk.id);
  if (!user_db) {
    redirect('/auth/onboarding');
  }

  const thread = await fetchThread(threadId);

  if (!thread) {
    // throw toast error
    redirect('/');
  }

  return (
    <section className='relative'>
      <div>
        <ThreadCard
          key={thread._id}
          threadId={thread._id}
          currentUserId_clerk={currentUser_clerk.id}
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
          currentUserImg_db={user_db.image}
          currentUserId_db={JSON.stringify(user_db._id)}
          currentUserName_db={user_db.name!}
        />
      </div>
      <div className='mt-8'>
        {thread.childrenThreads.map((childThread: any) => (
          <ThreadCard
            key={childThread._id}
            threadId={childThread._id}
            currentUserId_clerk={currentUser_clerk.id}
            content={childThread.text}
            author={childThread.author}
            createdAt={childThread.createdAt}
            comments={childThread.childrenThreads}
            isComment={true}
            likes={childThread.likes}
          />
        ))}
      </div>
    </section>
  );
}
