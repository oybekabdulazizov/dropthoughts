import ProfileHeader from '@/components/shared/ProfileHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { profileTabs } from '@/constants';
import { fetchUser, getReplies } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
import ThreadsTab from '@/components/shared/ThreadsTab';
import RepliesTab from '@/components/shared/RepliesTab';

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
  if (!userFromDB) {
    // TODO: toast a message
    redirect('/');
  }

  const replies = await getReplies(userFromDB._id);

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
            {profileTabs.slice(0, 2).map((tab) => (
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
                {tab.label.toLowerCase() === 'replies' &&
                  replies.length > 0 && (
                    <p className='rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                      {replies.length}
                    </p>
                  )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value='threads' className='w-full text-light-1'>
            <ThreadsTab
              currentUserId={user.id}
              accountId={userFromDB.id}
              accountType='User'
            />
          </TabsContent>
          <TabsContent value='replies' className='w-full text-light-1'>
            <RepliesTab currentUserId={user.id} accountId={userFromDB.id} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
