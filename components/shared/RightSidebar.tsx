import { fetchUser, fetchUsers } from '@/lib/actions/user.actions';
import SmallUserCard from '../cards/SmallUserCard';
import { currentUser } from '@clerk/nextjs';

export default async function RightSidebar() {
  const currentUser_clerk = await currentUser();

  const currentUser_db = await fetchUser(currentUser_clerk?.id || '');

  const users = await fetchUsers();
  const orderedUsers = users
    .filter((user) => !user._id.equals(currentUser_db?._id || ''))
    .sort((a, b) => b.threads.length - a.threads.length);

  return (
    <section className='custom-scrollbar rightsidebar'>
      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-light-1'>Suggested Users</h3>
        {orderedUsers.slice(0, 10).map((user) => (
          <SmallUserCard
            key={user._id}
            idUser_clerk={user.idUser_clerk}
            name={user.name}
            username={user.username}
            image={user.image}
            threads={user.threads}
          />
        ))}
      </div>
    </section>
  );
}
