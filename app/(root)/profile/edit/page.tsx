import AccountProfile from '@/components/forms/AccountProfile';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser, useAuth, useClerk } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function EditProfile() {
  const currentUser_clerk = await currentUser();
  if (!currentUser_clerk) {
    // throw toast error
    redirect('/auth/sign-in');
  }

  const user_db = await fetchUser(currentUser_clerk.id);
  if (!user_db) {
    // throw toast error
    redirect('/auth/onboarding');
  }

  const userDetails = {
    idUser_clerk: user_db.idUser_clerk,
    name: user_db.name,
    username: user_db.username,
    bio: user_db.bio,
    image: user_db.image,
  };

  return (
    <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-0'>
      <h1 className='head-text'>Edit profile</h1>
      <p className='mt-3 mb-6 text-base-regular text-light-2'>
        Anything you wanna update?
      </p>

      <section className='bg-dark-2 p-8'>
        <AccountProfile userDetails={userDetails} action='edit' />
      </section>
    </main>
  );
}
