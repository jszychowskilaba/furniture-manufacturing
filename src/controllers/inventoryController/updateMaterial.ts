import { Request, Response, NextFunction } from 'express';

export const updateMaterial = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(204);
};
