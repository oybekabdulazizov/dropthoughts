'use client';

import React, { useState } from 'react';
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
  currentUserImg_db: string;
  currentUserId_db: string;
  currentUserName_db: string;
}

export default function Comment({
  threadId,
  currentUserImg_db,
  currentUserId_db,
  currentUserName_db,
}: Props) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: '',
      author: currentUserId_db,
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    setSubmitting(true);
    const result = await addCommentToThread({
      threadId: JSON.parse(threadId),
      commentText: values.thread,
      author: JSON.parse(values.author),
      path: pathname,
    });

    if (result?.errorCode === 404) {
      router.push('/');
    }

    form.reset();

    setSubmitting(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='comment-form items-center'
      >
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex flex-row items-center gap-3 w-full'>
              <FormLabel>
                <Image
                  src={currentUserImg_db}
                  alt={`Profile image of ${currentUserName_db}`}
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
          {submitting ? 'Posting...' : 'Post'}
        </Button>
      </form>
    </Form>
  );
}
