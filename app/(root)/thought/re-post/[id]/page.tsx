import PostThought from '@/components/forms/PostThought';
import { fetchThought } from '@/lib/actions/thought.actions';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const currentUser_clerk = await currentUser();
  if (!currentUser_clerk) {
    redirect('/auth/sign-in');
  }

  const currentUser_db = await fetchUser(currentUser_clerk.id);
  if (!currentUser_db) {
    redirect('/auth/onboarding');
  }

  if (Object.keys(params).length === 0) {
    redirect('/');
  }

  const thought = await fetchThought(params.id);
  if (!thought || thought.errorCode === 404) {
    redirect('/');
  }

  console.log(thought.author);

  const thoughtDetails = {
    thought: thought.text,
    image: thought.image,
    authorId: JSON.stringify(currentUser_db._id),
    originalAuthorUsername: thought.author.username,
  };

  return (
    <div>
      <h1 className='head-text'>Re-post a Thought</h1>
      <PostThought thoughtDetails={thoughtDetails} repost={true} />
    </div>
  );
}
