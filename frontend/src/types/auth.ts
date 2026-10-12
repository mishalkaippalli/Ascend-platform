export type OtpPurpose =
  | 'email_verification'
  | 'password_reset'

export type UserRole =
  | 'user'
  | 'publisher'
  | 'admin'

export type PublisherType =
  | 'individual'
  | 'organization'

export type PublisherVerificationStatus =
  | 'pending'
  | 'approved'
  | 'rejected'

export interface PublisherSignupDTO {
  name: string
  email: string
  password: string
  publisherType: PublisherType
  organizationName?: string
}

export interface PublisherSignupResponseDTO {
  userId: string
  publisherId: string
  name: string
  email: string
  publisherType: PublisherType
  organizationName?: string
  verificationStatus: PublisherVerificationStatus
  emailVerified: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data: T
}

export interface SignupDTO {
  name: string
  email: string
  password: string
}

export interface SignupResponseDTO {
  id: string
  name: string
  email: string
  role: UserRole
  emailVerified: boolean
}

export interface LoginDTO {
  email: string
  password: string
}

export interface LoginResponseDTO {
  user: {
    id: string
    name: string
    email: string
    role: UserRole
    emailVerified: boolean
  }
  accessToken: string
}

export interface VerifyEmailOtpDTO {
  email: string
  otp: string
}

export interface VerifyResetOtpDTO {
  email: string
  otp: string
}

export interface VerifyResetOtpResponseDTO {
  resetToken: string
}

export interface ResetPasswordDTO {
  resetToken: string
  newPassword: string
}

