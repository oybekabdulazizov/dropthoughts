'use client';

import { ThreadValidation } from '@/lib/validations/thread.validation';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod.js';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import * as z from 'zod';
import { createThread } from '@/lib/actions/thread.actions';

export default function PostThread({ authorId }: { authorId: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: '',
      author: JSON.parse(authorId),
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    await createThread({
      text: values.thread,
      author: values.author,
      path: pathname,
    });

    router.push('/');
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col justify-start gap-8'
      >
        <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-2 w-full'>
              <FormLabel className='text-base-semibold text-light-2 py-3'>
                What's on your mind? 🤔
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='bg-primary-500'>
          Submit
        </Button>
      </form>
    </Form>
  );
}
