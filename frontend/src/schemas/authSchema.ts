import { z } from 'zod'

const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .max(128, 'Password cannot exceed 128 characters')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[0-9]/, 'Password must contain a number')
  .regex(
    /[^A-Za-z0-9\s]/,
    'Password must contain a special character',
  )
  .regex(/^\S+$/, 'Password cannot contain whitespace')


export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, 'Name must be at least 2 characters')
      .max(50, 'Name must not exceed 50 characters'),

    email: z
      .string()
      .trim()
      .email('Please provide a valid email address'),

    password: passwordSchema,

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Please provide a valid email address'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters'),
})

export const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email address'),

  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d+$/, 'OTP must contain only digits'),
})

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Please provide a valid email address'),
})

export const resetPasswordSchema = z
  .object({
    resetToken: z.string().min(1, 'Reset token is required'),

    newPassword: passwordSchema,

    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })


 export const publisherSignupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must not exceed 50 characters'),

    email: z
      .string()
      .trim()
      .email('Please provide a valid email address'),

    password: passwordSchema,

    confirmPassword: z.string(),

    publisherType: z.enum(['individual', 'organization']),

    organizationName: z
      .string()
      .trim()
      .max(100, 'Organization name must not exceed 100 characters')
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine(
    (data) =>
      data.publisherType === 'individual' ||
      Boolean(data.organizationName),
    {
      message: 'Organization name is required',
      path: ['organizationName'],
    },
  )