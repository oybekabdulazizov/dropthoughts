import Search from '@/components/shared/Search';
import { fetchAllThoughts } from '@/lib/actions/thought.actions';
import { fetchUsers } from '@/lib/actions/user.actions';
import { ChangeEvent } from 'react';

export default async function Page() {
  const users = await fetchUsers();

  const thoughts = await fetchAllThoughts();

  return (
    <div>
      <Search
        users_stringified={JSON.stringify(users)}
        thoughts_stringified={JSON.stringify(thoughts)}
      />
    </div>
  );
}
