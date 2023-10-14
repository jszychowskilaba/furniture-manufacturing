import { Request, Response, NextFunction } from 'express';

export const createMaterial = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(204);
};
