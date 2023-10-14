import { Error } from '../../types/types';
import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error.status).json(error.message);
};

export default errorHandler;
