import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../helpers/CustomError';
import authServices, { AuthServices } from '../services/authServices';
import { UserCredentials } from '../types/types';
import 'dotenv/config';

class AuthController {
  private authServices: AuthServices;

  constructor(authServices: AuthServices) {
    this.authServices = authServices;
  }

  /**
   * Perform user login given user credentials in a request. If
   * login successful, response with a new pair of token and refreshToken for OAuth
   * @param req The request
   * @param res The response
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
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

      const [newToken, newRefreshToken] = await this.authServices.login(
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
  };

  /**
   * Performs user log out. If logout successful, responds with status 204.
   * @param req The request
   * @param res The response
   * @returns
   */
  logout = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('authorization');

    try {
      if (token) {
        await this.authServices.logout(token);
        res.status(204).json('');
      } else {
        throw new CustomError('Missing token', 400);
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * Response with new authentication tokens given a valid refresh token
   * from a request.
   * @param req The request
   * @param res The response
   */
  refreshTokens = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const oldRefreshToken = req.body.refresh_token;
      if (!oldRefreshToken) {
        throw new CustomError('Missing refresh token', 400);
      }

      const [newToken, newRefreshToken] = await this.authServices.refreshTokens(
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
  };
}

export default new AuthController(authServices);
