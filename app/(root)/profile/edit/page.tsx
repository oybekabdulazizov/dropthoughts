import AccountProfile from '@/components/forms/AccountProfile';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser, useAuth, useClerk } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function EditProfile() {
  const userFromClerk = await currentUser();
  if (!userFromClerk) {
    // throw toast error
    redirect('/auth/sign-in');
  }

  const userFromDB = await fetchUser(userFromClerk.id);
  if (!userFromDB) {
    // throw toast error
    redirect('/auth/onboarding');
  }

  const userDetails = {
    idFromClerk: userFromDB.id,
    name: userFromDB.name,
    username: userFromDB.username,
    bio: userFromDB.bio,
    image: userFromDB.image,
  };

  return (
    <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-0'>
      <h1 className='head-text'>Edit profile</h1>
      <p className='mt-3 mb-6 text-base-regular text-light-2'>
        Anything you wanna update?
      </p>

      <section className='bg-dark-2 p-10'>
        <AccountProfile userDetails={userDetails} btnTitle='Continue' />
      </section>
    </main>
  );
}
