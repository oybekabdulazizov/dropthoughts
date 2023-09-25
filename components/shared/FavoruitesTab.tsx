import { redirect } from 'next/navigation';
import { fetchUser, getReplies } from '@/lib/actions/user.actions';
import Link from 'next/link';
import Image from 'next/image';
import { fetchThread } from '@/lib/actions/thread.actions';
import { calculateRelativeTimes } from '@/lib/utils';
import ReplyCard from '../cards/ReplyCard';
import { fetchUserLikedThreads } from '@/lib/actions/like.action';
import ThreadCard from '../cards/ThreadCard';

interface Props {
  idUser_clerk: string;
  currentUserId_clerk: string;
}

export default async function FavouritesTab({
  idUser_clerk,
  currentUserId_clerk,
}: Props) {
  const user_db = await fetchUser(idUser_clerk);
  if (!user_db) {
    // TODO: toast a message
    redirect('/auth/sign-in');
  }

  const favouriteThreads = await fetchUserLikedThreads(user_db._id);

  return (
    <section className='mt-6 flex w-full flex-col gap-6'>
      {favouriteThreads.length > 0 ? (
        <>
          {favouriteThreads.map((t: any, i: any) => {
            return (
              <ThreadCard
                key={t._id}
                threadId={t._id}
                currentUserId_clerk={currentUserId_clerk}
                content={t.text}
                author={t.author}
                comments={t.childrenThreads}
                likes={t.likes}
                createdAt={t.createdAt}
              />
            );
          })}
        </>
      ) : (
        <p className='!text-base-regular text-light-1'>No favourites yet.</p>
      )}
    </section>
  );
}
