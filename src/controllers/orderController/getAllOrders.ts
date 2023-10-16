import { Request, Response, NextFunction } from 'express';

export const getAllOrders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json('I want to get all orders');
};
