export type PublisherType = 'individual' | 'organization'

export type PublisherVerificationStatus =
  | 'pending'
  | 'approved'
  | 'rejected'

// The user is populated when fetching pending applications.
export interface PublisherUser {
  _id: string
  name: string
  email: string
  emailVerified: boolean
  isActive: boolean
  createdAt: string
}

// One publisher application returned by the pending endpoint.
export interface PendingPublisher {
  _id: string
  userId: PublisherUser
  publisherType: PublisherType
  organizationName?: string
  verification: {
    status: PublisherVerificationStatus
    reason?: string
    reviewedAt?: string
    reviewedBy?: string
  }
  createdAt: string
  updatedAt: string
}

// Common structure used by your backend API responses.
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface RejectPublisherDTO {
  reason: string
}