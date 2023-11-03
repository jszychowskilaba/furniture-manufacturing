import express, { Router } from 'express';
import inventoryController from '../../controllers/inventoryController';
import {
  validateBody,
  materialSchema,
  partialMaterialSchema,
} from '../../middlewares/validateBody';
import { checkUserIs } from '../../middlewares/userRole/checkUserIs';
import { Role } from '../../middlewares/userRole/roles';

const router: Router = express.Router();

router.get('/', inventoryController.getAllMaterials);
router.post(
  '/',
  checkUserIs(Role.INVENTORY_ADMINISTRATOR),
  validateBody(materialSchema),
  inventoryController.createMaterial
);
router.get('/:id', inventoryController.getOneMaterial);
router.patch(
  '/:id',
  checkUserIs(Role.INVENTORY_ADMINISTRATOR),
  validateBody(partialMaterialSchema),
  inventoryController.updateMaterial
);

export default router;
