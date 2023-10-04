import ProfileHeader from '@/components/shared/ProfileHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { profileTabs } from '@/constants';
import { fetchUser, getReplies } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
import ThoughtsTab from '@/components/shared/ThoughtsTab';
import RepliesTab from '@/components/shared/RepliesTab';
import FavouritesTab from '@/components/shared/FavoruitesTab';
import { fetchUserLikedThoughts } from '@/lib/actions/like.action';

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const currentUser_clerk = await currentUser();
  if (!currentUser_clerk) {
    redirect('/auth/sign-in');
  }

  const currentUser_db = await fetchUser(currentUser_clerk.id);
  if (!currentUser_db) {
    // TODO: toast a message
    redirect('/auth/onboarding');
  }

  const user_db = await fetchUser(params.id);
  if (!user_db) {
    // throw toast error
    // the user does not exist
    redirect('/');
  }

  const favouriteThoughts = await fetchUserLikedThoughts(user_db._id);

  return (
    <section>
      <ProfileHeader
        idUser_clerk={user_db.idUser_clerk}
        _id={user_db._id}
        currentUserId_clerk={currentUser_clerk.id}
        name={user_db.name}
        username={user_db.username}
        image={user_db.image}
        bio={user_db.bio}
      />

      <div className='mt-6'>
        <Tabs defaultValue='thoughts' className='w-full'>
          <TabsList className='tab'>
            {profileTabs.map((tab) => {
              if (
                tab.value === 'favourites' &&
                currentUser_db.idUser_clerk !== user_db.idUser_clerk
              ) {
                return;
              }
              return (
                <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                  <Image
                    src={tab.icon}
                    alt={tab.label}
                    width={24}
                    height={24}
                    className='object-contain'
                  />
                  <p className='max-sm:hidden'>{tab.label}</p>

                  {tab.value === 'thoughts' && (
                    <p className='rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                      {user_db.thoughts.length}
                    </p>
                  )}
                  {tab.value === 'favourites' && (
                    <>
                      {currentUser_clerk.id === user_db.idUser_clerk && (
                        <p className='rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                          {favouriteThoughts.length}
                        </p>
                      )}
                    </>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value='thoughts' className='w-full text-light-1'>
            <ThoughtsTab
              currentUserId_clerk={currentUser_clerk.id}
              authorId={JSON.stringify(user_db._id)}
              accountType='User'
            />
          </TabsContent>
          <TabsContent value='favourites' className='w-full text-light-1'>
            <FavouritesTab
              idUser_clerk={user_db.idUser_clerk}
              currentUserId_clerk={currentUser_clerk.id}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
