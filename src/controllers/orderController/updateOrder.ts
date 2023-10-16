import { Request, Response, NextFunction } from 'express';

export const updateOrder = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  res.status(200).json(`I want to update the order ID: ${id}`);
};
