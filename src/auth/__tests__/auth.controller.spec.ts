import { AuthController } from '../auth.controller';
import authService from '../auth.service';
import {
  ISignInInput,
  ISignUpInput,
  IVerifyPasswordResetToken,
} from '../auth.interface';
import { loginSchema, signupSchema } from '../auth.validation';
import * as validate from '../../shared/infrastructure/middleware/validation.middleware';
import * as functionToMock from '../../shared/infrastructure/middleware/rate-limit.middelware';
import * as express from 'express';
import { User } from '@prisma/client';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(() => {
    authController = new AuthController();
  });

  describe('login', () => {
    it('should call authService.login and return the auth payload', async () => {
      // Arrange
      const signInInput: ISignInInput = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedAuthPayload = {
        accessToken: 'jwt_token',
        success: true,
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
      };

      jest.spyOn(authService, 'signin').mockResolvedValue(expectedAuthPayload);

      // Act
      const result = await authController.login(signInInput);

      // Assert
      expect(authService.signin).toHaveBeenCalledWith(signInInput);
      expect(result).toEqual(expectedAuthPayload);
    });
  });

  describe('register', () => {
    it('should call authService.register and return the auth payload', async () => {
      // Arrange
      const signUpInput: ISignUpInput = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const expectedAuthPayload = {
        accessToken: 'jwt_token',
        success: true,
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
      };

      jest.spyOn(authService, 'signup').mockResolvedValue(expectedAuthPayload);

      // Act
      const result = await authController.register(signUpInput);

      // Assert
      expect(authService.signup).toHaveBeenCalledWith(signUpInput);
      expect(result).toEqual(expectedAuthPayload);
    });
  });

  describe('verifyResetToken', () => {
    it('should call authService.verifyResetToken and return the success status', async () => {
      // Arrange
      const verifyTokenInput: IVerifyPasswordResetToken = {
        token: 'reset_token',
        email: 'test@example.com',
      };

      const expectedResponse = {
        success: true,
      };

      jest
        .spyOn(authService, 'verifyResetToken')
        .mockResolvedValue(expectedResponse);

      // Act
      const result = await authController.verifyResetToken(verifyTokenInput);

      // Assert
      expect(authService.verifyResetToken).toHaveBeenCalledWith(
        verifyTokenInput
      );
      expect(result).toEqual(expectedResponse);
    });
  });
});
