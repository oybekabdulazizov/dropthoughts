import { currentUser } from '@clerk/nextjs';

import { fetchUser, fetchUsers } from '@/lib/actions/user.actions';

import SmallUserCard from '../cards/SmallUserCard';

export default async function RightSidebar() {
  const currentUser_clerk = await currentUser();

  const currentUser_db = await fetchUser(currentUser_clerk?.id || '');

  const users = await fetchUsers();
  const orderedUsers = users
    .filter((user: any) => !user._id.equals(currentUser_db?._id || ''))
    .sort((a: any, b: any) => b.thoughts.length - a.thoughts.length);

  return (
    <section className='custom-scrollbar rightsidebar'>
      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-light-1'>Suggested Users</h3>
        {orderedUsers.slice(0, 10).map((user: any) => (
          <SmallUserCard
            key={user._id}
            idUser_clerk={user.idUser_clerk}
            name={user.name}
            username={user.username}
            image={user.image}
            thoughts={user.thoughts}
          />
        ))}
      </div>
    </section>
  );
}
