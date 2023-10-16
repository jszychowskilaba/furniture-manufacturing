import { Request, Response, NextFunction } from 'express';

export const deleteOrder = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  res.status(200).json(`I want to delete the order ID: ${id}`);
};
