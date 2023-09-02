'use client';

import { sidebarLinks } from '@/constants';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { SignOutButton, SignedIn } from '@clerk/nextjs';
import logout from '@/public/assets/logout.svg';

export default function LeftSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <section className='custom-scrollbar leftsidebar'>
      <div className='flex w-full flex-1 flex-col gap-4 px-4'>
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;
          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link ${isActive && 'bg-primary-500'}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className='text-light-1 max-lg:hidden'>{link.label}</p>
            </Link>
          );
        })}
      </div>

      <div className='mt-10 px-4'>
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push('/auth/sign-in')}>
            <div className='leftsidebar_link cursor-pointer'>
              <Image src={logout} alt='logout' width={24} height={24} />
              <p className='text-light-1 max-lg:hidden'>Log out</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
}
