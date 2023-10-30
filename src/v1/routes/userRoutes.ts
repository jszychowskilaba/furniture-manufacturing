import express, { Router } from 'express';
import userController from '../../controllers/userController';
import { validateBody } from '../../middlewares/validateBody';
import {
  userSchema,
  partialUserSchema,
} from '../../middlewares/validateBody/schemas/userSchema';

const router: Router = express.Router();

router.get('/', userController.getAllUsers);
router.post('/', validateBody(userSchema), userController.createUser);
router.get('/:id', userController.getOneUser);
router.patch(
  '/:id',
  validateBody(partialUserSchema),
  userController.updateUser
);

export default router;
