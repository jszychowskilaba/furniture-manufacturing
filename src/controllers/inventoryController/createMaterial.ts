import { Request, Response, NextFunction } from 'express';
import * as inventoryServices from '../../services/inventoryServices';
import { Material } from '../../types/types';

export const createMaterial = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postedMaterial: Material = req.body;
    const createdMaterial = inventoryServices.createMaterial(postedMaterial);
    res.status(201).json(createdMaterial);
  } catch (error) {
    next(error);
  }
};
