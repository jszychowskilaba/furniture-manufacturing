import { Request, Response, NextFunction } from 'express';

interface ICRUDController {
  create(req: Request, res: Response, next: NextFunction): Promise<void>;
  getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
  getOne(req: Request, res: Response, next: NextFunction): Promise<void>;
  update(req: Request, res: Response, next: NextFunction): Promise<void>;
}

interface IService<T, CreatedT, PartialT> {
  create(data: T, username: string): Promise<CreatedT>;
  getAll(): Promise<CreatedT[]>;
  getAll(): Promise<CreatedT[]>;
  getOne(dataId: string): Promise<CreatedT>;
  update(materialId: string, materialChanges: PartialT): Promise<CreatedT>;
}

class CRUDController<T, PartialT, CreatedT> implements ICRUDController {
  private service: IService<T, CreatedT, PartialT>;
  constructor(service: IService<T, CreatedT, PartialT>) {
    this.service = service;
  }
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const createdMaterial = await this.service.create(
        req.body as T,
        req.headers.username as string
      );
      res.status(201).json(createdMaterial);
    } catch (error) {
      next(error);
    }
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const material = await this.service.getAll();
      res.status(200).json(material);
    } catch (error) {
      next(error);
    }
  };

  getOne = async (req: Request, res: Response, next: NextFunction) => {
    const materialId = req.params.id;
    try {
      const material = await this.service.getOne(materialId);
      res.status(200).json(material);
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
