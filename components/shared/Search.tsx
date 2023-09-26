'use client';

import { useEffect, useState } from 'react';
import { Input } from '../ui/input';

interface Props {
  threads: any[];
  users: any[];
}

export default function Search({ threads, users }: Props) {
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [filteredThreads, setFilteredThreads] = useState<any[]>([]);

  const onInputChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (searchTerm && searchTerm.trim().length > 0) {
      const search = setTimeout(() => {
        if (users.length > 0 || threads.length > 0) {
          const usersResult = users.filter((user) => {
            if (
              user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.username.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
              return user;
            }
          });
          setFilteredUsers([...usersResult]);

          const threadsResult = threads.filter((thread) => {
            if (thread.text.toLowerCase().includes(searchTerm.toLowerCase())) {
              return thread;
            }
          });
          setFilteredThreads([...threadsResult]);
        }
      }, 500);
      return () => clearTimeout(search);
    }
  }, [searchTerm]);

  return (
    <div>
      <h1 className='head-text'>Search</h1>
      <Input
        type='text'
        className='my-4 border-dark-4 bg-dark-3 text-light-1 no-focus'
        value={searchTerm || ''}
        onChange={onInputChange}
      />
      {(filteredUsers.length > 0 || filteredThreads.length > 0) &&
      searchTerm &&
      searchTerm.trim().length > 0 ? (
        <>
          {filteredUsers.map((user, i) => (
            <h3 key={i} className='head-text'>
              {user.name} - {user.username}
            </h3>
          ))}
          {filteredThreads.map((thread, i) => (
            <h3 key={i} className='head-text'>
              {thread.text}
            </h3>
          ))}
        </>
      ) : (
        <>
          {users.map((user, i) => (
            <h3 key={i} className='head-text'>
              {user.name} - {user.username}
            </h3>
          ))}
          {threads.map((thread, i) => (
            <h3 key={i} className='head-text'>
              {thread.text}
            </h3>
          ))}
        </>
      )}
    </div>
  );
}
