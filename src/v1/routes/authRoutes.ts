/* eslint-disable import/no-extraneous-dependencies */
import express, { Router } from 'express';
import * as authController from '../../controllers/authController';
import authenticateUser from '../../middlewares/authenticateUser';

const router: Router = express.Router();

router.post('/login', authController.login);
router.post('/logout', authenticateUser, authController.logout);
router.get('/refresh-token', authController.refreshTokens);

export default router;
