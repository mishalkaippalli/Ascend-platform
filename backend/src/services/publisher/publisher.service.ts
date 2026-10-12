import {
  IPublisherSignupDTO,
  IPublisherSignupResponseDTO,
} from '../../dtos/publisher.dto';

import { IPublisherRepository } from '../../interfaces/repository/IPublisherRepository';
import { IUserRepository } from '../../interfaces/repository/IUserRepository';

import { IPasswordHasher } from '../../interfaces/service/auth/IPasswordHasher';
import { IOtpService } from '../../interfaces/service/auth/IOtpService';
import { IEmailService } from '../../interfaces/service/auth/IEmailService';

import { IPublisherService } from '../../interfaces/service/publisher/IPublisherService';
import { ConflictError } from '../../errors/conflict.error';
import { UserRole, OtpPurpose } from '../../types/auth.types';
import { PublisherMapper } from '../../mappers/publisher.mapper';

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
}