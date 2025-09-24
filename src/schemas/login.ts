import * as z from 'zod';

export const LoginSchema = z.object({
  login: z
    .string()
    .min(2, { message: 'Login must be at least 2 characters' })
    .max(100, { message: 'Login must be at most 100 characters' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .max(100, { message: 'Password must be at most 100 characters' }),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
