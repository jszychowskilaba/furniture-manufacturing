import express, { Router } from 'express';
import * as laborController from '../../controllers/laborController';

const router: Router = express.Router();

router.get('/', laborController.getAllLabors);
router.post('/', laborController.createLabor);
router.get('/:id', laborController.getOneLabor);
router.put('/:id', laborController.updateLabor);

export default router;
