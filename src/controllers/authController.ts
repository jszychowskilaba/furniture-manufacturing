import { Request, Response } from 'express';
import * as authServices from '../services/authServices/authServices';
import { UserCredentials, Error } from '../types/types';
import 'dotenv/config';

/**
 * Perform user login given user credentials in a request. If
 * login successful, response with a new pair of token and refreshToken for OAuth
 * @param req The request
 * @param res The response
 */
const login = async (req: Request, res: Response) => {
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

const logout = async (req: Request, res: Response) => {
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
    res.status((error as Error).status).json((error as Error).message);
  }
};

/**
 * Response with new authentication tokens given a valid refresh token
 * from a request.
 * @param req The request
 * @param res The response
 */
const refreshTokens = async (req: Request, res: Response) => {
  const oldRefreshToken = req.body.refresh_token;
  if (!oldRefreshToken) {
    const error: Error = {
      status: 400,
      message: 'Missing refresh token',
    };
    res.status(error.status).json(error.message);
    return;
  }

  try {
    const [newToken, newRefreshToken] = await authServices.refreshTokens(
      oldRefreshToken
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

export { login, logout, refreshTokens };
