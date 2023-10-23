import { Request, Response, NextFunction } from 'express';
import * as Auth from '../../databases/Auth';
import { throwError } from '../../utils/throwError';
/**
 * Authenticate a user by its request token and add username
 * property in request header with username.
 * If token is not valid, response with 401.
 * @param req The request
 * @param res The response
 * @param next The next middleware
 */
const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header('authorization');

  try {
    if (token) {
      const tokenType = await Auth.getTokenType(token);
      if (tokenType === 'token') {
        req.headers['username'] = await Auth.getUsernameFromToken(token);
        next();
        return;
      }
    }

    let status;
    let message;

    if (token === undefined) {
      status = 400;
      message = 'Missing token';
    } else {
      status = 401;
      message = 'Token is not valid for authentication';
    }

    throwError(message, status);
  } catch (error) {
    next(error);
  }
};

export default authenticateUser;
