/* eslint-disable no-useless-catch */
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuid } from 'uuid';
import { UserCredentials, Error } from '../types';
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
 * Updates token and refreshToken with expiration time stored
 * in .env, and return them. It works by:
 * 1. Storing tokens with user information as key, and token as value.
 *  These pair of key values are used for tracking the tokens for
 *  updating them.
 * 2. Store the same tokens as key, and the user information as values
 *  These pair of tokens are the used for OAuth, so no user information
 *  is needed to validate the user.
 * @param userCredentials The credential
 * @returns The new tokens
 */
const login = async (userCredentials: UserCredentials): Promise<string[]> => {
  // Creating access key
  const tokenKey = `${userCredentials.username}.token`;
  const refreshTokenKey = `${userCredentials.username}.refreshToken`;

  // Getting old tokens
  const oldToken = await Auth.getAsync(tokenKey);
  const oldRefreshToken = await Auth.getAsync(refreshTokenKey);

  if (oldToken) {
    // Deleting old token access key
    await Auth.deleteAsync(oldToken);
    // Deleting old token
    await Auth.deleteAsync(tokenKey);
  }
  if (oldRefreshToken) {
    // Deleting old refresh token
    Auth.deleteAsync(oldRefreshToken);
    // Deleting old refresh token access key
    Auth.deleteAsync(refreshTokenKey);
  }

  // Creating new tokens
  const newToken = uuid();
  const newRefreshToken = uuid();
  const newTokenExpiration = Number(process.env.TOKEN_EXPIRATION) || 300;
  const newRefreshTokenExpiration = Number(process.env.REFRESH_TOKEN_EXPIRATION) || 19200;

  // Storing new tokens
  await Auth.storeAsync(tokenKey, newToken, newTokenExpiration);
  await Auth.storeAsync(newToken, tokenKey, newTokenExpiration);
  await Auth.storeAsync(
    refreshTokenKey,
    newRefreshToken,
    newRefreshTokenExpiration,
  );
  await Auth.storeAsync(
    newRefreshToken,
    refreshTokenKey,
    newRefreshTokenExpiration,
  );

  return [newToken, newRefreshToken];
};

/**
 * Refresh the token and refresh token if the incoming
 * refresh token is valid
 * @param refreshToken The refresh token
 * @returns The new tokens
 */
const refreshTokens = async (refreshToken: string): Promise<string[]> => {
  // Getting username using the refresh token
  const userNameKey = await Auth.getAsync(refreshToken); // <username>.refreshToken
  if (!userNameKey) {
    const error: Error = {
      status: 401,
      message: 'Invalid refresh token',
    };
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw error;
  }
  // Preparing username in correct forman
  const userName = userNameKey.slice(0, -13); // username (removes <.refreshToken>)
  // Preparing user credentials to be able to update the tokens
  const userCredentials: UserCredentials = {
    username: userName,
    password: null, // setting null value to have the corresponding type
  };
  return login(userCredentials);
};

// eslint-disable-next-line import/prefer-default-export
export { login, refreshTokens, isValidCredentials };
