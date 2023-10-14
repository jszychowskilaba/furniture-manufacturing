import { Request, Response, NextFunction } from 'express';

export const updateLabor = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  res
    .status(200)
    .json(`I want to update a labor. The labor ID is: ${id}`);
};
