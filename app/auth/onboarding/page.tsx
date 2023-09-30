import AccountProfile from '@/components/forms/AccountProfile';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function Page() {
  const currentUser_clerk = await currentUser();

  if (!currentUser_clerk) {
    redirect('/auth/sign-in');
  }

  const userDetails = {
    idUser_clerk: currentUser_clerk.id,
    username: currentUser_clerk.username || '',
    name: currentUser_clerk.firstName || '',
    bio: '',
    image: currentUser_clerk.imageUrl || '',
  };

  return (
    <main className='mx-auto flex w-full max-w-3xl flex-col justify-start px-10 py-10'>
      <h1 className='head-text'>Onboarding</h1>
      <p className='mt-3 mb-6 text-base-regular text-light-2'>
        Let's get to know you better now, friend.
      </p>

      <section className='bg-dark-2 p-8'>
        <AccountProfile userDetails={userDetails} action='onboarding' />
      </section>
    </main>
  );
}
