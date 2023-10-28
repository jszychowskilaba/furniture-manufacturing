import inventoryServices from '../../services/inventoryServices';
import { Request, Response, NextFunction } from 'express';
import { Material } from '../../types/Material';

class InventoryController {
  async createMaterial(req: Request, res: Response, next: NextFunction) {
    try {
      const createdMaterial = await inventoryServices.createMaterial(
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
      const material = await inventoryServices.getAllMaterials();
      res.status(200).json(material);
    } catch (error) {
      next(error);
    }
  };

  getOneMaterial = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    res
      .status(200)
      .json(`I want to get one material. The material ID is: ${id}`);
  };

  updateMaterial = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    res
      .status(200)
      .json(`I want to update a material. The material ID is: ${id}`);
  };
}

export default new InventoryController();
