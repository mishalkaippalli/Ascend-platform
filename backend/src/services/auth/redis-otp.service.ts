import { randomInt } from 'crypto';

import { redisClient } from '../../config/redis';
import { IOtpService } from '../../interfaces/service/auth/IOtpService';
import { OtpPurpose } from '../../types/auth.types';

export class RedisOtpService implements IOtpService {
  private readonly _otpExpirationSeconds = 300;
  private readonly _resendCooldownSeconds = 60;

  private getKey(identifier: string, purpose: OtpPurpose): string {
    return `otp:${purpose.toLowerCase()}:${identifier.trim().toLowerCase()}`;
  }

  private getCooldownKey(
    identifier: string,
    purpose: OtpPurpose,
  ): string {
    return `otp:cooldown:${purpose.toLowerCase()}:${identifier.trim().toLowerCase()}`;
  }

async generateAndStore(
  identifier: string,
  purpose: OtpPurpose,
): Promise<string> {
  const otp = randomInt(100000, 1000000).toString();
  // console.log("otp", otp)
  const key = this.getKey(identifier, purpose);

  await redisClient.set(key, otp, {
    EX: this._otpExpirationSeconds,
  });

  return otp;
}

async verify(
  identifier: string,
  purpose: OtpPurpose,
  otp: string,
): Promise<boolean> {
  const key = this.getKey(identifier, purpose);

  const storedOtp = await redisClient.get(key);

  // Reject missing, expired, or incorrect OTPs.
  if (storedOtp === null || storedOtp !== otp) {
    return false;
  }

  // Consume the OTP after successful verification.
  await redisClient.del(key);

  return true;
}


  async acquireResendCooldown(
    identifier: string,
    purpose: OtpPurpose,
  ): Promise<boolean> {
    const key = this.getCooldownKey(identifier, purpose);

    const result = await redisClient.set(key, '1', {
      EX: this._resendCooldownSeconds,
      NX: true,
    });

    return result === 'OK';
  }
}
