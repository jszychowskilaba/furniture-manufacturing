import { PartialLaborDto } from '../dtos/labor/PartialLaborDto';
import { CreatedLaborDto } from '../dtos/labor/CreatedLaborDto';
import { LaborDto } from '../dtos/labor/LaborDto';
import laborServices, { LaborServices } from '../services/laborServices';
import { Request, Response, NextFunction } from 'express';

class LaborController {
  private laborServices: LaborServices;

  constructor(laborServices: LaborServices) {
    this.laborServices = laborServices;
  }

  createLabor = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createdData: CreatedLaborDto = await this.laborServices.create(
        new LaborDto(req.body),
        req.headers.username as string
      );
      res.status(201).json(createdData);
    } catch (error) {
      next(error);
    }
  };

  getAllLabors = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: CreatedLaborDto[] = await this.laborServices.getAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  getOneLabor = async (req: Request, res: Response, next: NextFunction) => {
    const laborId = req.params.id;
    try {
      const data: CreatedLaborDto = await this.laborServices.getOne(laborId);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  updateLabor = async (req: Request, res: Response, next: NextFunction) => {
    const laborId = req.params.id as string;
    const laborChanges = new PartialLaborDto(req.body);
    try {
      const labor: CreatedLaborDto = await this.laborServices.update(
        laborId,
        laborChanges
      );
      res.status(200).json(labor);
    } catch (error) {
      next(error);
    }
  };
}

export default new LaborController(laborServices);
