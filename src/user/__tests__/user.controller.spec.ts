import * as express from 'express';
import userController, { UserController } from '../user.controller';
import { UserDomainModel } from '../user.domain.model';

describe('getAll', () => {
  it('should return all users', async () => {
    // Mock the request object
    const request = {} as express.Request;

    // Call the getAll method
    const result = await userController.getAll();

    // Assert the result
    expect(result).toEqual(expect.arrayContaining<UserDomainModel>([]));
  });
});

it('should return null if user is not found', async () => {
  // Mock the request object
  const request = {
    user: { id: 'user-id' },
  } as express.Request & { user: { id: string } };

  // Call the getUserById method with an invalid id
  const result = await userController.getUserById('invalid-id', request);

  // Assert the result
  expect(result).toBeNull();
});
