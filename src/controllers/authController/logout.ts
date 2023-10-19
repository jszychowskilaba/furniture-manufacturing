import { Request, Response, NextFunction } from 'express';
import * as authServices from '../../services/authServices';
import { Error } from '../../types/types';
import 'dotenv/config';

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
      // We are sure there is a token, as we use
      // authenticateUser middleware on this end point
      await authServices.logout(token);
      res.status(204).json('');
      return;
    }
  } catch (error) {
    const err: Error = {
      status: (error as Error).status,
      message: (error as Error).message,
    };
    next(err);
  }
};

export { logout };
