import { redirect } from 'next/navigation';
import { fetchUser, getReplies } from '@/lib/actions/user.actions';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  currentUserId: string;
  accountId: string;
}

export default async function RepliesTab({ currentUserId, accountId }: Props) {
  const userFromDB = await fetchUser(accountId);
  if (!userFromDB.onboarded) {
    // TODO: toast a message
    redirect('/auth/onboarding');
  }

  const replies = await getReplies(userFromDB._id);

  return (
    <section className='mt-6 flex flex-col gap-6'>
      {replies.length > 0 ? (
        <>
          {replies.map((reply) => (
            <Link key={reply._id} href={`/thread/${reply.parentThreadId}`}>
              <section className='flex items-center rounded-md bg-dark-2 px-8 py-4'>
                <Image
                  src={reply.author.image}
                  alt={`Profile image of ${reply.author.name}`}
                  width={24}
                  height={24}
                  className='rounded-full object-cover mr-2'
                />
                <p className='!text-small-regular text-light-1'>
                  <span className='mr-1 text-primary-500'>
                    {reply.author.name}
                  </span>{' '}
                  replied to your thread
                </p>
              </section>
            </Link>
          ))}
        </>
      ) : (
        <p className='!text-base-regular text-light-1'>No activity yet</p>
      )}
    </section>
  );
}
