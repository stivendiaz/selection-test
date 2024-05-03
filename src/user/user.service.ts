import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import HttpException from '../shared/applitacion/exception/http-exception';
import { HttpStatus } from '../shared/domain/interfaces/httpStatus';
import prisma from '../shared/infrastructure/lib/prisma';
import logger from '../shared/infrastructure/utils/logger';
import { ICreateUserInput, IUpdateUserInput } from './user.interface';

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
}

export default new userService();
