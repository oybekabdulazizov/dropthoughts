'use client';

import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import UserCard from '../cards/UserCard';
import Link from 'next/link';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { searchTabs } from '@/constants';
import SimpleThreadCard from '../cards/SimpleThreadCard';

interface Props {
  users_stringified: string;
  threads_stringified: string;
}

export default function Search({
  users_stringified,
  threads_stringified,
}: Props) {
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [filteredThreads, setFilteredThreads] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([...JSON.parse(users_stringified)]);
  const [threads, setThreads] = useState<any[]>([
    ...JSON.parse(threads_stringified),
  ]);

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
      <div className='mt-6'>
        <Tabs defaultValue='users' className='w-full'>
          <TabsList className='tab'>
            {searchTabs.map((tab) => {
              // if (
              //   tab.value === 'favourites' &&
              //   currentUser_db.idUser_clerk !== user_db.idUser_clerk
              // ) {
              //   return;
              // }
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
                  {tab.value === 'threads' && (
                    <>
                      <p className='rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                        {filteredThreads.length}
                      </p>
                    </>
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value='users' className='w-full text-light-1'>
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
          </TabsContent>
          <TabsContent value='threads' className='w-full text-light-1'>
            {filteredThreads.length > 0 &&
            searchTerm &&
            searchTerm.trim().length > 0 ? (
              <div className='mt-8'>
                {filteredThreads.map((thread, i) => (
                  <SimpleThreadCard
                    key={thread._id}
                    threadId={thread._id}
                    content={thread.text}
                    author={thread.author}
                    createdAt={thread.createdAt}
                    comments={thread.childrenThreads}
                    likes={thread.likes}
                  />
                ))}
              </div>
            ) : (
              <p className='no-result'>No threads found.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
      {/* {(filteredUsers.length > 0 || filteredThreads.length > 0) &&
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
      )} */}
    </div>
  );
}
