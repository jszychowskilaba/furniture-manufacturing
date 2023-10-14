import { Request, Response, NextFunction } from 'express';

export const updateMaterial = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  res
    .status(200)
    .json(`I want to update a material. The material ID is: ${id}`);
};
