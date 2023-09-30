import { getLikes } from '@/lib/actions/like.action';
import LikedCard from '../cards/LikedCard';

interface Props {
  currentUserId: string;
}

export default async function LikesTab({ currentUserId }: Props) {
  const likesForUserThreads = await getLikes(JSON.parse(currentUserId));

  return (
    <section className='mt-6 flex flex-col gap-6'>
      {likesForUserThreads.length > 0 ? (
        <>
          {likesForUserThreads.map((like, i) => {
            return (
              <LikedCard
                key={i}
                currentUserId={currentUserId}
                likedUserImage={like.user.image}
                likedUserName={like.user.name}
                likedUserId={JSON.stringify(like.user._id)}
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
