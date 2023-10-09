/* eslint-disable @typescript-eslint/no-throw-literal */
import { Request, Response, NextFunction } from 'express';
import * as Auth from '../databases/Auth';
/**
 * Authenticate a user by its request token. If token is not valid,
 * response with 401.
 * @param req The request
 * @param res The response
 * @param next The next middleware
 */
const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.header('authorization');

  // Retreive value from token, if there is a value, token is stored.
  let isStoredToken;
  if (token) {
    isStoredToken = await Auth.getTokenAsync(token);
  }

  // If there is no token, o token is not valid
  if (!token || !isStoredToken) {
    res.status(401).send({
      status: 'Invalid token',
      message: 'Token is not valid for authentication',
    });
  } else {
    // If authenticated, go to next middleware
    next();
  }
};

export default authenticateUser;
