import { createHash, randomBytes } from 'crypto';

import { redisClient } from '../../config/redis';
import { IPasswordResetTokenService } from '../../interfaces/service/auth/IPasswordResetTokenService';

const RESET_TOKEN_TTL = 10 * 60;

export class RedisPasswordResetTokenService
  implements IPasswordResetTokenService
{
  async generateAndStore(userId: string): Promise<string> {
    const token = randomBytes(32).toString('hex');
     
    const tokenHash = createHash('sha256')
      .update(token)
      .digest('hex');

    const key = `password-reset:${tokenHash}`;

    await redisClient.set(key, userId, {
      EX: RESET_TOKEN_TTL,
    });

    return token;
  }

  async consume(token: string): Promise<string> {
    const tokenHash = createHash('sha256')
      .update(token)
      .digest('hex');

    const key = `password-reset:${tokenHash}`;

    const userId = await redisClient.get(key);

    if (!userId) {
      throw new Error('Invalid or expired password reset token');
    }

    await redisClient.del(key);

    return userId;
  }
}