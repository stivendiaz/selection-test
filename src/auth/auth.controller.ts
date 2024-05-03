import { User } from '@prisma/client';
import * as express from 'express';
import { Body, Middlewares, Post, Request, Route, Security, Tags } from 'tsoa';
import { validate } from '../shared/infrastructure/middleware/validation.middleware';
import {
  IAuthPayload,
  IResetPasswordInput,
  ISignInInput,
  ISignUpInput,
  IVerifyPasswordResetToken,
} from './auth.interface';
import authService from './auth.service';
import { loginSchema, signupSchema } from './auth.validation';
import limiter from '../shared/infrastructure/middleware/rate-limit.middelware';

@Route('auth')
@Tags('Auth')
export class AuthController {
  /**
   * Login route
   * @param body
   * @param body.email Email of the user
   * @param body.password Password of the user
   *
   */
  @Post('/login')
  @Middlewares(validate(loginSchema), limiter)
  async login(@Body() body: ISignInInput): Promise<IAuthPayload> {
    return await authService.signin(body);
  }

  /**
   * Signup route
   * @param body
   * @param body.email Email of the user
   * @param body.password Password of the user
   * @param body.name Name of the user
   */
  @Post('/signup')
  @Middlewares(validate(signupSchema))
  async register(@Body() body: ISignUpInput): Promise<IAuthPayload> {
    return await authService.signup(body);
  }

  /**
   * Verify password reset token.
   * Confirm if the reset token is valid before changing the password.
   * @param body
   * @param body.token Token to verify
   * @param body.email Email of the user
   */
  @Post('/verify-reset-token')
  async verifyResetToken(
    @Body() body: IVerifyPasswordResetToken
  ): Promise<{ success: boolean }> {
    return await authService.verifyResetToken(body);
  }

  /**
   * Get the current user.
   */
  @Post('/me')
  @Security('jwt')
  me(
    @Request() req: express.Request & { user: User }
  ): Omit<User, 'passwordHash'> {
    return req.user;
  }
}
