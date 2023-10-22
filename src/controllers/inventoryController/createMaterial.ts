import { Request, Response, NextFunction } from 'express';
import * as inventoryServices from '../../services/inventoryServices';
import { Material } from '../../types/types';

export const createMaterial = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const username = req.headers.username as string;
    const postedMaterial = req.body as Material;
    const createdMaterial = inventoryServices.createMaterial(
      postedMaterial,
      username
    );
    res.status(201).json(createdMaterial);
  } catch (error) {
    next(error);
  }
};
