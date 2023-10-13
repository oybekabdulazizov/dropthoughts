import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { calculateRelativeTimes } from '@/lib/utils';

interface Props {
  parentThoughtId: string;
  key: number;
  replyAuthorImage: string;
  replyAuthorName: string;
  createdAt: Date;
  parentThoughtText: string;
  replyThoughtText: string;
}

export default function ReplyCard({
  key,
  parentThoughtId,
  parentThoughtText,
  replyAuthorImage,
  replyAuthorName,
  replyThoughtText,
  createdAt,
}: Props) {
  const createdWhen = calculateRelativeTimes(createdAt);

  return (
    <Link
      key={key}
      href={`/thought/${parentThoughtId}`}
      className='bg-dark-2 py-5 px-5 md:px-8 flex flex-col gap-4 rounded-lg mt-4'
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
          your thought
          <span className='text-small-regular text-gray-1'>{createdWhen}</span>
        </div>
      </section>
      <div className='w-full flex flex-row items-center flex-wrap gap-2 md:gap-3'>
        <p className='px-4 py-3 bg-dark-1 rounded-md'>{parentThoughtText}</p>
        <span>with</span>
        <p className='px-4 py-3 bg-dark-1 rounded-md'>{replyThoughtText}</p>
      </div>
    </Link>
  );
}
