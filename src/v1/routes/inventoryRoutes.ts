import express, { Router } from 'express';
import * as inventoryController from '../../controllers/inventoryController';
import {
  validateBody,
  materialSchema,
  partialMaterialSchema,
} from '../../middlewares/validateBody';

const router: Router = express.Router();

router.get('/', inventoryController.getAllMaterials);
router.post(
  '/',
  validateBody(materialSchema),
  inventoryController.createMaterial
);
router.get('/:id', inventoryController.getOneMaterial);
router.patch(
  '/:id',
  validateBody(partialMaterialSchema),
  inventoryController.updateMaterial
);

export default router;
