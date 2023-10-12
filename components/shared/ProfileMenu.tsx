'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface Props {
  currentUserId_clerk: string;
  idUser_clerk: string;
}

export default function ProfileMenu({
  currentUserId_clerk,
  idUser_clerk,
}: Props) {
  const [menuDown, setMenuDown] = useState<boolean>(false);
  const ref = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenuDown = () => setMenuDown(!menuDown);

  const handleOutsideClick = (e: any) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setMenuDown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [ref]);

  return (
    <div className='relative'>
      <button
        ref={ref}
        id='threedotmenu_btn'
        className={`w-2 inline text-light-1 focus:ring-none focus:outline-none`}
        onClick={toggleMenuDown}
      >
        <svg
          className='w-4 h-4'
          xmlns='http://www.w3.org/2000/svg'
          fill='currentColor'
          viewBox='0 0 4 15'
        >
          <path d='M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z' />
        </svg>
      </button>
      {menuDown && (
        <div className='z-10 absolute right-4 top-[-2px] bg-dark-4 divide-y rounded-lg shadow-md w-auto'>
          <ul className='py-2 text-small-regular text-light-2 flex flex-col justify-start items-start'>
            {currentUserId_clerk === idUser_clerk && (
              <Link
                href={`/profile/${currentUserId_clerk}/edit`}
                className='w-full px-4 py-2 hover:bg-dark-3 text-start'
              >
                Edit
              </Link>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
