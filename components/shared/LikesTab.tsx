import { getLikes } from '@/lib/actions/like.action';

import LikedCard from '../cards/LikedCard';

interface Props {
  currentUserId: string;
}

export default async function LikesTab({ currentUserId }: Props) {
  const likesForUserThoughts = await getLikes(JSON.parse(currentUserId));

  return (
    <section className='flex w-full flex-col mt-2'>
      {likesForUserThoughts.length > 0 ? (
        <>
          {likesForUserThoughts.map((like, i) => {
            return (
              <LikedCard
                key={i}
                currentUserId={currentUserId}
                likedUserImage={like.user.image}
                likedUserName={like.user.name}
                likedUserId={JSON.stringify(like.user._id)}
                likedAt={like.likedAt}
                thoughtText={like.thought.text}
              />
            );
          })}
        </>
      ) : (
        <p className='no-result mt-4'>No likes yet.</p>
      )}
    </section>
  );
}
