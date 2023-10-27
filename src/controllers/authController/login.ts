import { Request, Response, NextFunction } from 'express';
import * as authServices from '../../services/authServices';
import { UserCredentials } from '../../types/types';
import 'dotenv/config';
import { CustomError } from '../../helpers/CustomError';

/**
 * Perform user login given user credentials in a request. If
 * login successful, response with a new pair of token and refreshToken for OAuth
 * @param req The request
 * @param res The response
 */
const login = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  try {
    if (!body.client_id || !body.client_secret) {
      throw new CustomError(
        'Missing keys. "client_id" or "client_secret"',
        400
      );
    }

    const userCredentials: UserCredentials = {
      client_id: body.client_id,
      client_secret: body.client_secret,
    };

    const [newToken, newRefreshToken] = await authServices.login(
      userCredentials
    );
    res.status(200).json({
      access_token: newToken,
      refresh_token: newRefreshToken,
      expires_in: Number(process.env.TOKEN_EXPIRATION) || 300,
    });
  } catch (error) {
    next(error);
  }
};

export { login };
