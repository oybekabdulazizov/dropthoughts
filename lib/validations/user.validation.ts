import * as z from 'zod';

export const UserValidation = z.object({
  image: z.string().url().nonempty(),
  name: z
    .string()
    .min(3, 'Should be at least 3 characters')
    .max(50, 'Cannot exceed than 50 characters')
    .nonempty(),
  username: z
    .string()
    .min(3, 'Should be at least 3 characters')
    .max(50, 'Cannot exceed 50 characters')
    .nonempty(),
  bio: z.string().max(1000, 'Cannot exceed 1000 characters'),
});
