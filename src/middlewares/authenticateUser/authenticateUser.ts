import { Request, Response, NextFunction } from 'express';
import Auth from '../../repositories/AuthDataBase';
import { CustomError } from '../../helpers/CustomError';
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

  next(new CustomError(message, status));
};

export default authenticateUser;
