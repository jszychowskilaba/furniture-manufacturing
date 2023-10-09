/* eslint-disable import/no-extraneous-dependencies */
import { Request, Response } from 'express';
import * as authServices from '../services/authServices';
import { UserCredentials, Error } from '../types';

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
    const [token, refreshToken] = await authServices.login(userCredentials);
    res.status(200).send({
      message: 'Login successful',
      token,
      refreshToken,
    });
  } catch (error) {
    res.status((error as Error).status).send({
      status: (error as Error).status,
      message: (error as Error).message,
    });
  }
};

const logout = (req: Request, res: Response) => {
  res.send('logout');
};

const refreshToken = (req: Request, res: Response) => {
  res.send('refresh token');
};

export { login, logout, refreshToken };
