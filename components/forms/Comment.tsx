'use client';

import React from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import * as z from 'zod';
import { CommentValidation } from '@/lib/validations/thread.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import Image from 'next/image';
import { addCommentToThread } from '@/lib/actions/thread.actions';
import { usePathname, useRouter } from 'next/navigation';
import { Schema } from 'mongoose';

interface Props {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
  currentUserName: string;
}

export default function Comment({
  threadId,
  currentUserImg,
  currentUserId,
  currentUserName,
}: Props) {
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: '',
      author: currentUserId,
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToThread({
      threadId: JSON.parse(threadId),
      commentText: values.thread,
      author: JSON.parse(values.author),
      path: pathname,
    });

    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='comment-form items-end'
      >
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex flex-row items-end gap-3 w-full'>
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt={`Profile image of ${currentUserName}`}
                  width={48}
                  height={48}
                  className='rounded-full object-cover'
                />
              </FormLabel>
              <FormControl className='border-none bg-transparent'>
                <Input
                  type='text'
                  placeholder='Comment...'
                  className='no-focus text-light-1 outline-none'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='comment-form_btn'
          disabled={form.getValues().thread.length === 0}
        >
          Post
        </Button>
      </form>
    </Form>
  );
}
