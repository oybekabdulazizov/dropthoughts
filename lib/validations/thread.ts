import * as z from 'zod';

export const ThreadValidation = z.object({
  thread: z
    .string()
    .nonempty()
    .min(3, 'A thread must contain minumum 3 characters.')
    .max(500, 'A thread cannot exceed 500 characters'),
  authorId: z.string(),
});

export const CommentValidation = z.object({
  thread: z
    .string()
    .nonempty()
    .min(3, 'A thread must contain minumum 3 characters.')
    .max(500, 'A thread cannot exceed 500 characters'),
  authorId: z.string(),
});
