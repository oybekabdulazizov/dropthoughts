import PostThread from '@/components/forms/PostThread';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function Page() {
  const userFromClerk = await currentUser();
  if (!userFromClerk) redirect('/auth/sign-in');

  const userFromDB = await fetchUser(userFromClerk.id);
  if (!userFromDB) {
    redirect('/auth/onboarding');
  }
  return (
    <div>
      <h1 className='head-text'>Create Thread</h1>
      <PostThread user_id={JSON.stringify(userFromDB._id)} />
    </div>
  );
}
