'use client';

import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import UserCard from '../cards/UserCard';

interface Props {
  users_stringified: string;
}

export default function Search({ users_stringified }: Props) {
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([...JSON.parse(users_stringified)]);

  const onInputChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (searchTerm && searchTerm.trim().length > 0) {
      const search = setTimeout(() => {
        if (users.length > 0) {
          const usersResult = users.filter((user) => {
            if (
              user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.username.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
              return user;
            }
          });
          setFilteredUsers([...usersResult]);
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
      {filteredUsers.length > 0 &&
      searchTerm &&
      searchTerm.trim().length > 0 ? (
        <div className='mt-8'>
          {filteredUsers.map((user, i) => (
            <UserCard
              key={user._id}
              idUser_clerk={user.idUser_clerk}
              name={user.name}
              username={user.username}
              image={user.image}
              threads={user.threads}
              nth={i}
              resultLength={filteredUsers.length}
            />
          ))}
        </div>
      ) : (
        <p className='no-result'>No users found.</p>
      )}
    </div>
  );
}
