import ThoughtCard from '@/components/cards/ThoughtCard';
import Trigger from '@/components/shared/Trigger';
import { fetchAllThoughts, fetchThoughts } from '@/lib/actions/thought.actions';
import { currentUser } from '@clerk/nextjs';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Home({ searchParams }: Props) {
  const page =
    typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const limit =
    typeof searchParams.limit === 'string' ? Number(searchParams.limit) : 5;
  const currentUser_clerk = await currentUser();

  const { thoughts, hasNext } = await fetchThoughts({ page, limit });

  return (
    <>
      <h1 className='head-text text-left'>Thoughts</h1>
      <section className='mt-6 flex flex-col gap-6'>
        {thoughts.length === 0 ? (
          <p className='no-result'>No thoughts yet.</p>
        ) : (
          <>
            {thoughts.map((thought: any) => (
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
                archived={thought.archived}
              />
            ))}
            <Trigger limit={limit} hasNext={hasNext} route='' />
          </>
        )}
      </section>
      {/* <div className='flex justify-center items-center gap-4 mt-8'>
        <Link
          href={`?page=${page > 1 ? page - 1 : 1}`}
          className={`text-light-1 bg-dark-2 rounded-md px-4 py-2 text-small-regular ${
            page <= 1 && 'pointer-events-none opacity-50'
          }`}
        >
          Previous
        </Link>
        <Link
          href={`?page=${hasNext && page + 1}`}
          className={`text-light-1 bg-dark-2 rounded-md px-4 py-2 text-small-regular ${
            !hasNext && 'pointer-events-none opacity-50'
          }`}
        >
          Next
        </Link>
      </div> */}
    </>
  );
}
