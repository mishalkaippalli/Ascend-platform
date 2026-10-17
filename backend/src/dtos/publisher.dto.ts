import {
  PublisherType,
  PublisherVerificationStatus,
} from '../types/publisher.types';

export interface IPublisherSignupDTO {
  name: string;
  email: string;
  password: string;
  publisherType: PublisherType;
  organizationName?: string;
}

export interface IPublisherSignupResponseDTO {
  userId: string;
  publisherId: string;
  name: string;
  email: string;
  publisherType: PublisherType;
  organizationName?: string;
  verificationStatus: PublisherVerificationStatus;
  emailVerified: boolean;
}

export interface IPublisherVerificationStatusDTO {
  status: PublisherVerificationStatus;
  reason?: string;
  reviewedAt?: Date;
}