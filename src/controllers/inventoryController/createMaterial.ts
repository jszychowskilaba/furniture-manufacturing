import { Request, Response, NextFunction } from 'express';

export const createMaterial = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json('I want to create a material');
};
