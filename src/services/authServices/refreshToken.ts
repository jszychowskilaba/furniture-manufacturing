import { UserCredentials } from '../../types/types';
import updateTokens from './auth-utils/updateTokens';

import * as Auth from '../../repositories/AuthDataBase';
import { CustomError } from '../../helpers/CustomError';

/**
 * Refresh the token and refresh token if the incoming
 * refresh token is valid
 * @param refreshToken The refresh token
 * @returns The new tokens
 */
const refreshTokens = async (refreshToken: string): Promise<string[]> => {
  const tokenType = await Auth.getTokenType(refreshToken);

  if (tokenType === 'refreshToken') {
    const username = await Auth.getUsernameFromToken(refreshToken);

    if (username) {
      const userCredentials: UserCredentials = {
        client_id: username,
        client_secret: null,
      };

      return updateTokens(userCredentials);
    }
  }

  throw new CustomError('Refresh token not valid', 401);
};

export { refreshTokens };
