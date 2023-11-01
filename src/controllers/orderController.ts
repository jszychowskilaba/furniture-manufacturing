import orderServices from '../services/orderServices';
import { Request, Response, NextFunction } from 'express';
import { CreatedOrder } from '../types/Order';

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
  getAllOrders() {}

  updateOrder() {}
}

export default new OrderController();
