import Search from '@/components/shared/Search';
import { fetchAllThreads } from '@/lib/actions/thread.actions';
import { fetchUsers } from '@/lib/actions/user.actions';
import { ChangeEvent } from 'react';

export default async function Page() {
  const users = await fetchUsers();

  const threads = await fetchAllThreads();

  return (
    <div>
      <Search
        users_stringified={JSON.stringify(users)}
        threads_stringified={JSON.stringify(threads)}
      />
    </div>
  );
}
