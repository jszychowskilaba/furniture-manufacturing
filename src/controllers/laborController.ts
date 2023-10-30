import laborServices from '../services/laborServices';
import { Request, Response, NextFunction } from 'express';
import { ICRUDController } from '../types/ICRUDController';
import { CRUDController } from './helpers/CRUDController';

class LaborController {
  private CRUDController: ICRUDController;
  constructor() {
    this.CRUDController = new CRUDController(laborServices);
  }
  createLabor = async (req: Request, res: Response, next: NextFunction) => {
    await this.CRUDController.create(req, res, next);
  };

  getAllLabors = async (req: Request, res: Response, next: NextFunction) => {
    await this.CRUDController.getAll(req, res, next);
  };

  getOneLabor = async (req: Request, res: Response, next: NextFunction) => {
    await this.CRUDController.getOne(req, res, next);
  };

  updateLabor = async (req: Request, res: Response, next: NextFunction) => {
    await this.CRUDController.update(req, res, next);
  };
}

export default new LaborController();
