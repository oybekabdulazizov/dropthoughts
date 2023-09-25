import { getLikes } from '@/lib/actions/like.action';
import LikedCard from '../cards/LikedCard';

interface Props {
  currentUserId: string;
}

export default async function LikesTab({ currentUserId }: Props) {
  const likesForUserThreads = await getLikes(JSON.parse(currentUserId));

  return (
    <section className='mt-6 flex w-full flex-col gap-6'>
      {likesForUserThreads.length > 0 ? (
        <>
          {likesForUserThreads.map((like, i) => {
            return (
              <LikedCard
                likedAuthorImage={like.user.image}
                likedAuthorName={like.user.name}
                likedAt={like.likedAt}
                threadText={like.thread.text}
              />
            );
          })}
        </>
      ) : (
        <p className='!text-base-regular text-light-1'>No likes yet.</p>
      )}
    </section>
  );
}
