import * as z from 'zod';

export const UserValidation = z.object({
  image: z.string().url().nonempty(),
  name: z.string().min(3).max(50).nonempty(),
  username: z.string().min(3).max(50).nonempty(),
  bio: z.string().max(1000),
});
