import inventoryServices from '../../services/inventoryServices';
import { Request, Response, NextFunction } from 'express';
import { Material, PartialMaterial } from '../../types/Material';

class InventoryController {
  async createMaterial(req: Request, res: Response, next: NextFunction) {
    try {
      const createdMaterial = await inventoryServices.create(
        req.body as Material,
        req.headers.username as string
      );
      res.status(201).json(createdMaterial);
    } catch (error) {
      next(error);
    }
  }

  getAllMaterials = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const material = await inventoryServices.getAll();
      res.status(200).json(material);
    } catch (error) {
      next(error);
    }
  };

  getOneMaterial = async (req: Request, res: Response, next: NextFunction) => {
    const materialId = req.params.id;
    try {
      const material = await inventoryServices.getOne(materialId);
      res.status(200).json(material);
    } catch (error) {
      next(error);
    }
  };

  updateMaterial = async (req: Request, res: Response, next: NextFunction) => {
    const materialId = req.params.id as string;
    const materialChanges = req.body as PartialMaterial;
    try {
      const material = await inventoryServices.update(
        materialId,
        materialChanges
      );
      res.status(200).json(material);
    } catch (error) {
      next(error);
    }
  };
}

export default new InventoryController();
