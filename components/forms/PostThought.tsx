'use client';

import { ThoughtValidation } from '@/lib/validations/thought.validation';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod.js';
import { usePathname, useRouter } from 'next/navigation';
import React, { ChangeEvent, useState } from 'react';
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
import { createThought, updateThought } from '@/lib/actions/thought.actions';
import Image from 'next/image';
import { Input } from '../ui/input';

interface Props {
  thoughtDetails: {
    thoughtId?: string;
    thought: string;
    image: string;
    authorId: string;
    originalAuthorUsername?: string;
  };
  repost?: boolean;
}

export default function PostThought({ thoughtDetails, repost }: Props) {
  const [file, setFile] = useState<File>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  let thoughtContent = '';

  if (repost && thoughtDetails.originalAuthorUsername) {
    thoughtContent = `@${thoughtDetails.originalAuthorUsername} thinks: ${thoughtDetails.thought}`;
  } else {
    thoughtContent = thoughtDetails.thought;
  }

  const form = useForm({
    resolver: zodResolver(ThoughtValidation),
    defaultValues: {
      image: thoughtDetails.image,
      thought: thoughtContent,
      author: JSON.parse(thoughtDetails.authorId),
    },
  });

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    const fileReader = new FileReader();

    try {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        if (!file.type.includes('image')) {
          // Todo: Use toast notification
          return;
        }
        setFile(e.target.files[0]);

        fileReader.onload = async (event) => {
          const imageDataUrl = event.target?.result?.toString() || '';
          fieldChange(imageDataUrl);
        };

        fileReader.readAsDataURL(file);
      }
    } catch (error: any) {
      throw new Error(`(handleImage): ${error.message}`);
    }
  };

  const onSubmit = async (values: z.infer<typeof ThoughtValidation>) => {
    setSubmitting(true);
    if (
      values.image &&
      values.image.trim().length > 0 &&
      !values.image.includes('res.cloudinary.com')
    ) {
      const formData = new FormData();
      formData.append('file', file!);
      formData.append('upload_preset', 'dropthoughts_preset');
      try {
        const data = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        ).then((res) => res.json());
        values.image = data.secure_url;
      } catch (error: any) {
        throw new Error(`(uploadToCloudinary): ${error.message}`);
      }
    }

    if (thoughtDetails.thoughtId) {
      await updateThought({
        thoughtId: JSON.parse(thoughtDetails.thoughtId),
        thought: values.thought,
        image: values.image || '',
        path: pathname,
      });
    } else {
      await createThought({
        text: values.thought,
        image: values.image || '',
        author: values.author,
        repost: repost ? repost : false,
        path: pathname,
      });
    }

    router.push('/');
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col justify-start gap-4'
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
                  rows={7}
                  className='account-form_input no-focus'
                  {...field}
                  disabled={repost}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem className='flex flex-col col-1 items-center gap-2'>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
                <Input
                  id='image'
                  type='file'
                  placeholder='Upload a photo'
                  accept='image/*'
                  className='cursor-pointer bg-transparent outline-none file:text-blue border border-dark-4'
                  onChange={(e) => handleImage(e, field.onChange)}
                  disabled={repost}
                />
              </FormControl>

              {field.value && (
                <Image
                  src={field.value}
                  alt='thought photo'
                  width={450}
                  height={450}
                  priority
                  className='rounded-md border border-dark-4'
                />
              )}
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='bg-primary-500 mt-2'
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </Form>
  );
}
