'use client';

import {
  fetchUser,
  fetchUsers,
  followUser,
  unfollowUser,
} from '@/lib/actions/user.actions';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const buttonClasses =
  'text-primary-500 border border-primary-500 rounded-md py-1 px-2 text-subtle-semibold flex justify-center items-center';

interface Props {
  userId: string;
  currentUserId_db: string;
  isFollowing: boolean;
}

export default function FollowUnfollow({
  userId,
  currentUserId_db,
  isFollowing,
}: Props) {
  const [followProcessing, setFollowProcessing] = useState<boolean>(false);
  const [unfollowProcesing, setUnfollowProcessing] = useState<boolean>(false);
  const pathname = usePathname();

  const handleFollow = async () => {
    setFollowProcessing(true);
    await followUser({
      userToBeFollowedId: JSON.parse(userId),
      currentUserId: JSON.parse(currentUserId_db),
      pathname,
    });

    setTimeout(() => {
      setFollowProcessing(false);
    }, 2000);
  };

  const handleUnfollow = async () => {
    setUnfollowProcessing(true);
    await unfollowUser({
      userToBeUnfollowedId: JSON.parse(userId),
      currentUserId: JSON.parse(currentUserId_db),
      pathname,
    });

    setTimeout(() => {
      setUnfollowProcessing(false);
    }, 2000);
  };

  return (
    <>
      {userId !== currentUserId_db && (
        <>
          {isFollowing ? (
            <button
              onClick={handleUnfollow}
              className={buttonClasses}
              disabled={unfollowProcesing}
            >
              {unfollowProcesing ? 'Unfollowing...' : 'Unfollow'}
            </button>
          ) : (
            <button
              onClick={handleFollow}
              className={buttonClasses}
              disabled={followProcessing}
            >
              {followProcessing ? 'Following...' : 'Follow'}
            </button>
          )}
        </>
      )}
    </>
  );
}
