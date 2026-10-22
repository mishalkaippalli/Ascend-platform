import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

import { BadRequestError } from '../errors/bad-request.error.js';

export const validate = (schema: ZodType) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      // console.error('Validation errors:', result.error.issues);
      throw new BadRequestError('Invalid request data');
    }

    req.body = result.data;

    next();
  };
};
