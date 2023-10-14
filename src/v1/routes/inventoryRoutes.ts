import express, { Router } from 'express';
import * as inventoryController from '../../controllers/inventoryController';
import { validateBody, materialSchema } from '../../middlewares/validateBody';

const router: Router = express.Router();

router.get('/', inventoryController.getAllMaterials);
router.post(
  '/',
  validateBody(materialSchema),
  inventoryController.createMaterial
);
router.get('/:id', inventoryController.getOneMaterial);
router.put(
  '/:id',
  validateBody(materialSchema),
  inventoryController.updateMaterial
);

export default router;
