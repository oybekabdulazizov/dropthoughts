import { fetchUserThoughts } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import ThoughtCard from '../cards/ThoughtCard';

interface Props {
  currentUserId_clerk: string;
  authorId: string;
  accountType: string;
}

export default async function ThoughtsTab({
  currentUserId_clerk,
  authorId,
  accountType,
}: Props) {
  const result = await fetchUserThoughts(JSON.parse(authorId));
  if (!result || result.errorCode === 404) redirect('/');

  return (
    <section className='mt-2 w-full flex flex-col'>
      {result.thoughts.length > 0 ? (
        <>
          {result.thoughts.map((thought: any) => (
            <div className='mt-4'>
              <ThoughtCard
                key={thought._id}
                thoughtId={thought._id}
                currentUserId_clerk={currentUserId_clerk}
                thought={thought.text}
                image={thought.image}
                author={
                  accountType === 'User'
                    ? {
                        name: result.name,
                        image: result.image,
                        idUser_clerk: result.id,
                        _id: result._id,
                        username: result.username,
                      }
                    : {
                        name: thought.author.name,
                        image: thought.author.image,
                        idUser_clerk: thought.author.id,
                        _id: thought.author._id,
                        username: thought.author.username,
                      }
                }
                createdAt={thought.createdAt}
                comments={thought.childrenThoughts}
                likes={thought.likes}
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
