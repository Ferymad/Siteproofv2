import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2).max(50).optional(),
})

export type User = z.infer<typeof userSchema>

// Form validation schema with password confirmation
export const signUpSchema = userSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

// Update profile schema
export const profileUpdateSchema = z.object({
  full_name: z.string().min(1).max(100),
  avatar_url: z.string().url().optional(),
  bio: z.string().max(500).optional(),
})