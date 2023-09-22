import { fetchUserThreads } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import ThreadCard from '../cards/ThreadCard';

interface Props {
  currentUserId_clerk: string;
  // idUser_clerk: string;
  authorId: string;
  accountType: string;
}

export default async function ThreadsTab({
  currentUserId_clerk,
  // idUser_clerk,
  authorId,
  accountType,
}: Props) {
  const result = await fetchUserThreads(JSON.parse(authorId));
  if (!result) redirect('/');

  return (
    <section className='mt-6 flex flex-col gap-6'>
      {result.threads.length > 0 ? (
        <>
          {result.threads.map((thread: any) => (
            <ThreadCard
              key={thread._id}
              threadId={thread._id}
              currentUserId_clerk={currentUserId_clerk}
              // currentUserIdClerk={currentUserIdClerk}
              // parentThreadId={thread.parentThreadId}
              content={thread.text}
              author={
                accountType === 'User'
                  ? {
                      name: result.name,
                      image: result.image,
                      idUser_clerk: result.id,
                      _id: result._id,
                    }
                  : {
                      name: thread.author.name,
                      image: thread.author.image,
                      idUser_clerk: thread.author.id,
                      _id: thread.author._id,
                    }
              }
              createdAt={thread.createdAt}
              comments={thread.childrenThreads}
              likes={thread.likes}
            />
          ))}
        </>
      ) : (
        <p className='!text-base-regular text-light-1'>No threads yet.</p>
      )}
    </section>
  );
}
