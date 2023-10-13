import Link from 'next/link';
import Image from 'next/image';

interface Props {
  idUser_clerk: string;
  name: string;
  username: string;
  image: string;
  thoughts: any[];
}

export default function SmallUserCard({
  idUser_clerk,
  name,
  username,
  image,
  thoughts,
}: Props) {
  return (
    <div className='flex flex-col justify-start w-full bg-dark-2 rounded-lg mt-4'>
      <section className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Link href={`/profile/${idUser_clerk}`}>
            <Image
              src={image}
              alt={`Profile image of ${name}`}
              width={45}
              height={45}
              className='rounded-full object-contain shadow-2xl'
            />
          </Link>
          <Link href={`/profile/${idUser_clerk}`} className='flex flex-col'>
            <h1 className='text-left text-base1-semibold text-light-1'>
              {name}
            </h1>
            <p className='text-small-semibold text-gray-1'>@{username}</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
