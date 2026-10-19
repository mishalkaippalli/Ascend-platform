export type PublisherVerificationStatus =
  | 'pending'
  | 'approved'
  | 'rejected'

export interface PublisherVerification {
  status: PublisherVerificationStatus
  reason?: string
  reviewedAt?: string
}

export interface PublisherProfileUser {
  name: string
  email: string
  profilepic?: {
    publicId: string
    url: string
  }
}

export interface PublisherProfileDetails {
  publisherType: 'individual' | 'organization'
  organizationName?: string
  verification: PublisherVerification
  createdAt: string
  updatedAt: string
}

export interface PublisherProfile {
  user: PublisherProfileUser
  publisher: PublisherProfileDetails
}
