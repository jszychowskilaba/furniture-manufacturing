/* eslint-disable @typescript-eslint/no-unused-vars */
import { ICustomError } from '../../types/types';
import { Request, Response, NextFunction } from 'express';

/**
 * Handle error thrown by other middleware. It responses with the error status
 * and the error message
 * @param error The error object
 * @param req The request
 * @param res The response
 * @param next The next function
 */
const errorHandler = (
  error: ICustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error.status).json(error.message);
};

export default errorHandler;
