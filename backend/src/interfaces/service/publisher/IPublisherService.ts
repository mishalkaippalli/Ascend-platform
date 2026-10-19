import {
  IPublisherProfileDTO,
  IPublisherSignupDTO,
  IPublisherSignupResponseDTO,
  IPublisherVerificationStatusDTO
} from '../../../dtos/publisher.dto';

import { IPublisher } from '../../../models/publisher/publisher.model';

export interface IPublisherService {
  signup(
    data: IPublisherSignupDTO
  ): Promise<IPublisherSignupResponseDTO>;

  findPending(): Promise<IPublisher[]>

  approvePublisher(
    publisherId: string,
    adminId: string,
  ): Promise<IPublisher>;

  rejectPublisher(
    publisherId: string,
    adminId: string,
    reason: string,
  ): Promise<IPublisher>;

  getMyVerificationStatus(
   userId: string,
  ): Promise<IPublisherVerificationStatusDTO>;

  getMyProfile(
    userId: string
  ): Promise<IPublisherProfileDTO>;
}