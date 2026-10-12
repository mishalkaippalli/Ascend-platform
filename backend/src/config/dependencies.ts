import { AuthController } from '../controllers/auth.controller';
import { UserController } from '../controllers/user.controller';
import { PublisherController } from '../controllers/publisher.controller';

import { IUserRepository } from '../interfaces/repository/IUserRepository';
import { IPublisherRepository } from '../interfaces/repository/IPublisherRepository';

import { UserRepository } from '../repositories/user.repository';
import { PublisherRepository } from '../repositories/publisher.repository';
import { RefreshSessionRepository } from '../repositories/refresh-session.repository';

import { IPublisherService } from '../interfaces/service/publisher/IPublisherService';

import { UserService } from '../services/user/user.service';
import { PublisherService } from '../services/publisher/publisher.service';

import { AuthService } from '../services/auth/auth.service';
import { Argon2PasswordHasher } from '../services/auth/argon2-password-hasher';
import { RedisOtpService } from '../services/auth/redis-otp.service';
import { NodemailerEmailService } from '../services/auth/nodemailer-email.service';
import { JwtTokenService } from '../services/auth/jwt-token.service';
import { Sha256RefreshTokenHasher } from '../services/auth/sha256-refresh-token-hasher';
import { RedisPasswordResetTokenService } from '../services/auth/redis-password-reset-token.service';

import { AuthenticateMiddleware } from '../middlewares/authenticate.middleware';
import { AuthorizationMiddleware } from '../middlewares/authorization.middleware';


// --------------------------------------------------
// Repositories
// --------------------------------------------------

const userRepository: IUserRepository =
  new UserRepository();

const publisherRepository: IPublisherRepository =
  new PublisherRepository();

const refreshSessionRepository =
  new RefreshSessionRepository();


// --------------------------------------------------
// Shared services / infrastructure
// --------------------------------------------------

const passwordHasher =
  new Argon2PasswordHasher();

const otpService =
  new RedisOtpService();

const emailService =
  new NodemailerEmailService();

const tokenService =
  new JwtTokenService();

const refreshTokenHasher =
  new Sha256RefreshTokenHasher();

const passwordResetTokenService =
  new RedisPasswordResetTokenService();


// --------------------------------------------------
// Application services
// --------------------------------------------------

const userService =
  new UserService(userRepository);

const authService =
  new AuthService(
    userRepository,
    passwordHasher,
    otpService,
    emailService,
    tokenService,
    refreshSessionRepository,
    refreshTokenHasher,
    passwordResetTokenService,
  );

const publisherService: IPublisherService =
  new PublisherService(
    userRepository,
    publisherRepository,
    passwordHasher,
    otpService,
    emailService,
  );


// --------------------------------------------------
// Controllers
// --------------------------------------------------

export const authController =
  new AuthController(authService);

export const userController =
  new UserController(userService);

  export const publisherController =
  new PublisherController(publisherService);

// --------------------------------------------------
// Middleware
// --------------------------------------------------

const authenticateMiddleware =
  new AuthenticateMiddleware(tokenService);

const authorizationMiddleware =
  new AuthorizationMiddleware();

export {
  authenticateMiddleware,
  authorizationMiddleware,
};