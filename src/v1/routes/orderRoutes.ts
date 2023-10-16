import express, { Router } from 'express';
import * as orderController from '../../controllers/orderController';
import { validateBody, orderSchema, partialOrderSchema } from '../../middlewares/validateBody';

const router: Router = express.Router();

router.get('/', orderController.getAllOrders);
router.post('/', validateBody(orderSchema), orderController.createOrder);
router.get('/:id', orderController.getOneOrder);
router.patch('/:id', validateBody(partialOrderSchema), orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

export default router;
