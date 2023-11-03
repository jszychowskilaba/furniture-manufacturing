import { Request, Response, NextFunction } from 'express';
import authServices from '../services/authServices';
import { UserCredentials } from '../types/types';
import 'dotenv/config';
import { CustomError } from '../helpers/CustomError';

class AuthController {
  /**
   * Perform user login given user credentials in a request. If
   * login successful, response with a new pair of token and refreshToken for OAuth
   * @param req The request
   * @param res The response
   */
  async login(req: Request, res: Response, next: NextFunction) {
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
      res.status(201).json({
        access_token: newToken,
        refresh_token: newRefreshToken,
        expires_in: Number(process.env.TOKEN_EXPIRATION) || 300,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Performs user log out. If logout successful, responds with status 204.
   * @param req The request
   * @param res The response
   * @returns
   */
  async logout(req: Request, res: Response, next: NextFunction) {
    const token = req.header('authorization');

    try {
      if (token) {
        await authServices.logout(token);
        res.status(204).json('');
      } else {
        throw new CustomError('Missing token', 400);
      }
    } catch (error) {
      next(error);
    }
  }

  /**
   * Response with new authentication tokens given a valid refresh token
   * from a request.
   * @param req The request
   * @param res The response
   */
  async refreshTokens(req: Request, res: Response, next: NextFunction) {
    try {
      const oldRefreshToken = req.body.refresh_token;
      if (!oldRefreshToken) {
        throw new CustomError('Missing refresh token', 400);
      }

      const [newToken, newRefreshToken] = await authServices.refreshTokens(
        oldRefreshToken
      );

      res.status(200).json({
        access_token: newToken,
        refresh_token: newRefreshToken,
        expires_in: Number(process.env.TOKEN_EXPIRATION) || 300,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
