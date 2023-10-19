import { Request, Response, NextFunction } from 'express';
import * as authServices from '../../services/authServices';
import { UserCredentials, Error } from '../../types/types';
import 'dotenv/config';

/**
 * Perform user login given user credentials in a request. If
 * login successful, response with a new pair of token and refreshToken for OAuth
 * @param req The request
 * @param res The response
 */
const login = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;

  if (!body.client_id || !body.client_secret) {
    const error: Error = {
      status: 400,
      message: 'Missing keys. "client_id" or "client_secret"',
    };
    next(error);
    return;
  }

  const userCredentials: UserCredentials = {
    client_id: body.client_id,
    client_secret: body.client_secret,
  };

  // Updating tokens
  try {
    const [newToken, newRefreshToken] = await authServices.login(
      userCredentials
    );
    res.status(200).json({
      access_token: newToken,
      refresh_token: newRefreshToken,
      expires_in: Number(process.env.TOKEN_EXPIRATION) || 300,
    });
  } catch (error) {
    const error2: Error = {
      status: (error as Error).status,
      message: (error as Error).message,
    };
    next(error2);
  }
};

export { login };
