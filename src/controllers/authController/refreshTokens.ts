import { Request, Response, NextFunction } from 'express';
import * as authServices from '../../services/authServices';
import { Error } from '../../types/types';
import 'dotenv/config';

/**
 * Response with new authentication tokens given a valid refresh token
 * from a request.
 * @param req The request
 * @param res The response
 */
const refreshTokens = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const oldRefreshToken = req.body.refresh_token;
  if (!oldRefreshToken) {
    const error: Error = {
      status: 400,
      message: 'Missing refresh token',
    };
    next(error);
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
    const err: Error = {
      status: (error as Error).status,
      message: (error as Error).message,
    };
    next(err);
  }
};

export { refreshTokens };