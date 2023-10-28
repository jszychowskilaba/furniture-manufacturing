import express, { Router } from 'express';
import laborController from '../../controllers/laborController';
import {
  validateBody,
  laborSchema,
  partialLaborSchema,
} from '../../middlewares/validateBody';

const router: Router = express.Router();

router.get('/', laborController.getAllLabors);
router.post('/', validateBody(laborSchema), laborController.createLabor);
router.get('/:id', laborController.getOneLabor);
router.patch(
  '/:id',
  validateBody(partialLaborSchema),
  laborController.updateLabor
);

export default router;
