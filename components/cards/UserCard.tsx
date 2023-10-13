import Link from 'next/link';
import Image from 'next/image';

interface Props {
  idUser_clerk: string;
  name: string;
  username: string;
  image: string;
  thoughts: any[];
  nth: number;
  resultLength: number;
}

export default function UserCard({
  idUser_clerk,
  name,
  username,
  image,
  thoughts,
}: Props) {
  return (
    <div className='flex flex-col justify-start w-full bg-dark-2 py-4 px-5 md:p-6 rounded-lg mt-4'>
      <section className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Link
            href={`/profile/${idUser_clerk}`}
            className='relative h-16 md:h-20 w-16 md:w-20 object-cover'
          >
            <Image
              src={image}
              alt={`Profile image of ${name}`}
              fill
              sizes='normal'
              className='rounded-full object-contain shadow-2xl'
            />
          </Link>
          <Link
            href={`/profile/${idUser_clerk}`}
            className='flex flex-col gap-1'
          >
            <h1 className='text-left text-heading4-medium text-light-1'>
              {name}
            </h1>
            <p className='text-base-medium text-gray-1'>@{username}</p>
            {thoughts.length > 0 && (
              <p className='text-base-medium text-gray-1'>
                {thoughts.length} {thoughts.length > 1 ? 'thoughts' : 'thought'}
              </p>
            )}
          </Link>
        </div>
      </section>
    </div>
  );
}
