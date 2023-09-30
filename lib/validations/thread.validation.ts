import * as z from 'zod';

export const ThreadValidation = z.object({
  thread: z
    .string()
    .min(3, 'A thread must contain minumum 3 characters.')
    .max(500, 'A thread cannot exceed 500 characters')
    .nonempty(),
  author: z.string(),
});

export const CommentValidation = z.object({
  thread: z
    .string()
    .min(3, 'A thread must contain minumum 3 characters.')
    .max(500, 'A thread cannot exceed 500 characters')
    .nonempty(),
  author: z.string(),
});
