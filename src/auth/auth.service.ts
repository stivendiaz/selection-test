import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { addHours } from 'date-fns';
import HttpException from '../shared/applitacion/exception/http-exception';
import { DataStoredInToken } from '../shared/domain/interfaces/dataStoredInToken';
import prisma from '../shared/infrastructure/lib/prisma';
import userService from '../user/user.service';
import logger from '../shared/infrastructure/utils/logger';
import { config } from '../shared/config';
import {
  IAuthPayload,
  ISignInInput,
  ISignUpInput,
  IVerifyPasswordResetToken,
} from './auth.interface';

class AuthService {
  signup = async (input: ISignUpInput): Promise<IAuthPayload> => {
    const { email } = input;

    const emailTaken = await userService.getByEmail(email);

    if (emailTaken) throw new HttpException(400, 'Email already exists');

    const user = await userService.create(input);

    const dataStoredInToken: DataStoredInToken = {
      id: user.id,
    };

    const token = jwt.sign(
      dataStoredInToken,
      config.accessTokenSecret as string,
      { expiresIn: config.accessTokenLifetime as string }
    );

    await prisma.resetTokens.create({
      data: {
        token,
        email,
        expiresAt: addHours(new Date(), 2),
      },
    });

    return { success: true, accessToken: token, user };
  };

  signin = async (input: ISignInInput): Promise<IAuthPayload> => {
    const { email, password } = input;

    if (!email || !password)
      throw new HttpException(400, 'Invalid credentials');

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw new HttpException(400, 'User not found');

    const { passwordHash, ...userData } = user;

    if (await argon2.verify(passwordHash, password)) {
      const dataStoredInToken: DataStoredInToken = {
        id: userData.id,
      };
      const accessToken = jwt.sign(
        dataStoredInToken,
        config.accessTokenSecret as string,
        { expiresIn: config.accessTokenLifetime as string }
      );

      await prisma.resetTokens.create({
        data: {
          token: accessToken,
          email,
          expiresAt: addHours(new Date(), 2),
        },
      });

      return { success: true, accessToken, user: userData };
    } else throw new HttpException(400, 'Invalid Password');
  };

  verifyResetToken = async (body: IVerifyPasswordResetToken) => {
    const { token, email } = body;
    await prisma.resetTokens.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    const record = await prisma.resetTokens.findFirst({
      where: {
        email,
        token,
        used: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    logger.info(record);

    if (!record) throw new HttpException(400, 'Token is invalid or expired');

    return { success: true };
  };

  logout = async (body: IVerifyPasswordResetToken) => {
    const { token, email } = body;

    const record = await prisma.resetTokens.findFirst({
      where: {
        email,
        token,
      },
    });

    logger.info(record);

    if (!record) throw new HttpException(400, 'Token is invalid or expired');

    await prisma.resetTokens.deleteMany({
      where: {
        email,
        token,
      },
    });

    return { success: true };
  };
}

export default new AuthService();
