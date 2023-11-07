import { PartialLaborDto } from '../dtos/labor/PartialLaborDto';
import { CreatedLaborDto } from '../dtos/labor/CreatedLaborDto';
import { Request, Response, NextFunction } from 'express';
import laborServices from '../services/laborServices';
import { LaborDto } from '../dtos/labor/LaborDto';

class LaborController {
  createLabor = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createdData: CreatedLaborDto = await laborServices.create(
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
      const data: CreatedLaborDto[] = await laborServices.getAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  getOneLabor = async (req: Request, res: Response, next: NextFunction) => {
    const laborId = req.params.id;
    try {
      const data: CreatedLaborDto = await laborServices.getOne(laborId);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  updateLabor = async (req: Request, res: Response, next: NextFunction) => {
    const laborId = req.params.id as string;
    const laborChanges = new PartialLaborDto(req.body);
    try {
      const labor: CreatedLaborDto = await laborServices.update(
        laborId,
        laborChanges
      );
      res.status(200).json(labor);
    } catch (error) {
      next(error);
    }
  };
}

export default new LaborController();
