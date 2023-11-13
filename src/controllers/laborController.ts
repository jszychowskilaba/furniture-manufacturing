import laborServices, { LaborServices } from '../services/laborServices';
import { Request, Response, NextFunction } from 'express';

class LaborController {
  private laborServices: LaborServices;

  constructor(laborServices: LaborServices) {
    this.laborServices = laborServices;
  }

  createLabor = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createdData = await this.laborServices.create(
        req.body,
        req.headers.username as string
      );
      res.status(201).json(createdData);
    } catch (error) {
      next(error);
    }
  };

  getAllLabors = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let data;

      if (Object.getOwnPropertyNames(req.query).length) {
        data = await this.laborServices.getByQuery(req.query);
      } else {
        data = await this.laborServices.getAll();
      }

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  getOneLabor = async (req: Request, res: Response, next: NextFunction) => {
    const laborId = req.params.id;
    try {
      const data = await this.laborServices.getOne(laborId);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  updateLabor = async (req: Request, res: Response, next: NextFunction) => {
    const laborId = req.params.id as string;
    const laborChanges = req.body;
    try {
      const labor = await this.laborServices.update(laborId, laborChanges);
      res.status(200).json(labor);
    } catch (error) {
      next(error);
    }
  };
}

export default new LaborController(laborServices);
