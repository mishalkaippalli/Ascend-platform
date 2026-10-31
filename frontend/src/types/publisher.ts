
import type {
  PublisherType,
  PublisherVerificationStatus,
} from './publisherVerification'

// Publisher information returned in the admin listing.
export interface PublisherAdminListItem {
  id: string
  publisherType: PublisherType
  organizationName?: string

  verification: {
    status: PublisherVerificationStatus
    reason?: string
    reviewedAt?: string
  }

  user: {
    id: string
    name: string
    email: string
    emailVerified: boolean
    isActive: boolean
    createdAt: string
  }

  createdAt: string
}
