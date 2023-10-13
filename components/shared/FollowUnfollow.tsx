'use client';

import { fetchUser, fetchUsers, followUser } from '@/lib/actions/user.actions';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const buttonClasses =
  'text-primary-500 border border-primary-500 rounded-md py-1 px-2 text-subtle-semibold flex justify-center items-center';

interface Props {
  userToBeFollowedId_db: string;
  currentUserId_db: string;
  isFollowing: boolean;
}

export default function FollowUnfollow({
  userToBeFollowedId_db,
  currentUserId_db,
  isFollowing,
}: Props) {
  const [processing, setProcessing] = useState<boolean>(false);
  const pathname = usePathname();

  const handleFollow = async () => {
    setProcessing(true);
    await followUser({
      userToBeFollowedId: JSON.parse(userToBeFollowedId_db),
      currentUserId: JSON.parse(currentUserId_db),
      pathname,
    });

    setTimeout(() => {
      setProcessing(false);
    }, 2000);

    console.log('done!');
  };

  return (
    <>
      {userToBeFollowedId_db !== currentUserId_db && (
        <>
          {isFollowing ? (
            <p className={buttonClasses}>Following</p>
          ) : (
            <button
              onClick={handleFollow}
              className={buttonClasses}
              disabled={processing}
            >
              {processing ? 'Following' : 'Follow'}
            </button>
          )}
        </>
      )}
    </>
  );
}
