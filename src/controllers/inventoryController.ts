import { CreatedMaterialDto } from '../dtos/inventory/CreatedMaterialDto';
import { PartialMaterialDto } from '../dtos/inventory/PartialMaterialDto';
import { MaterialDto } from '../dtos/inventory/PartialCreatedMaterial';
import inventoryServices from '../services/inventoryServices';
import { Request, Response, NextFunction } from 'express';

class InventoryController {
  constructor() {}
  createMaterial = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createdData: CreatedMaterialDto = await inventoryServices.create(
        new MaterialDto(req.body),
        req.headers.username as string
      );
      res.status(201).json(createdData);
    } catch (error) {
      next(error);
    }
  };

  getAllMaterials = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: CreatedMaterialDto[] = await inventoryServices.getAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  getOneMaterial = async (req: Request, res: Response, next: NextFunction) => {
    const materialId = req.params.id;
    try {
      const data: CreatedMaterialDto = await inventoryServices.getOne(
        materialId
      );
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  updateMaterial = async (req: Request, res: Response, next: NextFunction) => {
    const materialId = req.params.id as string;
    const materialChanges = new PartialMaterialDto(req.body);
    try {
      const material: CreatedMaterialDto = await inventoryServices.update(
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
