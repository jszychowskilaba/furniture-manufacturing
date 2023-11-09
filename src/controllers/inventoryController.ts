import { InventoryServices } from '../services/inventoryServices';
import inventoryServices from '../services/inventoryServices';
import { Request, Response, NextFunction } from 'express';

class InventoryController {
  private inventoryServices: InventoryServices;

  constructor(inventoryServices: InventoryServices) {
    this.inventoryServices = inventoryServices;
  }

  createMaterial = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createdData = await this.inventoryServices.create(
        req.body,
        req.headers.username as string
      );
      res.status(201).json(createdData);
    } catch (error) {
      next(error);
    }
  };

  getAllMaterials = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.inventoryServices.getAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  getOneMaterial = async (req: Request, res: Response, next: NextFunction) => {
    const materialId = req.params.id;
    try {
      const data = await this.inventoryServices.getOne(materialId);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  updateMaterial = async (req: Request, res: Response, next: NextFunction) => {
    const materialId = req.params.id as string;
    const materialChanges = req.body;
    try {
      const material = await this.inventoryServices.update(
        materialId,
        materialChanges
      );
      res.status(200).json(material);
    } catch (error) {
      next(error);
    }
  };
}

export default new InventoryController(inventoryServices);
