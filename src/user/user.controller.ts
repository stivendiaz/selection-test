import { User } from '@prisma/client';
import * as express from 'express';
import {
  Body,
  Delete,
  Get,
  Middlewares,
  Path,
  Put,
  Request,
  Route,
  Security,
  Tags,
} from 'tsoa';
import { validate } from '../shared/infrastructure/middleware/validation.middleware';
import { IUpdateUserInput } from './user.interface';
import userService from './user.service';
import { userUpdateSchema } from './user.validation';
import { UserDomainModel } from './user.domain.model';

@Route('/users')
@Tags('User')
@Security('jwt')
export class UserController {
  /**
   * Get all users
   */
  @Get('/')
  async getAll(): Promise<UserDomainModel[]> {
    // protect this route with admin role
    return await userService.getAll();
  }

  /**
   * Retrieve a user by id. Only the user himself can retrieve his own information.
   * @param id  Id of the user
   */
  @Get('/:id')
  async getUserById(
    @Path() id: string,
    @Request() _: express.Request
  ): Promise<UserDomainModel | null> {
    const user = await userService.getById(id);

    if (user) {
      const { passwordHash, ...userWithNoPassword } = user;
      return userWithNoPassword;
    }
    return null;
  }

  /**
   * Update user's information. Only the user himself can update his own information.
   * @param id  Id of the user
   * @param body
   * @param body.name Name of the user
   * @param body.email Email of the user
   */
  @Put('/:id')
  @Middlewares(validate(userUpdateSchema))
  async updateUser(
    @Path() id: string,
    @Body() input: IUpdateUserInput,
    @Request() _: express.Request & { user: { id: string } }
  ): Promise<UserDomainModel> {
    const user = await userService.update(id, input);
    return user;
  }

  /**
   * Delete a user by id. Only the user himself can delete his own account.
   * @param id  Id of the user
   */
  @Delete('/:id')
  async deleteUser(
    @Path() id: string,
    @Request() _: express.Request & { user: { id: string } }
  ): Promise<UserDomainModel | null> {
    return await userService.delete(id);
  }
}

export default new UserController();
