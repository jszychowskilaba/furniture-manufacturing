import { PartialUserDto } from '../dtos/user/PartialUserDto';
import { CreatedUserDto } from '../dtos/user/CreatedUserDto';
import { UserDto } from '../dtos/user/UserDto';
import { Request, Response, NextFunction } from 'express';
import userServices from '../services/userServices';

class UserController {
  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createdData: CreatedUserDto = await userServices.create(
        new UserDto(req.body),
        req.headers.username as string
      );
      res.status(201).json(createdData);
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: CreatedUserDto[] = await userServices.getAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  getOneUser = async (req: Request, res: Response, next: NextFunction) => {
    const materialId = req.params.id;
    try {
      const data: CreatedUserDto = await userServices.getOne(materialId);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id as string;
    const userChanges = new PartialUserDto(req.body);
    try {
      const user: CreatedUserDto = await userServices.update(
        userId,
        userChanges
      );
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController();
