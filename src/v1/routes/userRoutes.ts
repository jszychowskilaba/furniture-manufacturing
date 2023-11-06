import express, { Router } from 'express';
import userController from '../../controllers/userController';
import { validateBody } from '../../middlewares/validateBody';
import {
  userSchema,
  partialUserSchema,
} from '../../middlewares/validateBody/schemas/userSchema';
import { checkUserIs } from '../../middlewares/userRole/checkUserIs';
import { Role } from '../../middlewares/userRole/roles';

const router: Router = express.Router();

router.get('/', userController.getAllUsers);
router.post(
  '/',
  checkUserIs(Role.ADMIN),
  validateBody(userSchema),
  userController.createUser
);
router.get('/:id', userController.getOneUser);
router.patch(
  '/:id',
  checkUserIs(Role.ADMIN),
  validateBody(partialUserSchema),
  userController.updateUser
);

export default router;
