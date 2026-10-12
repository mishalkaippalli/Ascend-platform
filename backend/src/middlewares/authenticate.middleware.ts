import { Request, Response, NextFunction } from 'express';

import { UnauthorizedError } from '../errors/unauthorized.error';
import { ITokenService } from '../interfaces/service/auth/ITokenService';

export class AuthenticateMiddleware {
  constructor(private readonly _tokenService: ITokenService) {}

  execute(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedError('Authentication required');
    }

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedError('Invalid authorization header');
    }

    let payload;

    try {
      // Convert token verification failures into a 401 error.
      payload = this._tokenService.verifyAccessToken(token);
    } catch {
      throw new UnauthorizedError(
        'Invalid or expired access token',
      );
    }

    // Store the authenticated user's identity for later middleware.
    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();
  }
}