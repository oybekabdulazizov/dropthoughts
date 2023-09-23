import { redirect } from 'next/navigation';
import { fetchUser, getReplies } from '@/lib/actions/user.actions';
import Link from 'next/link';
import Image from 'next/image';
import { fetchThread } from '@/lib/actions/thread.actions';
import { calculateRelativeTimes } from '@/lib/utils';
import ReplyCard from '../cards/ReplyCard';

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
              <ReplyCard
                key={i}
                parentThreadId={t.parentThread._id}
                parentThreadText={t.parentThread.text}
                replyAuthorImage={t.reply.author.image}
                replyAuthorName={t.reply.author.name}
                replyThreadText={t.reply.text}
                createdWhen={createdWhen}
              />
            );
          })}
        </>
      ) : (
        <p className='!text-base-regular text-light-1'>No replies yet.</p>
      )}
    </section>
  );
}
