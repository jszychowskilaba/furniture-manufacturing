import orderServices from '../services/orderServices';
import { Request, Response, NextFunction } from 'express';
import { CreatedOrder } from '../types/Order';

class OrderController {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const createdOrder: CreatedOrder = await orderServices.create(
        req.body,
        req.headers.username as string
      );
      res.status(201).json(createdOrder);
    } catch (error) {
      next(error);
    }
  }

  getAllOrders() {}
  getOneOrder() {}
  updateOrder() {}
}

export default new OrderController();
