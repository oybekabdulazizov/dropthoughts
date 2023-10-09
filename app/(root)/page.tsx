import ThoughtCard from '@/components/cards/ThoughtCard';
import { fetchThoughts } from '@/lib/actions/thought.actions';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function Home() {
  const currentUser_clerk = await currentUser();

  const result = await fetchThoughts({ pageNumber: 1, pageSize: 30 });

  return (
    <>
      <h1 className='head-text text-left'>Thoughts</h1>
      <section className='mt-6 flex flex-col gap-6'>
        {result.thoughts.length === 0 ? (
          <p className='no-result'>No thoughts yet.</p>
        ) : (
          <>
            {result.thoughts.map((thought: any) => (
              <ThoughtCard
                key={thought._id}
                thoughtId={thought._id}
                currentUserId_clerk={currentUser_clerk?.id || null}
                thought={thought.text}
                image={thought.image}
                author={thought.author}
                createdAt={thought.createdAt}
                comments={thought.childrenThoughts}
                likes={thought.likes}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}
