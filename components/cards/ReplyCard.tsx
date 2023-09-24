import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { calculateRelativeTimes } from '@/lib/utils';

interface Props {
  parentThreadId: string;
  key: number;
  replyAuthorImage: string;
  replyAuthorName: string;
  createdAt: Date;
  parentThreadText: string;
  replyThreadText: string;
}

export default function ReplyCard({
  key,
  parentThreadId,
  parentThreadText,
  replyAuthorImage,
  replyAuthorName,
  replyThreadText,
  createdAt,
}: Props) {
  const createdWhen = calculateRelativeTimes(createdAt);

  return (
    <Link
      key={key}
      href={`/thread/${parentThreadId}`}
      className='bg-dark-2 py-4 px-8 flex flex-col gap-4 rounded-lg'
    >
      <section className='flex items-start sm:items-center rounded-md gap-2'>
        <Image
          src={replyAuthorImage}
          alt={`${replyAuthorName}`}
          width={24}
          height={24}
          className='rounded-full object-cover'
        />
        <div className='!text-small-regular text-light-1 flex flex-row flex-wrap gap-2'>
          <span className='text-primary-500'>{replyAuthorName}</span> replied to
          your thread
          <span className='text-small-regular text-gray-1 mx-2'>
            {createdWhen}
          </span>
        </div>
      </section>
      <div className='w-full flex flex-row items-center flex-wrap gap-2 md:gap-3'>
        <p className='truncate w-full md:w-[44%] px-4 py-3 bg-dark-1 rounded-md'>
          {parentThreadText}
        </p>
        <span>with</span>
        <p className='truncate w-full md:w-[44%] px-4 py-3 bg-dark-1 rounded-md'>
          {replyThreadText}
        </p>
      </div>
    </Link>
  );
}
