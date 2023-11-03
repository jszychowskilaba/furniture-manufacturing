import express, { Router } from 'express';
import laborController from '../../controllers/laborController';
import {
  validateBody,
  laborSchema,
  partialLaborSchema,
} from '../../middlewares/validateBody';
import { checkUserIs } from '../../middlewares/userRole/checkUserIs';
import { Role } from '../../middlewares/userRole/roles';

const router: Router = express.Router();

router.get('/', laborController.getAllLabors);
router.post(
  '/',
  checkUserIs(Role.PRODUCTION_MANAGER),
  validateBody(laborSchema),
  laborController.createLabor
);
router.get('/:id', laborController.getOneLabor);
router.patch(
  '/:id',
  checkUserIs(Role.PRODUCTION_MANAGER),
  validateBody(partialLaborSchema),
  laborController.updateLabor
);

export default router;
