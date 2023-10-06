'use client';

import React, { ChangeEvent, Ref, useRef, useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import * as z from 'zod';
import { CommentValidation } from '@/lib/validations/thought.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../ui/input';
import Image from 'next/image';
import { addCommentToThought } from '@/lib/actions/thought.actions';
import { usePathname, useRouter } from 'next/navigation';
import { Schema } from 'mongoose';
import { Textarea } from '../ui/textarea';

interface Props {
  thoughtId: string;
  currentUserImg_db: string;
  currentUserId_db: string;
  currentUserName_db: string;
}

export default function NewComment({
  thoughtId,
  currentUserImg_db,
  currentUserId_db,
  currentUserName_db,
}: Props) {
  const [file, setFile] = useState<File | null>();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const imgRef = useRef<HTMLInputElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thought: '',
      image: '',
      author: currentUserId_db,
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

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    setSubmitting(true);

    if (
      values.image &&
      values.image.length > 0 &&
      !values.image.includes('res.cloudinary.com')
    ) {
      const formData = new FormData();
      formData.append('file', file!);
      formData.append('upload_preset', 'dropthoughts_preset');
      try {
        const data: any = await fetch(
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

    const result = await addCommentToThought({
      thoughtId: JSON.parse(thoughtId),
      commentText: values.thought,
      image: values.image || '',
      author: JSON.parse(values.author),
      path: pathname,
    });

    if (result?.errorCode === 404) {
      router.push('/');
    }

    form.reset();
    setFile(null);

    setSubmitting(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col justify-start gap-4 my-6 border-y-2 border-dark-4 py-6'
      >
        <FormField
          control={form.control}
          name='thought'
          render={({ field }) => (
            <FormItem className='flex flex-col items-start gap-2'>
              <div className='flex flex-row gap-3 w-full'>
                <FormLabel>
                  <Image
                    src={currentUserImg_db}
                    alt={`Profile image of ${currentUserName_db}`}
                    width={45}
                    height={45}
                    className='rounded-full object-cover'
                  />
                </FormLabel>
                <FormControl className='border-none bg-transparent'>
                  <Textarea
                    rows={1}
                    placeholder='Comment...'
                    className='no-focus text-light-1 outline-none bg-dark-4'
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage className='ml-[53px]' style={{ marginTop: '0' }} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem className='flex flex-col md:flex-row items-start justify-start gap-4 ml-[53px]'>
              <FormLabel
                className={`
                    text-light-1 
                    cursor-pointer 
                    bg-transparent outline-none 
                    border border-dark-4 
                    py-4 px-4 md:px-4 lg:px-8 rounded-md
                    text-center 
                    w-full md:w-auto 
                `}
              >
                Choose {file ? 'another' : 'an'} image
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-200 mt-2'>
                <Input
                  ref={imgRef}
                  type='file'
                  placeholder='Upload a photo'
                  accept='image/*'
                  className='hidden'
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>

              {field.value && (
                <Image
                  src={field.value}
                  alt='thought photo'
                  width={300}
                  height={300}
                  priority
                  className='rounded-md border border-dark-4'
                  style={{ marginTop: '0' }}
                />
              )}
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='bg-primary-500 ml-[53px] mt-1'
          disabled={form.getValues().thought.trim().length < 1 || submitting}
        >
          {submitting ? 'Posting...' : 'Post'}
        </Button>
      </form>
    </Form>
  );
}
