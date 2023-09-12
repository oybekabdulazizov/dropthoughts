'use client';

import { addLike, removeLike } from '@/lib/actions/thread.actions';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  likedByCurrentUser: number;
  currentUserId: string | null;
  threadId: string;
}

export default function LikeButton({
  likedByCurrentUser,
  currentUserId,
  threadId,
}: Props) {
  const [liked, setLiked] = useState<number>(likedByCurrentUser);
  const pathname = usePathname();
  const router = useRouter();

  const toggleLiked = async () => {
    if (currentUserId) {
      if (liked === 1) {
        setLiked(0);
        await removeLike({
          threadId: JSON.parse(threadId),
          userId: JSON.parse(currentUserId),
          path: pathname,
        });
      } else {
        setLiked(1);
        await addLike({
          threadId: JSON.parse(threadId),
          userId: JSON.parse(currentUserId),
          path: pathname,
        });
      }
    } else {
      router.push('/auth/sign-in');
    }
  };

  return (
    <button onClick={toggleLiked}>
      <Image
        src={`/assets/heart-${liked === 1 ? 'filled' : 'gray'}.svg`}
        height={24}
        width={24}
        alt='icon-heart'
        className='cursor-pointer object-contain'
      />
    </button>
  );
}
