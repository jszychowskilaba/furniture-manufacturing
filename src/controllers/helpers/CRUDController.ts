import { Request, Response, NextFunction } from 'express';
import { IService } from '../../types/IService';
import { ICRUDController } from '../../types/ICRUDController';


class CRUDController<T, PartialT, CreatedT> implements ICRUDController {
  private service: IService<T, CreatedT, PartialT>;
  constructor(service: IService<T, CreatedT, PartialT>) {
    this.service = service;
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const createdData = await this.service.create(
        req.body as T,
        req.headers.username as string
      );
      res.status(201).json(createdData);
    } catch (error) {
      next(error);
    }
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    const dataId = req.params.id;
    try {
      const data = await this.service.getOne(dataId);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    const materialId = req.params.id as string;
    const materialChanges = req.body as PartialT;
    try {
      const material = await this.service.update(materialId, materialChanges);
      res.status(200).json(material);
    } catch (error) {
      next(error);
    }
  };
}

export { CRUDController };
