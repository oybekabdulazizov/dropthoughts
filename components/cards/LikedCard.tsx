import { calculateRelativeTimes } from '@/lib/utils';
import Image from 'next/image';

interface Props {
  currentUserId: string;
  likedUserImage: string;
  likedUserName: string;
  likedUserId: string;
  likedAt: Date;
  thoughtText: string;
}

export default function LikedCard({
  currentUserId,
  likedUserImage,
  likedUserName,
  likedUserId,
  likedAt,
  thoughtText,
}: Props) {
  const likedWhen = calculateRelativeTimes(likedAt);

  return (
    <div className='bg-dark-2 py-5 px-5 md:px-8 flex flex-col gap-4 rounded-lg'>
      <section className='flex items-start sm:items-center rounded-md gap-2'>
        <Image
          src={likedUserImage}
          alt={`${likedUserName}`}
          width={24}
          height={24}
          className='rounded-full object-cover'
        />
        <div className='!text-small-regular text-light-1 flex flex-row flex-wrap gap-2'>
          <span className='text-primary-500'>
            {currentUserId === likedUserId ? 'You' : likedUserName}
          </span>{' '}
          liked your thought
          <span className='text-small-regular text-gray-1 mx-2'>
            {likedWhen}
          </span>
        </div>
      </section>
      <p className='px-4 py-3 bg-dark-1 rounded-md'>{thoughtText}</p>
    </div>
  );
}
