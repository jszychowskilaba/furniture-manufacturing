import { Request, Response, NextFunction } from 'express';

export const getOneLabor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  res.status(200).json(`I want to get one labor. The labor ID is: ${id}`);
};
