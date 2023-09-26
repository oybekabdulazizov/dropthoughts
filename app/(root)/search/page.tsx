import Search from '@/components/shared/Search';
import { Input } from '@/components/ui/input';
import { fetchAllThreads } from '@/lib/actions/thread.actions';
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions';
import { useEffect } from 'react';

export default async function Page() {
  const result = await fetchUsers();
  const users = JSON.parse(result);

  const threads = await fetchAllThreads();

  return <Search threads={threads} users={users} />;
}
