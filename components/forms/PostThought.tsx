'use client';

import { ThoughtValidation } from '@/lib/validations/thought.validation';
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
import { createThought } from '@/lib/actions/thought.actions';

export default function PostThought({ authorId }: { authorId: string }) {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(ThoughtValidation),
    defaultValues: {
      thought: '',
      author: JSON.parse(authorId),
    },
  });

  const onSubmit = async (values: z.infer<typeof ThoughtValidation>) => {
    setSubmitting(true);
    await createThought({
      text: values.thought,
      author: values.author,
      path: pathname,
    });

    router.push('/');

    setSubmitting(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col justify-start gap-6'
      >
        <FormField
          control={form.control}
          name='thought'
          render={({ field }) => (
            <FormItem className='flex flex-col gap-1 w-full'>
              <FormLabel className='text-base-semibold text-light-2 pt-3 pb-1'>
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

        <Button type='submit' className='bg-primary-500' disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Form>
  );
}
