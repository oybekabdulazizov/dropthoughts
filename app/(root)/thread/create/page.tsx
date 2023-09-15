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
    <>
      <h1 className='head-text'>Create Thread</h1>
      <PostThread userId={userFromDB._id} />
    </>
  );
}
