import ThreadCard from '@/components/cards/ThreadCard';
import { fetchThreads } from '@/lib/actions/thread.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function Home() {
  const currentUser_clerk = await currentUser();
  // if (!currentUser_clerk) {
  //   redirect('/auth/sign-in');
  // }

  const result = await fetchThreads({ pageNumber: 1, pageSize: 30 });

  return (
    <>
      <h1 className='head-text text-left'>Threads</h1>
      <section className='mt-6 flex flex-col gap-10'>
        {result.threads.length === 0 ? (
          <p className='no-result'>No threads yet.</p>
        ) : (
          <>
            {result.threads.map((thread) => (
              <ThreadCard
                key={thread._id}
                threadId={thread._id}
                currentUserId_clerk={currentUser_clerk?.id || null}
                content={thread.text}
                author={thread.author}
                createdAt={thread.createdAt}
                comments={thread.childrenThreads}
                likes={thread.likes}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}
