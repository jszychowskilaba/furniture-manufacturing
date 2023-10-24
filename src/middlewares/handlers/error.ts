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
  const productionMessage = {
    error: {
      status: error.status,
      message: error.message,
    },
  };

  const developmentMessage = {
    error: {
      status: error.status,
      message: error.message,
      stack: error.stack,
      body: req.body,
      headers: req.headers,
    },
  };

  const message =
    process.env.NODE_ENV == 'production'
      ? productionMessage
      : developmentMessage;
      
  res.status(error.status).json(message);
};

export default errorHandler;
