import { NextFunction, Request, Response } from 'express';

import { ForbiddenError } from '../errors/forbidden.error';
import { UserRole } from '../types/auth.types';

export class AuthorizationMiddleware {
  execute(requiredRole: UserRole) {
    return (
      req: Request,
      _res: Response,
      next: NextFunction,
    ): void => {
      if (req.user?.role !== requiredRole) {
        throw new ForbiddenError('Insufficient permissions');
      }
      next();
    };
  }
}