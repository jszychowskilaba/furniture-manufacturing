/* eslint-disable import/no-extraneous-dependencies */
import { Request, Response } from 'express';
import * as authServices from '../services/authServices';
import { UserCredentials, Error } from '../types';
import { isValidCredentials } from '../databases/Credentials';

/**
 * Perform user login given user credentials in a request. If
 * login succesful, response with a new pair of token and refreshToken for OAuth
 * @param req The request
 * @param res The response
 */
const login = async (req: Request, res: Response) => {
  const { body } = req;
  // If not valid user, throw error.
  if (!body.username || !body.password) {
    res.status(400).send({
      status: 'Cannot log in',
      error: 'Missing keys. "name" or "pass"',
    });
    return;
  }

  const userCredentials: UserCredentials = {
    username: body.username,
    password: body.password,
  };

  // Updating tokens
  try {
    isValidCredentials(userCredentials); // If not valid, throws error
    const [newToken, newRefreshToken] = await authServices.login(userCredentials);
    res.status(200).send({ newToken, newRefreshToken });
  } catch (error) {
    res.status((error as Error).status).json((error as Error).message);
  }
};

const logout = (req: Request, res: Response) => {
  res.send('logout');
};

const refreshTokens = async (req: Request, res: Response) => {
  const oldRefreshToken = req.header('authorization');
  if (oldRefreshToken) {
    try {
      const [newToken, newRefreshToken] = await authServices.refreshTokens(oldRefreshToken);
      res.status(200).send({ newToken, newRefreshToken });
    } catch (error) {
      res.status((error as Error).status).json((error as Error).message);
    }
  } else {
    const error: Error = {
      status: 401,
      message: 'Refresh token not valid',
    };
    res.status(error.status).json(error.message);
  }
};

export { login, logout, refreshTokens };
