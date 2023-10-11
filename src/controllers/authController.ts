import { Request, Response } from 'express';
import * as authServices from '../services/authServices';
import { UserCredentials, Error } from '../types';

/**
 * Perform user login given user credentials in a request. If
 * login successful, response with a new pair of token and refreshToken for OAuth
 * @param req The request
 * @param res The response
 */
const login = async (req: Request, res: Response) => {
  const { body } = req;
  // If not valid user, throw error.
  if (!body.username || !body.password) {
    res.status(400).json('Missing keys. "name" or "pass"');
    return;
  }

  const userCredentials: UserCredentials = {
    username: body.username,
    password: body.password,
  };

  // Updating tokens
  try {
    const [newToken, newRefreshToken] = await authServices.login(
      userCredentials
    );
    res.status(200).json({ newToken, newRefreshToken });
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
  const oldRefreshToken = req.header('authorization');
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
    res.status(200).json({ newToken, newRefreshToken });
  } catch (error) {
    res.status((error as Error).status).json((error as Error).message);
  }
};

export { login, logout, refreshTokens };
