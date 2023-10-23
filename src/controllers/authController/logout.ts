import { Request, Response, NextFunction } from 'express';
import * as authServices from '../../services/authServices';
import 'dotenv/config';
import { throwError } from '../../utils/throwError';

/**
 * Performs user log out. If logout successful, responds with status 204.
 * @param req The request
 * @param res The response
 * @returns
 */
const logout = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('authorization');

  try {
    if (token) {
      await authServices.logout(token);
      res.status(204).json('');
    } else {
      throwError('Missing token', 400);
    }
  } catch (error) {
    next(error);
  }
};

export { logout };
