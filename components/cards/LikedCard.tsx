import { calculateRelativeTimes } from '@/lib/utils';
import Image from 'next/image';

interface Props {
  likedAuthorImage: string;
  likedAuthorName: string;
  likedAt: Date;
  threadText: string;
}

export default function LikedCard({
  likedAuthorImage,
  likedAuthorName,
  likedAt,
  threadText,
}: Props) {
  const likedWhen = calculateRelativeTimes(likedAt);
  // console.log('typeof likedAt: ', typeof likedAt);

  return (
    <div className='bg-dark-2 py-4 px-8 flex flex-col gap-4 rounded-lg'>
      <section className='flex items-start sm:items-center rounded-md gap-2'>
        <Image
          src={likedAuthorImage}
          alt={`${likedAuthorName}`}
          width={24}
          height={24}
          className='rounded-full object-cover'
        />
        <div className='!text-small-regular text-light-1 flex flex-row flex-wrap gap-2'>
          <span className='text-primary-500'>{likedAuthorName}</span> liked your
          thread
          <span className='text-small-regular text-gray-1 mx-2'>
            {likedWhen}
          </span>
        </div>
      </section>
      <p className='truncate w-full  px-4 py-3 bg-dark-1 rounded-md'>
        {threadText}
      </p>
    </div>
  );
}
