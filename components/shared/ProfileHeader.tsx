import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {
  id: string;
  _id: string;
  currentUserIdClerk: string;
  name: string;
  username: string;
  image: string;
  bio: string;
}

export default function ProfileHeader({
  id,
  _id,
  currentUserIdClerk,
  name,
  username,
  image,
  bio,
}: Props) {
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
            <h2 className='text-left text-heading3-bold text-light-1'>
              {name}
            </h2>
            <p className='text-base-medium text-gray-1'>@{username}</p>
          </div>
        </div>

        {currentUserIdClerk === id && (
          <Link href='/profile/edit'>
            <Image
              src='/assets/edit.svg'
              alt='edit profile'
              width={24}
              height={24}
              className='object-contain'
            />
          </Link>
        )}
      </section>

      {/* TODO: Community is placed here */}

      <p className='mt-6 text-light-2 max-w-lg text-base-regular'>{bio}</p>

      <div className='mt-6 h-0.5 w-full bg-dark-3' />
    </div>
  );
}
