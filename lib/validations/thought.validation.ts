import * as z from 'zod';

export const ThoughtValidation = z.object({
  image: z.string().url().optional().or(z.literal('')),
  thought: z
    .string()
    .min(3, 'A thought must contain minumum 3 characters.')
    .max(500, 'A thought cannot exceed 500 characters')
    .nonempty(),
  author: z.string(),
});

export const CommentValidation = z.object({
  image: z.string().url().optional().or(z.literal('')),
  thought: z
    .string()
    .min(3, 'A thought must contain minumum 3 characters.')
    .max(500, 'A thought cannot exceed 500 characters')
    .nonempty(),
  author: z.string(),
});
