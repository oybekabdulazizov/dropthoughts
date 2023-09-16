import { fetchUserThreads } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import ThreadCard from '../cards/ThreadCard';

interface Props {
  currentUserIdClerk: string;
  userId: string;
  user_id: string;
  accountType: string;
}

export default async function ThreadsTab({
  currentUserIdClerk,
  userId,
  user_id,
  accountType,
}: Props) {
  const result = await fetchUserThreads(userId);
  if (!result) redirect('/');

  return (
    <section className='mt-6 flex flex-col gap-6'>
      {result.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          threadId={thread._id}
          currentUserIdClerk={currentUserIdClerk}
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
          createdAt={thread.createdAt}
          comments={thread.childrenThreads}
          likes={thread.likes}
        />
      ))}
    </section>
  );
}
