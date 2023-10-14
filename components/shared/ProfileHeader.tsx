import Image from 'next/image';

import ProfileMenu from './ProfileMenu';
import FollowUnfollow from './FollowUnfollow';

interface Props {
  idUser_clerk: string;
  userId: string;
  currentUserId_clerk: string;
  currentUserId_db: string;
  name: string;
  username: string;
  image: string;
  bio: string;
  followers: Array<any>;
}

export default function ProfileHeader({
  idUser_clerk,
  userId,
  currentUserId_clerk,
  currentUserId_db,
  name,
  username,
  image,
  bio,
  followers,
}: Props) {
  const isFollowing = followers.some(
    (follower: any) =>
      JSON.stringify(follower) === JSON.stringify(currentUserId_db)
  );

  return (
    <div className='flex flex-col justify-start w-full'>
      <section className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='relative h-20 w-20 object-cover'>
            <Image
              src={image}
              alt={`Profile image of ${name}`}
              fill
              sizes='medium'
              className='rounded-full object-cover shadow-2xl'
            />
          </div>
          <div className='flex-1'>
            <div className='flex flex-row gap-2'>
              <h2 className='text-left text-heading3-bold text-light-1'>
                {name}
              </h2>
              <FollowUnfollow
                userId={JSON.stringify(userId)}
                currentUserId_db={JSON.stringify(currentUserId_db)}
                isFollowing={isFollowing}
              />
            </div>
            <p className='text-base-medium text-gray-1'>@{username}</p>
          </div>
        </div>

        <ProfileMenu
          currentUserId_clerk={currentUserId_clerk}
          idUser_clerk={idUser_clerk}
        />
      </section>

      <p className='mt-6 text-light-2 max-w-lg text-base-regular'>{bio}</p>

      <div className='mt-6 h-0.5 w-full bg-dark-3' />
    </div>
  );
}
