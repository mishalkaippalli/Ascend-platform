import {
  IPublisherSignupDTO,
  IPublisherSignupResponseDTO,
  IPublisherVerificationStatusDTO,
} from '../../dtos/publisher.dto';

import { IPublisherRepository } from '../../interfaces/repository/IPublisherRepository';
import { IUserRepository } from '../../interfaces/repository/IUserRepository';

import { IPasswordHasher } from '../../interfaces/service/auth/IPasswordHasher';
import { IOtpService } from '../../interfaces/service/auth/IOtpService';
import { IEmailService } from '../../interfaces/service/auth/IEmailService';
import { IPublisher } from '../../models/publisher/publisher.model';

import { IPublisherService } from '../../interfaces/service/publisher/IPublisherService';
import { ConflictError} from '../../errors/conflict.error';
import { NotFoundError } from '../../errors/not-found.error';
import { UserRole, OtpPurpose } from '../../types/auth.types';
import { PublisherMapper } from '../../mappers/publisher.mapper';

import { Types } from 'mongoose';
import { BadRequestError } from '../../../src/errors/bad-request.error';
import { PublisherVerificationStatus } from '../../types/publisher.types';

export class PublisherService implements IPublisherService {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _publisherRepository: IPublisherRepository,
    private readonly _passwordHasher: IPasswordHasher,
    private readonly _otpService: IOtpService,
    private readonly _emailService: IEmailService,
  ) {}

  async signup(
    data: IPublisherSignupDTO,
  ): Promise<IPublisherSignupResponseDTO> {

    const normalizedEmail = data.email.trim().toLowerCase();

    const existingUser =
      await this._userRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new ConflictError(
        'An account with this email already exists',
      );
    }

    const hashedPassword =
      await this._passwordHasher.hash(data.password);

    const user = await this._userRepository.create({
      name: data.name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: UserRole.PUBLISHER,
    });

    const publisher = await this._publisherRepository.create({
      userId: user._id,
      publisherType: data.publisherType,
      ...(data.organizationName !== undefined && {
        organizationName: data.organizationName,
      }),
    });

    const otp = await this._otpService.generateAndStore(
      normalizedEmail,
      OtpPurpose.EMAIL_VERIFICATION,
    );

    await this._emailService.sendOtp(
      normalizedEmail,
      otp,
      OtpPurpose.EMAIL_VERIFICATION,
    );

    return PublisherMapper.toSignupResponse(user, publisher);
  }

  async findPending(): Promise<IPublisher[]> {
   return this._publisherRepository.findPending();
  }

  async approvePublisher(
    publisherId: string,
    adminId: string,
  ): Promise<IPublisher> {
    // Validate IDs before using them in MongoDB queries.
    if (
      !Types.ObjectId.isValid(publisherId) ||
      !Types.ObjectId.isValid(adminId)
    ) {
      throw new BadRequestError('Invalid publisher or admin ID');
    }

    const publisherObjectId = new Types.ObjectId(publisherId);
    const adminObjectId = new Types.ObjectId(adminId);

    const publisher = await this._publisherRepository.approvePending(
      publisherObjectId,
      adminObjectId,
    );

    if (!publisher) {
      throw new ConflictError(
        'Publisher application not found or already reviewed',
      );
    }

    return publisher;
  }

  async rejectPublisher(
    publisherId: string,
    adminId: string,
    reason: string,
  ): Promise<IPublisher> {
    
    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      throw new BadRequestError('Rejection reason is required');
    }

    if (
      !Types.ObjectId.isValid(publisherId) ||
      !Types.ObjectId.isValid(adminId)
    ) {
      throw new BadRequestError('Invalid publisher or admin ID');
    }

    const publisher = await this._publisherRepository.rejectPending(
      new Types.ObjectId(publisherId),
      new Types.ObjectId(adminId),
      trimmedReason,
    );

    if (!publisher) {
      throw new ConflictError(
        'Publisher application not found or already reviewed',
      );
    }

    return publisher;
  }

  async getMyVerificationStatus(userId: string): Promise<IPublisherVerificationStatusDTO> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestError('User ID is not valid');
    }

    const userIdObj = new Types.ObjectId(userId);

    const publisher = await this._publisherRepository.findByUserId(userIdObj);

    if (!publisher) {
      throw new NotFoundError('Publisher application not found');
    }

    const verificationStatus: IPublisherVerificationStatusDTO = {
      status: publisher.verification.status,
    };

    if (publisher.verification.reason !== undefined) {
      verificationStatus.reason = publisher.verification.reason;
    }

    if (publisher.verification.reviewedAt !== undefined) {
      verificationStatus.reviewedAt = publisher.verification.reviewedAt;
    }

    return verificationStatus;
  }
}