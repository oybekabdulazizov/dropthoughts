import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import UserCard from '@/components/cards/UserCard';

import { fetchUser, fetchUserFollowings } from '@/lib/actions/user.actions';

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  if (!params || !params.id) {
    redirect('/');
  }

  const currentUser_clerk = await currentUser();
  if (!currentUser_clerk) redirect('/auth/sign-in');

  const currentUser_db = await fetchUser(currentUser_clerk.id);
  if (!currentUser_db) redirect('/auth/onboarding');

  const user_db = await fetchUser(params.id);

  const userWithFollowings = await fetchUserFollowings(user_db._id);

  return (
    <div>
      <h1 className='head-text'>Following</h1>
      {userWithFollowings.following.length > 0 ? (
        <>
          {userWithFollowings.following.map((user: any, i: any) => (
            <UserCard
              key={user._id}
              idUser_clerk={user.idUser_clerk}
              name={user.name}
              username={user.username}
              image={user.image}
              thoughts={user.thoughts}
              nth={i}
              resultLength={userWithFollowings.following.length}
            />
          ))}
        </>
      ) : (
        <p className='no-result mt-6'>No following anyone yet.</p>
      )}
    </div>
  );
}
