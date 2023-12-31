import { Request, Response, NextFunction } from 'express';
import orderServices, { OrderServices } from '../services/orderServices';
import { CustomError } from '../helpers/CustomError';

class OrderController {
  private orderServices: OrderServices;

  constructor(orderServices: OrderServices) {
    this.orderServices = orderServices;
  }

  createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createdOrder = await this.orderServices.createOrder(
        req.body,
        req.headers.username as string
      );

      res.status(201).json(createdOrder);
    } catch (error) {
      next(error);
    }
  };

  getOneOrder = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;
    try {
      const createdOrder = await this.orderServices.getOneOrder(orderId);
      res.status(200).json(createdOrder);
    } catch (error) {
      next(error);
    }
  };

  getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let createdOrders;

      if (Object.getOwnPropertyNames(req.query).length) {
        createdOrders = await this.orderServices.getAllOrdersByQuery(req.query);
      } else {
        createdOrders = await this.orderServices.getAllOrders();
      }

      res.status(200).json(createdOrders);
    } catch (error) {
      next(error);
    }
  };

  manufactureOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const orderId = req.params.id;

    try {
      const quantity = Number(req.body.quantity);

      if (isNaN(quantity) || quantity <= 0)
        throw new CustomError('Quantity must be > 0', 400);

      await this.orderServices.manufactureOrder(quantity, orderId);
      res.status(200).json(`Manufactured ${quantity} of order ${orderId}`);
    } catch (error) {
      next(error);
    }
  };

  updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createdOrder = await this.orderServices.updateOrder(
        req.body,
        req.params.id
      );
      res.status(200).json(createdOrder);
    } catch (error) {
      next(error);
    }
  };
}

export default new OrderController(orderServices);
