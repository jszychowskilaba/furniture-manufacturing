import express, { Router } from 'express';
import authController from '../../controllers/authController';
import authenticateUser from '../../middlewares/authenticateUser/authenticateUser';

const router: Router = express.Router();

router.post('/login', authController.login);
router.delete('/logout', authenticateUser, authController.logout);
router.post('/refresh-tokens', authController.refreshTokens);

export default router;
