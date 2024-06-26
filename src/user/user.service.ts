import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import HttpException from '../shared/applitacion/exception/http-exception';
import { HttpStatus } from '../shared/domain/interfaces/httpStatus';
import prisma from '../shared/infrastructure/lib/prisma';
import logger from '../shared/infrastructure/utils/logger';
import { ICreateUserInput, IUpdateUserInput } from './user.interface';
import { UserDomainModel } from './user.domain.model';

class userService {
  /**
   * create
   */
  public async create(input: ICreateUserInput): Promise<User> {
    const user = await this.getByEmail(input.email);

    if (user) {
      throw new HttpException(HttpStatus.BAD_REQUEST, 'User already exists');
    }

    const passwordHash = await argon2.hash(input.password);

    return await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
      },
    });
  }

  /**
   * getAll
   */
  public async getAll(): Promise<UserDomainModel[]> {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: false,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * getById
   */
  public async getById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  }

  /**
   * getByEmail
   */
  public async getByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    return user;
  }

  /**
   * delete
   */
  public async delete(id: string): Promise<User | null> {
    const user = await this.getById(id);

    if (!user) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'User not found');
    }

    return await prisma.user.delete({
      where: { id },
    });
  }

  public async update(id: string, data: IUpdateUserInput): Promise<User> {
    const user = await this.getById(id);

    if (!user) {
      throw new HttpException(HttpStatus.NOT_FOUND, 'User not found');
    }

    const emailChanged =
      data.email?.trim() &&
      data.email.trim().toLowerCase() !== user.email.toLowerCase();

    if (emailChanged && (await this.getByEmail(data.email))) {
      throw new HttpException(400, 'Email already exists');
    }

    try {
      const updatedUser = await prisma.user.update({
        where: {
          id,
        },
        data: {
          email: data.email.trim() || user.email,
          name: data.name || user.name,
        },
      });

      return updatedUser;
    } catch (error) {
      logger.error(error);
      throw new HttpException(404, 'Could not update user');
    }
  }
}

export default new userService();
