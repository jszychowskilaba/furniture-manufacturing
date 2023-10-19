import { Request, Response } from 'express';
import * as authServices from '../../services/authServices';
import { UserCredentials, Error } from '../../types/types';
import 'dotenv/config';

/**
 * Perform user login given user credentials in a request. If
 * login successful, response with a new pair of token and refreshToken for OAuth
 * @param req The request
 * @param res The response
 */
const login = async (req: Request, res: Response) => {
  console.log("entre")
  const body = req.body;

  if (!body.client_id || !body.client_secret) {
    res.status(400).json('Missing keys. "client_id" or "client_secret"');
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
    res.status((error as Error).status).json((error as Error).message);
  }
};

export { login };
