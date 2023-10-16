import { Request, Response, NextFunction } from 'express';

export const createOrder = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json('I want to create a order');
};
