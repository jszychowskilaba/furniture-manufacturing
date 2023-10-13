import { UserCredentials, Error } from '../types';
import updateTokens from './auth-utils/updateTokens';
import isValidCredentials from './auth-utils/isValidCredentials';

import * as Auth from '../databases/Auth';

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

/**
 * Delete tokens from Auth Data Base if incoming token is valid
 * @param token The token
 */
const logout = async (token: string): Promise<void> => {
  const username = await Auth.getUsernameFromToken(token);
  if (!username) {
    const error: Error = {
      status: 401,
      message: 'Invalid refresh token',
    };

    throw error;
  }

  const refreshToken = await Auth.getAsync(`${username}.refreshToken`);

  // Deleting tokens
  await Auth.deleteAsync(token);
  await Auth.deleteAsync(`${username}.token`);
  if (refreshToken) {
    await Auth.deleteAsync(refreshToken);
    await Auth.deleteAsync(`${username}.refreshToken`);
  }
};

/**
 * Login user if user credentials are valid. It works by generating
 * oauth tokens, storing them in AuthDB and returning them
 * @param userCredentials The user credentials
 * @returns The tokens
 */
const login = async (userCredentials: UserCredentials): Promise<string[]> => {
  isValidCredentials(userCredentials);
  return updateTokens(userCredentials);
};

export { login, refreshTokens, logout };
