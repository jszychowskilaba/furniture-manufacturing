import inventoryServices from '../services/inventoryServices';
import { ICRUDController } from '../types/ICRUDController';
import { Request, Response, NextFunction } from 'express';
import { CRUDController } from './helpers/CRUDController';

class InventoryController {
  private CRUDController: ICRUDController;
  constructor() {
    this.CRUDController = new CRUDController(inventoryServices);
  }
  createMaterial = async (req: Request, res: Response, next: NextFunction) => {
    await this.CRUDController.create(req, res, next);
  };

  getAllMaterials = async (req: Request, res: Response, next: NextFunction) => {
    await this.CRUDController.getAll(req, res, next);
  };

  getOneMaterial = async (req: Request, res: Response, next: NextFunction) => {
    await this.CRUDController.getOne(req, res, next);
  };

  updateMaterial = async (req: Request, res: Response, next: NextFunction) => {
    await this.CRUDController.update(req, res, next);
  };
}

export default new InventoryController();
