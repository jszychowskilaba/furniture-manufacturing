/* eslint-disable no-useless-catch */
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuid } from 'uuid';
import { UserCredentials } from '../types';
import * as Credentials from '../databases/Credentials';
import * as Auth from '../databases/Auth';

/**
 * Checks if user credential es valid. Function will modified
 * after setting up project main data base
 * @param userCredentials The user credential
 * @returns true if valid, error if not
 */
const isValidCredentials = (userCredentials: UserCredentials): boolean => {
  try {
    const isValid = Credentials.isValidCredentials(userCredentials);
    return isValid;
  } catch (error) {
    throw error;
  }
};

/**
 * Login a user given a user credential. If logig successful, updates
 * token, refresh token and return them. It works by:
 * 1. Storing tokens with user information as key, and token as value.
 *  These pair of key values are used for tracking the tokens for
 *  updating them.
 * 2. Store the same tokens as key, and the user information as values
 *  These pair of tokens are the used for OAuth, so no user information
 *  is needed to validate the user.
 * @param userCredentials The credential
 * @returns The tokens
 */
const login = async (userCredentials: UserCredentials): Promise<string[]> => {
  isValidCredentials(userCredentials);

  // Creating access key
  const tokenKey = `${userCredentials.username}.token`;
  const refreshTokenKey = `${userCredentials.username}.refreshToken`;
  // Getting old tokens
  const oldToken = await Auth.getTokenAsync(tokenKey);
  const oldRefreshToken = await Auth.getTokenAsync(refreshTokenKey);

  // Deleting old tokens
  if (oldToken) {
    await Auth.deleteTokenAsync(oldToken);
    await Auth.deleteTokenAsync(tokenKey);
  }
  if (oldRefreshToken) {
    Auth.deleteTokenAsync(oldRefreshToken);
    Auth.deleteTokenAsync(refreshTokenKey);
  }

  // Creating new tokens
  const newToken = uuid();
  const newRefreshToken = uuid();
  const newTokenExpiration = Number(process.env.TOKEN_EXPIRATION) || 300;
  const newRefreshTokenExpiration = Number(process.env.REFRESH_TOKEN_EXPIRATION) || 19200;

  // Storing new tokens
  await Auth.storeTokenAsync(tokenKey, newToken, newTokenExpiration);
  await Auth.storeTokenAsync(newToken, tokenKey, newTokenExpiration);
  await Auth.storeTokenAsync(
    refreshTokenKey,
    newRefreshToken,
    newRefreshTokenExpiration,
  );
  await Auth.storeTokenAsync(
    newRefreshToken,
    refreshTokenKey,
    newRefreshTokenExpiration,
  );

  return [newToken, newRefreshToken];
};

// eslint-disable-next-line import/prefer-default-export
export { login };
