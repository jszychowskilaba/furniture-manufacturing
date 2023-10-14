import express, { Router } from 'express';
import * as laborController from '../../controllers/laborController';
import { validateBody, laborSchema } from '../../middlewares/validateBody';

const router: Router = express.Router();

router.get('/', laborController.getAllLabors);
router.post('/', validateBody(laborSchema), laborController.createLabor);
router.get('/:id', laborController.getOneLabor);
router.put('/:id', validateBody(laborSchema), laborController.updateLabor);

export default router;
