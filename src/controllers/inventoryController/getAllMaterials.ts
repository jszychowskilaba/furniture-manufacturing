import { Request, Response, NextFunction } from 'express';

export const getAllMaterials = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(204);
};
