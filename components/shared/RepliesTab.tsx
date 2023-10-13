import { redirect } from 'next/navigation';
import { fetchUser, getReplies } from '@/lib/actions/user.actions';
import Link from 'next/link';
import Image from 'next/image';
import { fetchThought } from '@/lib/actions/thought.actions';
import { calculateRelativeTimes } from '@/lib/utils';
import ReplyCard from '../cards/ReplyCard';

interface Props {
  idUser_clerk: string;
}

export default async function RepliesTab({ idUser_clerk }: Props) {
  const user_db = await fetchUser(idUser_clerk);
  if (!user_db) {
    redirect('/auth/onboarding');
  }

  const replies = await getReplies(user_db._id);

  let thoughtReplies = [];
  for (const reply of replies) {
    const parentThought = await fetchThought(reply.parentThoughtId);
    try {
      thoughtReplies.push({
        parentThought: {
          _id: parentThought._id,
          text: parentThought.text,
        },
        reply: reply,
      });
    } catch (error: any) {
      throw new Error(`(RepliesTab): ${error.message}`);
    }
  }

  return (
    <section className='flex w-full flex-col mt-2'>
      {replies.length > 0 ? (
        <>
          {thoughtReplies.map((t, i) => {
            return (
              <ReplyCard
                key={i}
                parentThoughtId={t.parentThought._id}
                parentThoughtText={t.parentThought.text}
                replyAuthorImage={t.reply.author.image}
                replyAuthorName={t.reply.author.name}
                replyThoughtText={t.reply.text}
                createdAt={t.reply.createdAt}
              />
            );
          })}
        </>
      ) : (
        <p className='no-result mt-4'>No replies yet.</p>
      )}
    </section>
  );
}
