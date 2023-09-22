import { redirect } from 'next/navigation';
import { fetchUser, getReplies } from '@/lib/actions/user.actions';
import Link from 'next/link';
import Image from 'next/image';
import { fetchThread } from '@/lib/actions/thread.actions';
import { calculateRelativeTimes } from '@/lib/utils';

interface Props {
  // currentUserId_clerk: string;
  idUser_clerk: string;
  // authorId: string;
}

export default async function RepliesTab({
  // currentUserId_clerk,
  idUser_clerk,
}: // authorId
Props) {
  const user_db = await fetchUser(idUser_clerk);
  if (!user_db) {
    // TODO: toast a message
    redirect('/auth/onboarding');
  }

  const replies = await getReplies(user_db._id);

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

  return (
    <section className='mt-6 flex w-full flex-col gap-6'>
      {replies.length > 0 ? (
        <>
          {threadReplies.map((t, i) => {
            const createdWhen = calculateRelativeTimes(t.reply.createdAt);
            return (
              <Link
                key={i}
                href={`/thread/${t.parentThread._id}`}
                className='bg-dark-2 py-4 px-8 flex flex-col gap-4 rounded-lg'
              >
                <section className='flex items-start sm:items-center rounded-md gap-2'>
                  <Image
                    src={t.reply.author.image}
                    alt={`Profile image of ${t.reply.author.name}`}
                    width={24}
                    height={24}
                    className='rounded-full object-cover'
                  />
                  <div className='!text-small-regular text-light-1 flex flex-row flex-wrap gap-2'>
                    <span className='text-primary-500'>
                      {t.reply.author.name}
                    </span>{' '}
                    replied to your thread
                    <span className='text-small-regular text-gray-1 mx-2'>
                      {createdWhen}
                    </span>
                  </div>
                </section>
                <p className='truncate md:w-full px-4 py-3 bg-dark-1 rounded-md'>
                  {t.parentThread.text}
                </p>
              </Link>
            );
          })}
        </>
      ) : (
        <p className='!text-base-regular text-light-1'>No replies yet.</p>
      )}
    </section>
  );
}
