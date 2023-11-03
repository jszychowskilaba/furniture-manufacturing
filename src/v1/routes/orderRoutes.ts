import express, { Router } from 'express';
import orderController from '../../controllers/orderController';
import {
  validateBody,
  orderSchema,
  partialOrderSchema,
} from '../../middlewares/validateBody';

const router: Router = express.Router();

router.post('/:id/manufactureOrder', orderController.manufactureOrder);
router.get('/:id', orderController.getOneOrder);
router.get('/', orderController.getAllOrders);
router.post('/', validateBody(orderSchema), orderController.createOrder);

router.patch(
  '/:id',
  validateBody(partialOrderSchema),
  orderController.updateOrder
);

export default router;
