import { Request, Response, NextFunction } from 'express';

export const getOneMaterial = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json('I want to get one material');
};
