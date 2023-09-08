import ProfileHeader from '@/components/shared/ProfileHeader';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { profileTabs } from '@/constants';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';
import Image from 'next/image';

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const userFromDB = await fetchUser(params.id);
  if (!userFromDB) redirect('/');

  // if (!userFromDB?.onboarded) redirect('/auth/onboarding');
  return (
    <section>
      <ProfileHeader
        accountId={userFromDB.id}
        authUserId={user.id}
        name={userFromDB.name}
        username={userFromDB.username}
        image={userFromDB.image}
        bio={userFromDB.bio}
      />

      <div className='mt-6'>
        <Tabs defaultValue='threads' className='w-full'>
          <TabsList className='tab'>
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className='object-contain'
                />
                <p className='max-sm:hidden'>{tab.label}</p>

                {tab.label.toLowerCase() === 'threads' && (
                  <p className='rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                    {userFromDB.threads.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </section>
  );
}
