import { fetchUserThreads } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import ThreadCard from '../cards/ThreadCard';

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

export default async function ThreadsTab({
  currentUserId,
  accountId,
  accountType,
}: Props) {
  const result = await fetchUserThreads(accountId);
  if (!result) redirect('/');

  return (
    <section className='mt-6 flex flex-col gap-6'>
      {result.threads.map((thread: any) => {
        // if (!thread.parentThreadId) {
        return (
          <ThreadCard
            key={thread._id}
            threadId={thread._id}
            currentUserId={currentUserId}
            parentThreadId={thread.parentThreadId}
            content={thread.text}
            author={
              accountType === 'User'
                ? {
                    name: result.name,
                    image: result.image,
                    id: result.id,
                    _id: result._id,
                  }
                : {
                    name: thread.author.name,
                    image: thread.author.image,
                    id: thread.author.id,
                    _id: thread.author._id,
                  }
            }
            community={thread.community}
            createdAt={thread.createdAt}
            comments={thread.childrenThreads}
            likes={thread.likes}
          />
        );
        // } else {
        //   return '';
        // }
      })}
    </section>
  );
}
