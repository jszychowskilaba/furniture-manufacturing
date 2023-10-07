/* eslint-disable import/no-extraneous-dependencies */
import { Request, Response } from 'express';
import * as authServices from '../services/authServices';
import { UserCredentials, Error } from '../types';

const login = (req: Request, res: Response) => {
  const { body } = req;

  if (!body.username || !body.password) {
    res.status(400).send({
      status: 'Bad Request',
      data: {
        error: 'Missing keys. "name" or "pass"',
      },
    });
  }

  const userCredentials: UserCredentials = {
    username: body.username,
    password: body.password,
  };

  try {
    if (authServices.isValidCredentials(userCredentials)) {
      const authTokens = authServices.generateTokens();
      res.status(200).send({ status: 'OK', data: authTokens });
    }
  } catch (error) {
    res
      .status((error as Error).status || 500)
      .send({
        status: 'FAILED',
        data: { error: (error as Error).message || error },
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
