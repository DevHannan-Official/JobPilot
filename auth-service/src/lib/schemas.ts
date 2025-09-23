import { z } from 'zod';

export const signUpSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: 'Please fill all the fields',
    })
    .min(3, {
      message: 'Full Name must be at least 3 characters',
    }),
  email: z
    .string()
    .min(1, {
      message: 'Please fill all the fields',
    })
    .email({
      message: 'Please enter a valid email address',
    }),
  password: z
    .string()
    .min(1, {
      message: 'Please fill all the fields',
    })
    .min(8, {
      message: 'Password must be at least 8 characters',
    })
    .regex(new RegExp('(?=.*[a-z])(?=.*[A-Z])'), {
      message: 'Password must contain at least one upper and lower case letter',
    })
    .regex(new RegExp('(?=.*[0-9])'), {
      message: 'Password must contain at least one number',
    })
    .regex(new RegExp('(?=.*[!@#$%^&*])'), {
      message: 'Password must contain at least one special character',
    }),
});

export const signInSchema = z.object({
  email: z.string().min(1, {
    message: 'Please fill all the fields',
  }),
  password: z.string().min(1, {
    message: 'Please fill all the fields',
  }),
});
