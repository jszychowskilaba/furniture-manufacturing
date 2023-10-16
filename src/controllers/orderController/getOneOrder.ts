import { Request, Response, NextFunction } from 'express';

export const getOneOrder = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  res.status(200).json(`I want to get the order ID: ${id}`);
};
