import { Types } from 'mongoose'

import { ISignupResponseDTO } from '../../dtos/auth.dto'
import { IUserRepository } from '../../interfaces/repository/IUserRepository'
import { IUserService } from '../../interfaces/service/user/IUserService'
import { UserMapper } from '../../mappers/user.mapper'
import { NotFoundError } from '../../errors/not-found.error'

export class UserService implements IUserService {
  constructor(
    private readonly _userRepository: IUserRepository,
  ) {}

  async getCurrentUser(userId: string): Promise<ISignupResponseDTO> {
    const user = await this._userRepository.findById(
      new Types.ObjectId(userId),
    )

    if (!user) {
      throw new NotFoundError('User not found')
    }

    return UserMapper.toSignupResponse(user)
  }
}