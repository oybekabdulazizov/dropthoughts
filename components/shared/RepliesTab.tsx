import { redirect } from 'next/navigation';
import { fetchUser, getReplies } from '@/lib/actions/user.actions';
import Link from 'next/link';
import Image from 'next/image';
import { fetchThread } from '@/lib/actions/thread.actions';
import { calculateRelativeTimes } from '@/lib/utils';

interface Props {
  currentUserIdClerk: string;
  userId: string;
  user_id: string;
}

export default async function RepliesTab({
  currentUserIdClerk,
  userId,
  user_id,
}: Props) {
  const userFromDB = await fetchUser(userId);
  if (!userFromDB.onboarded) {
    // TODO: toast a message
    redirect('/auth/onboarding');
  }

  const replies = await getReplies(userFromDB._id);
  let threadReplies = [];
  for (const reply of replies) {
    const parentThread = await fetchThread(reply.parentThreadId);
    try {
      threadReplies.push({
        parentThread: {
          _id: parentThread._id,
          text: parentThread.text,
        },
        reply: reply,
      });
    } catch (error: any) {
      throw new Error(`(RepliesTab): ${error.message}`);
    }
  }

  console.log(threadReplies);

  return (
    <section className='mt-6 flex flex-col gap-6'>
      {replies.length > 0 ? (
        <>
          {threadReplies.map((t, i) => {
            const createdWhen = calculateRelativeTimes(t.reply.createdAt);
            return (
              <Link
                key={i}
                href={`/thread/${t.parentThread._id}`}
                className='bg-dark-2'
              >
                <section className='flex items-center rounded-md px-8 py-4'>
                  <Image
                    src={t.reply.author.image}
                    alt={`Profile image of ${t.reply.author.name}`}
                    width={24}
                    height={24}
                    className='rounded-full object-cover mr-2'
                  />
                  <div className='!text-small-regular text-light-1'>
                    <span className='mr-1 text-primary-500'>
                      {t.reply.author.name}
                    </span>{' '}
                    replied to your thread
                    <span className='text-small-regular text-gray-1 ml-3'>
                      {createdWhen}
                    </span>
                  </div>
                </section>
                <p className='truncate w-52 sm:w-[480px] md:w-[550px] px-6 py-3 mx-6 mb-3 bg-dark-1 rounded-md'>
                  {t.parentThread.text}
                </p>
              </Link>
            );
          })}
        </>
      ) : (
        <p className='!text-base-regular text-light-1'>No activity yet</p>
      )}
    </section>
  );
}
