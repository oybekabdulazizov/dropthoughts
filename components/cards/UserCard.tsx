import Link from 'next/link';
import Image from 'next/image';

interface Props {
  idUser_clerk: string;
  name: string;
  username: string;
  image: string;
  threads: any[];
  nth: number;
  resultLength: number;
}

export default function UserCard({
  idUser_clerk,
  name,
  username,
  image,
  threads,
  nth,
  resultLength,
}: Props) {
  return (
    <div className='flex flex-col justify-start w-full'>
      <section className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='relative h-20 w-20 object-cover'>
            <Link href={`/profile/${idUser_clerk}`}>
              <Image
                src={image}
                alt={`Profile image of ${name}`}
                fill
                className='rounded-full object-contain shadow-2xl'
              />
            </Link>
          </div>
          <Link
            href={`/profile/${idUser_clerk}`}
            className='flex flex-col gap-1'
          >
            <h1 className='text-left text-heading3-bold text-light-1'>
              {name}
            </h1>
            <p className='text-base-medium text-gray-1'>@{username}</p>
            {threads.length > 0 && (
              <p className='text-base-medium text-gray-1'>
                {threads.length} {threads.length > 1 ? 'threads' : 'thread'}
              </p>
            )}
          </Link>
        </div>
      </section>

      {resultLength - 1 !== nth && (
        <div className='my-4 h-0.5 w-full bg-dark-3' />
      )}
    </div>
  );
}
