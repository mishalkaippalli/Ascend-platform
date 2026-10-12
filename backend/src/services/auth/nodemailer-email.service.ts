import { emailTransporter } from '../../config/email';
import { IEmailService } from '../../interfaces/service/auth/IEmailService';
import { OtpPurpose } from '../../types/auth.types';

export class NodemailerEmailService implements IEmailService {
  async sendOtp(
    email: string,
    otp: string,
    purpose: OtpPurpose,
  ): Promise<void> {
    const isEmailVerification =
      purpose === OtpPurpose.EMAIL_VERIFICATION;

    const subject = isEmailVerification
      ? 'Verify your Ascend account'
      : 'Reset your Ascend password';

    const heading = isEmailVerification
      ? 'Verify your Ascend account'
      : 'Reset your Ascend password';

    const message = isEmailVerification
      ? 'Your Ascend verification OTP is:'
      : 'Your Ascend password reset OTP is:';

    await emailTransporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject,
      text: `${message} ${otp}. This OTP expires in 5 minutes.`,
      html: `
        <h2>${heading}</h2>
        <p>${message}</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 5 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    });
  }
}
