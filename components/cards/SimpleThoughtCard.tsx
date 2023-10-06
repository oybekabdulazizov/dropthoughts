import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { calculateRelativeTimes } from '@/lib/utils';
import { fetchUser } from '@/lib/actions/user.actions';
import LikeButton from '../shared/LikeButton';
import { currentUser } from '@clerk/nextjs';

type Props = {
  thoughtId: string;
  thought: string;
  author: {
    name: string;
    image: string;
    _id: string;
    idUser_clerk: string;
  };
  createdAt: Date;
  comments: any[];
  likes: any[];
};

export default function SimpleThoughtCard({
  thoughtId,
  thought,
  author,
  createdAt,
  comments,
  likes,
}: Props) {
  const createdWhen = calculateRelativeTimes(createdAt);

  return (
    <article className='flex w-full flex-col rounded-lg bg-dark-2 p-5 md:p-7 mt-6'>
      <div className='flex items-start justify-between'>
        <div className='flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            <Link
              href={`/profile/${author.idUser_clerk}`}
              className='relative h-11 w-11'
            >
              <Image
                src={author.image}
                alt={`Profile image of ${author.name}`}
                fill
                sizes='normal'
                className='cursor-pointer rounded-full'
              />
            </Link>
            <div className='thought-card_bar' />
          </div>

          <div className='flex w-full flex-col'>
            <div className='flex flex-row items-center gap-3'>
              <Link href={`/profile/${author.idUser_clerk}`} className='w-fit'>
                <h4 className='cursor-pointer text-base-semibold text-light-1'>
                  {author.name}
                </h4>
              </Link>
              <p className='text-gray-1 text-small-regular'>{createdWhen}</p>
            </div>
            <Link
              href={`/thought/${thoughtId}`}
              className='text-light-2 mt-2 text-small-regular text-start'
            >
              {thought}
            </Link>

            <div className='mt-4 flex flex-col gap-2'>
              {(comments.length > 0 || likes.length > 0) && (
                <>
                  <div className='flex flex-row gap-3 mb-2'>
                    {comments.length > 0 && (
                      <Link href={`/thought/${thoughtId}`}>
                        <p className='text-subtle-medium text-gray-1'>
                          {comments.length}{' '}
                          {comments.length > 1 ? 'replies' : 'reply'}
                        </p>
                      </Link>
                    )}
                    {comments.length > 0 && (
                      <span className='text-subtle-medium text-gray-1'>
                        &middot;
                      </span>
                    )}
                    {likes.length > 0 && (
                      <p className='text-subtle-medium text-gray-1'>
                        {likes.length} {likes.length > 1 ? 'likes' : 'like'}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
