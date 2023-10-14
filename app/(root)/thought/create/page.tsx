import PostThought from '@/components/forms/PostThought';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function Page() {
  const currentUser_clerk = await currentUser();
  if (!currentUser_clerk) redirect('/auth/sign-in');

  const currentUser_db = await fetchUser(currentUser_clerk.id);
  if (!currentUser_db) {
    redirect('/auth/onboarding');
  }

  const thoughtDetails = {
    thought: '',
    image: '',
    authorId: JSON.stringify(currentUser_db._id),
  };

  return (
    <div>
      <h1 className='head-text'>Create Thought</h1>
      <p className='text-base-semibold text-light-2 my-3'>
        What's on your mind? 🤔
      </p>
      <PostThought thoughtDetails={thoughtDetails} />
    </div>
  );
}
