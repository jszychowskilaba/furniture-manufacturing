import { UserCredentials, Error } from '../../types/types';
import updateTokens from './auth-utils/updateTokens';

import * as Auth from '../../databases/Auth';

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

  const error: Error = {
    status: 401,
    message: 'Refresh token not valid',
  };

  throw error;
};

export { refreshTokens };
