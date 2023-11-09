import userServices, { UserServices } from '../services/userServices';
import { Request, Response, NextFunction } from 'express';

class UserController {
  private userServices: UserServices;

  constructor(userServices: UserServices) {
    this.userServices = userServices;
  }

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createdData = await this.userServices.create(
        req.body,
        req.headers.username as string
      );
      res.status(201).json(createdData);
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.userServices.getAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  getOneUser = async (req: Request, res: Response, next: NextFunction) => {
    const materialId = req.params.id;
    try {
      const data = await this.userServices.getOne(materialId);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id as string;
    const userChanges = req.body;
    try {
      const user = await this.userServices.update(userId, userChanges);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController(userServices);
