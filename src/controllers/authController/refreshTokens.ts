import { Request, Response, NextFunction } from 'express';
import * as authServices from '../../services/authServices';
import 'dotenv/config';
import { CustomError } from '../../utils/CustomError';

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
};

export { refreshTokens };
