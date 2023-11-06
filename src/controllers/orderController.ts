import { Request, Response, NextFunction } from 'express';
import orderServices from '../services/orderServices';
import { CustomError } from '../helpers/CustomError';
import { CreatedOrder } from '../dto/Order';

class OrderController {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const createdOrder: CreatedOrder = await orderServices.createOrder(
        req.body,
        req.headers.username as string
      );

      res.status(201).json(createdOrder);
    } catch (error) {
      next(error);
    }
  }

  async getOneOrder(req: Request, res: Response, next: NextFunction) {
    const orderId = req.params.id;
    try {
      const createdOrder: CreatedOrder = await orderServices.getOneOrder(
        orderId
      );
      res.status(200).json(createdOrder);
    } catch (error) {
      next(error);
    }
  }

  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const createdOrders: CreatedOrder[] = await orderServices.getAllOrders();
      res.status(200).json(createdOrders);
    } catch (error) {
      next(error);
    }
  }

  async manufactureOrder(req: Request, res: Response, next: NextFunction) {
    const orderId = req.params.id;

    try {
      const quantity = Number(req.body.quantity);

      if (isNaN(quantity) || quantity <= 0)
        throw new CustomError('Quantity must be > 0', 400);

      await orderServices.manufactureOrder(quantity, orderId);
      res.status(200).json(`Manufactured ${quantity} of order ${orderId}`);
    } catch (error) {
      next(error);
    }
  }

  async updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const createdOrder = await orderServices.updateOrder(
        req.body,
        req.params.id
      );
      res.status(200).json(createdOrder);
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();
