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

export interface IPublisherProfileDTO {
  user: {
    name: string;
    email: string;
    profilepic?: {
      publicId: string;
      url: string;
    };
  };

  publisher: {
    publisherType: PublisherType;
    organizationName?: string;
    verification: IPublisherVerificationStatusDTO;
    createdAt: Date;
    updatedAt: Date;
  };
}
