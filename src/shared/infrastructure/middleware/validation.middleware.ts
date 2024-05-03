import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import HttpException from '../../applitacion/exception/http-exception';
import { HttpStatus } from '../../domain/interfaces/httpStatus';
import logger from '../utils/logger';

export const validate =
  (schema: AnyZodObject) => (req: Request, _: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.info(error.flatten());
        throw new HttpException(
          HttpStatus.UNPROCESSABLE_ENTITY,
          '',
          error.flatten()
        );
      }
      throw new HttpException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Internal Server Error'
      );
    }
  };
