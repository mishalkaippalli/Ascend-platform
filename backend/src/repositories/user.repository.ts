import { Types } from 'mongoose';

import {
  CreateUserData,
  IUserRepository,
  UpdateUserData,
} from '../interfaces/repository/IUserRepository';

import { IUser, User } from '../models/user/user.model';

import { BaseRepository } from './base.repository';                                                   /**
 * Passes User-specific types to the generic BaseRepository template:
 * - IUser: Shape of a saved User document in MongoDB (includes _id, timestamps).
 * - CreateUserData: Fields required to create a new user (omits system fields).
 * - UpdateUserData: Allowed fields for updating a user (all fields optional).
 */

export class UserRepository
  extends BaseRepository<IUser, CreateUserData, UpdateUserData>
  implements IUserRepository
{
  constructor() {
    super(User);
  }

  async findByEmail(email: string, includePassword = false) {
    const query = this._model.findOne({ email });

    if (includePassword) {
      query.select('+password');
    }

    return query.exec();
  }

  async updateEmailVerification(
    userId: Types.ObjectId,
    emailVerified: boolean,
  ) {
    return this._model
      .findByIdAndUpdate(
        userId,
        { emailVerified },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();
  }

  async updatePassword(userId: Types.ObjectId, password: string) {
    return this._model
      .findByIdAndUpdate(
        userId,
        { password },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();
  }

  async updateAccountStatus(
    userId: Types.ObjectId,
    isActive: boolean,
    deactivatedAt: Date | null = null,
  ) {
    return this._model
      .findByIdAndUpdate(
        userId,
        {
          isActive,
          deactivatedAt,
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();
  }
}
