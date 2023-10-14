'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import { searchTabs } from '@/constants';
import { Input } from '../ui/input';
import UserCard from '../cards/UserCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import SimpleThoughtCard from '../cards/SimpleThoughtCard';

interface Props {
  users_stringified: string;
  thoughts_stringified: string;
}

export default function Search({
  users_stringified,
  thoughts_stringified,
}: Props) {
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [filteredThoughts, setFilteredThoughts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([...JSON.parse(users_stringified)]);
  const [thoughts, setThoughts] = useState<any[]>([
    ...JSON.parse(thoughts_stringified),
  ]);

  const onInputChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (searchTerm && searchTerm.trim().length > 0) {
      const search = setTimeout(() => {
        if (users.length > 0 || thoughts.length > 0) {
          const usersResult = users.filter((user) => {
            if (
              user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.username.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
              return user;
            }
          });
          setFilteredUsers([...usersResult]);

          const thoughtsResult = thoughts.filter((thought) => {
            if (thought.text.toLowerCase().includes(searchTerm.toLowerCase())) {
              return thought;
            }
          });
          setFilteredThoughts([...thoughtsResult]);
        }
      }, 500);
      return () => clearTimeout(search);
    } else {
      setFilteredUsers([]);
      setFilteredThoughts([]);
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
      <div className='mt-6'>
        <Tabs defaultValue='users' className='w-full'>
          <TabsList className='tab'>
            {searchTabs.map((tab) => {
              return (
                <TabsTrigger key={tab.label} value={tab.value} className='tab'>
                  <Image
                    src={tab.icon}
                    alt={tab.label}
                    width={24}
                    height={24}
                    className='object-contain'
                  />
                  <p className='max-sm:hidden'>{tab.label}</p>

                  {tab.value === 'users' && (
                    <p className='rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                      {filteredUsers.length}
                    </p>
                  )}
                  {tab.value === 'thoughts' && (
                    <>
                      <p className='rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                        {filteredThoughts.length}
                      </p>
                    </>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value='users' className='w-full text-light-1 mt-6'>
            {filteredUsers.length > 0 &&
            searchTerm &&
            searchTerm.trim().length > 0 ? (
              <>
                {filteredUsers.map((user, i) => (
                  <UserCard
                    key={user._id}
                    idUser_clerk={user.idUser_clerk}
                    name={user.name}
                    username={user.username}
                    image={user.image}
                    thoughts={user.thoughts}
                    nth={i}
                    resultLength={filteredUsers.length}
                  />
                ))}
              </>
            ) : (
              <p className='no-result mt-6'>No users found.</p>
            )}
          </TabsContent>
          <TabsContent value='thoughts' className='w-full text-light-1 mt-6'>
            {filteredThoughts.length > 0 &&
            searchTerm &&
            searchTerm.trim().length > 0 ? (
              <>
                {filteredThoughts.map((thought, i) => (
                  <SimpleThoughtCard
                    key={thought._id}
                    thoughtId={thought._id}
                    thought={thought.text}
                    author={thought.author}
                    createdAt={thought.createdAt}
                    comments={thought.childrenThoughts}
                    likes={thought.likes}
                  />
                ))}
              </>
            ) : (
              <p className='no-result mt-6'>No thoughts found.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
