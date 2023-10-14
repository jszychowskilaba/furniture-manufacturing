import { Request, Response, NextFunction } from 'express';

export const updateMaterial = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(200).json('I want to update a material');
};
