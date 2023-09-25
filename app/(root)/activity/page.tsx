import LikesTab from '@/components/shared/LikesTab';
import RepliesTab from '@/components/shared/RepliesTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { activityTabs } from '@/constants';
import { getLikes } from '@/lib/actions/like.action';
import { fetchUser, getReplies } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default async function Page() {
  const currentUser_clerk = await currentUser();
  if (!currentUser_clerk) {
    redirect('/auth/sign-in');
  }

  const currentUser_db = await fetchUser(currentUser_clerk.id);
  if (!currentUser_db) {
    redirect('/auth/onboarding');
  }

  const replies = await getReplies(currentUser_db._id);
  const likesForUserThreads = await getLikes(currentUser_db._id);

  return (
    <>
      <h1 className='head-text text-left'>Activities</h1>
      <div className='mt-6'>
        <Tabs defaultValue='likes' className='w-full'>
          <TabsList className='tab'>
            {activityTabs.map((tab) => {
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

                  {tab.value === 'likes' && (
                    <p className='rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                      {likesForUserThreads.length}
                    </p>
                  )}
                  {tab.label.toLowerCase() === 'replies' && (
                    <p className='rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                      {replies.length}
                    </p>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value='likes' className='w-full text-light-1'>
            <LikesTab currentUserId={JSON.stringify(currentUser_db._id)} />
          </TabsContent>
          <TabsContent value='replies' className='w-full text-light-1'>
            <RepliesTab
              // currentUserId_clerk={currentUser_clerk.id}
              idUser_clerk={currentUser_db.idUser_clerk}
              // authorId={JSON.stringify(user_db._id)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
