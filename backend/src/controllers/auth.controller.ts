import { NextFunction, Request, Response } from 'express';

import {
  ISignupDTO,
  ILoginResponseDTO,
  IVerifyOtpDTO,
  IResendOtpDTO,
  ILoginDTO,
  IForgotPasswordDTO,
  IVerifyResetOtpDTO,
  IResetPasswordDTO,
  IVerifyResetOtpResponseDTO,
  IRefreshResponseDTO,
} from '../dtos/auth.dto';
import { HttpStatusCode } from '../constants/http-status-code';
import { IAuthService } from '../interfaces/service/auth/IAuthService';
import { authConfig } from '../config/auth.config';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { sendSuccessResponse } from '../utils/api-response.util';

export class AuthController {
  constructor(private readonly _authService: IAuthService) {}

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input: ISignupDTO = req.body;

      const user = await this._authService.signup(input);

      sendSuccessResponse(
        res,
        HttpStatusCode.CREATED,
        'Signup successful',
        user,                
      );
    } catch (error) {
      next(error);
    }
  }

  async verifyEmailOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const otpData: IVerifyOtpDTO = req.body;

      await this._authService.verifyEmailOtp(otpData);

      sendSuccessResponse(
        res,
        HttpStatusCode.OK,
        'Email verified successfully',
      );
    } catch (error) {
      next(error);
    }
  }

  async resendOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const otpData: IResendOtpDTO = req.body;

      await this._authService.resendOtp(otpData);

      sendSuccessResponse(res, HttpStatusCode.OK, 'OTP sent successfully');
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input: ILoginDTO = req.body;

      const result = await this._authService.login(input);

      res.cookie(
        'refreshToken',
        result.refreshToken,
        authConfig.refreshTokenCookie,
      );

      sendSuccessResponse<ILoginResponseDTO>(
        res,
        HttpStatusCode.OK,
        'Login successful',
        {
          user: result.user,
          accessToken: result.accessToken,
        },
      );
    } catch (error) {
      next(error);
    }
  }

  async refresh(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        throw new UnauthorizedError('Refresh token is required');
      }

      const result = await this._authService.refresh(refreshToken);

      res.cookie(
        'refreshToken',
        result.refreshToken,
        authConfig.refreshTokenCookie,
      );

      sendSuccessResponse<IRefreshResponseDTO>(
        res,
        HttpStatusCode.OK,
        'Token refreshed successfully',
        {
          accessToken: result.accessToken,
        },
      );
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (refreshToken) {
        await this._authService.logout(refreshToken);
      }

      // Use the same cookie options so the browser can remove the cookie.
      res.clearCookie('refreshToken', authConfig.refreshTokenCookie);

      sendSuccessResponse(res, HttpStatusCode.OK, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const input: IForgotPasswordDTO = req.body;

      await this._authService.forgotPassword(input);

      sendSuccessResponse(
        res,
        HttpStatusCode.OK,
        'If an account exists with this email, a password reset OTP has been sent.',
      );
    } catch (error) {
      next(error);
    }
  }

  async verifyResetOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const input: IVerifyResetOtpDTO = req.body;

      const resetToken = await this._authService.verifyResetOtp(input);

      sendSuccessResponse<IVerifyResetOtpResponseDTO>(
        res,
        HttpStatusCode.OK,
        'OTP verified successfully',
        {
          resetToken,
        },
      );
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const input: IResetPasswordDTO = req.body;

      await this._authService.resetPassword(input);

      sendSuccessResponse(
        res,
        HttpStatusCode.OK,
        'Password reset successfully',
      );
    } catch (error) {
      next(error);
    }
  }
}