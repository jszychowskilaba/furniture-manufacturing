import express, { Router } from 'express';
import orderController from '../../controllers/orderController';
import {
  validateBody,
  orderSchema,
  partialOrderSchema,
} from '../../middlewares/validateBody';
import { checkUserIs } from '../../middlewares/userRole/checkUserIs';
import { Role } from '../../middlewares/userRole/roles';

const router: Router = express.Router();

router.post(
  '/:id/manufactureOrder',
  checkUserIs(Role.PRODUCTION_MANAGER),
  orderController.manufactureOrder
);
router.get('/:id', orderController.getOneOrder);
router.get('/', orderController.getAllOrders);
router.post(
  '/',
  checkUserIs(Role.SALES),
  validateBody(orderSchema),
  orderController.createOrder
);

router.patch(
  '/:id',
  checkUserIs(Role.PRODUCTION_MANAGER),
  validateBody(partialOrderSchema),
  orderController.updateOrder
);

export default router;
