import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Image from 'next/image';

import { profileTabs } from '@/constants';
import ProfileHeader from '@/components/shared/ProfileHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThoughtsTab from '@/components/shared/ThoughtsTab';
import FavouritesTab from '@/components/shared/FavoruitesTab';
import ArchivesTab from '@/components/shared/ArchivesTab';

import { fetchUser } from '@/lib/actions/user.actions';
import { fetchUserLikedThoughts } from '@/lib/actions/like.action';
import {
  fetchUserArchivedThoughts,
  fetchUserThoughts,
} from '@/lib/actions/thought.actions';

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
    redirect('/auth/onboarding');
  }

  const user_db = await fetchUser(params.id);
  if (!user_db) {
    redirect('/');
  }

  const userThoughts = await fetchUserThoughts(user_db._id);

  const favouriteThoughts = await fetchUserLikedThoughts(user_db._id);

  const archivedThoughts = await fetchUserArchivedThoughts(user_db._id);

  return (
    <section>
      <ProfileHeader
        idUser_clerk={user_db.idUser_clerk}
        userId={user_db._id}
        currentUserId_clerk={currentUser_clerk.id}
        currentUserId_db={currentUser_db._id}
        name={user_db.name}
        username={user_db.username}
        image={user_db.image}
        bio={user_db.bio}
        followers={user_db.followers}
      />

      <div className='mt-6'>
        <Tabs defaultValue='thoughts' className='w-full'>
          <TabsList className='tab'>
            {profileTabs.map((tab) => {
              if (
                (tab.value === 'favourites' || tab.value === 'archived') &&
                currentUser_db.idUser_clerk !== user_db.idUser_clerk
              ) {
                return;
              }
              return (
                <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                  {tab.value === 'archived' ? (
                    <Image
                      src={tab.icon}
                      alt={tab.label}
                      width={20}
                      height={20}
                      className='object-contain'
                    />
                  ) : (
                    <Image
                      src={tab.icon}
                      alt={tab.label}
                      width={24}
                      height={24}
                      className='object-contain'
                    />
                  )}
                  <p className='max-sm:hidden'>{tab.label}</p>

                  {tab.value === 'thoughts' && (
                    <p className='rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                      {userThoughts.length}
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
                  {tab.value === 'archived' && (
                    <>
                      {currentUser_clerk.id === user_db.idUser_clerk && (
                        <p className='rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                          {archivedThoughts.length}
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
              authorId={user_db._id}
            />
          </TabsContent>
          <TabsContent value='favourites' className='w-full text-light-1'>
            <FavouritesTab
              idUser_clerk={user_db.idUser_clerk}
              currentUserId_clerk={currentUser_clerk.id}
            />
          </TabsContent>
          <TabsContent value='archived' className='w-full text-light-1'>
            <ArchivesTab
              currentUserId_clerk={currentUser_clerk.id}
              authorId={user_db._id}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
