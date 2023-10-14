import express, { Router } from 'express';
import * as inventoryController from '../../controllers/inventoryController';

const router: Router = express.Router();

router.get('/', inventoryController.getAllMaterials);
router.post('/', inventoryController.createMaterial);
router.get('/:id', inventoryController.getOneMaterial);
router.put('/:id', inventoryController.updateMaterial);

export { router };
