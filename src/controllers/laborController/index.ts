import inventoryServices from '../../services/laborServices';
import { Request, Response, NextFunction } from 'express';
import { Labor, PartialLabor } from '../../types/Labor';

class InventoryController {
  async createLabor(req: Request, res: Response, next: NextFunction) {
    try {
      const createdLabor = await inventoryServices.createLabor(
        req.body as Labor,
        req.headers.username as string
      );
      res.status(201).json(createdLabor);
    } catch (error) {
      next(error);
    }
  }

  getAllLabors = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const labors = await inventoryServices.getAllLabors();
      res.status(200).json(labors);
    } catch (error) {
      next(error);
    }
  };

  getOneLabor = async (req: Request, res: Response, next: NextFunction) => {
    const laborId = req.params.id;
    try {
      const labor = await inventoryServices.getOneLabor(laborId);
      res.status(200).json(labor);
    } catch (error) {
      next(error);
    }
  };

  updateLabor = async (req: Request, res: Response, next: NextFunction) => {
    const laborId = req.params.id as string;
    const laborChanges = req.body as PartialLabor;
    try {
      const labor = await inventoryServices.updateLabor(
        laborId,
        laborChanges
      );
      res.status(200).json(labor);
    } catch (error) {
      next(error);
    }
  };
}

export default new InventoryController();
