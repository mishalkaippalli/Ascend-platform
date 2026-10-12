import { z } from 'zod';

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must not exceed 50 characters'),

  email: z.string().trim().email('Please provide a valid email address'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters'),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(128),
});

export const verifyOtpSchema = z.object({
  email: z.email(),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
});

export const resendOtpSchema = z.object({
  email: z.email(),
  purpose: z.enum([
    'email_verification',
    'password_reset',
  ]),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const verifyResetOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d+$/, 'OTP must contain only digits'),
});

export const resetPasswordSchema = z.object({
  resetToken: z
    .string()
    .min(1, 'Reset token is required'),

  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
});

export type SignupInput = z.infer<typeof signupSchema>;
