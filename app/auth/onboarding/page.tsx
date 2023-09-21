import AccountProfile from '@/components/forms/AccountProfile';
import { currentUser } from '@clerk/nextjs';

export default async function Page() {
  const userFromClerk = await currentUser();

  if (!userFromClerk) return null;

  const userDetails = {
    idFromClerk: userFromClerk.id,
    username: userFromClerk.username || '',
    name: userFromClerk.firstName || '',
    bio: '',
    image: userFromClerk.imageUrl || '',
  };

  return (
    <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-10'>
      <h1 className='head-text'>Onboarding</h1>
      <p className='mt-3 mb-6 text-base-regular text-light-2'>
        Let's get to know you better now, friend.
      </p>

      <section className='bg-dark-2 p-8'>
        <AccountProfile userDetails={userDetails} btnTitle='Continue' />
      </section>
    </main>
  );
}
