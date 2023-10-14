// import { fetchUserThoughts } from '@/lib/actions/user.actions';
import { fetchUserThoughts } from '@/lib/actions/thought.actions';
import { redirect } from 'next/navigation';
import ThoughtCard from '../cards/ThoughtCard';

interface Props {
  currentUserId_clerk: string;
  authorId: string;
}

export default async function ThoughtsTab({
  currentUserId_clerk,
  authorId,
}: Props) {
  const userThoughts = await fetchUserThoughts(authorId);
  if (userThoughts.errorCode === 404) redirect('/');

  return (
    <section className='mt-2 w-full flex flex-col'>
      {userThoughts.length > 0 ? (
        <>
          {userThoughts.map((thought: any) => (
            <div className='mt-4'>
              <ThoughtCard
                key={thought._id}
                thoughtId={thought._id}
                currentUserId_clerk={currentUserId_clerk}
                thought={thought.text}
                image={thought.image}
                author={thought.author}
                createdAt={thought.createdAt}
                comments={thought.childrenThoughts}
                likes={thought.likes}
                archived={thought.archived}
              />
            </div>
          ))}
        </>
      ) : (
        <p className='no-result mt-4'>No thoughts yet.</p>
      )}
    </section>
  );
}
