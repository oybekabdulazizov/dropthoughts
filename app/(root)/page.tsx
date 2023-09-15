import ThreadCard from '@/components/cards/ThreadCard';
import { fetchThreads } from '@/lib/actions/thread.actions';
import { currentUser } from '@clerk/nextjs';

export default async function Home() {
  const userFromClerk = await currentUser();
  const result = await fetchThreads({ pageNumber: 1, pageSize: 30 });

  return (
    <>
      <h1 className='head-text text-left'>Threads</h1>
      <section className='mt-6 flex flex-col gap-10'>
        {result.threads.length === 0 ? (
          <p className='no-result'>No threads found.</p>
        ) : (
          <>
            {result.threads.map(
              ({
                _id,
                text,
                author,
                community,
                createdAt,
                childrenThreads,
                parentThreadId,
                likes,
              }) => (
                <ThreadCard
                  key={_id}
                  threadId={_id}
                  currentUserId={userFromClerk?.id || null}
                  parentThreadId={parentThreadId}
                  content={text}
                  author={author}
                  community={community}
                  createdAt={createdAt}
                  comments={childrenThreads}
                  likes={likes}
                />
              )
            )}
          </>
        )}
      </section>
    </>
  );
}
