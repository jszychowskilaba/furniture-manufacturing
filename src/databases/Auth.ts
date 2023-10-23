import { createClient } from 'redis';
import { Error } from '../types/types';
import 'dotenv/config';
import { throwError } from '../utils/throwError';

// Create redis TokensDB client
const TokensDB = createClient({
  url: process.env.DOCKER_HOST || 'redis://localhost:6379',
});
// FOR DOCKER 'redis://AuthDB:6379'
// For TypeScript 'redis://localhost:6379'

/**
 * Set a pair of key value on Auth Data Base with a given expiration time
 * in the Auth data base.
 * @param key The key
 * @param value The value
 * @param value The expiration time
 */
const storeAsync = async (
  key: string,
  value: string,
  expirationTime: number
): Promise<void> => {
  try {
    const isCreated = await TokensDB.set(key, value);
    await TokensDB.expire(key, expirationTime);
    if (!isCreated) {
      throwError(500, 'Cannot store key value.');
    }
  } catch (e) {
    throwError(
      (e as Error).status || 500,
      (e as Error).message || `Unexpected error in storeAsync ${e}.`
    );
  }
};

/**
 * Returns a stored value of a given key from Auth Data Base. If there key
 * is not present, returns null.
 * @param key The key
 * @returns The value
 */
const getAsync = async (key: string): Promise<string | null | void> => {
  try {
    const token = await TokensDB.get(key);
    return token;
  } catch (e) {
    throwError(500, `Unexpected error in getAsync. ${e}`);
    return;
  }
};

/**
 * Delete pair of key value given a key in Auth Data Base
 * @param key The key
 */
const deleteAsync = async (key: string): Promise<void> => {
  try {
    await TokensDB.del(key);
  } catch (e) {
    throwError(500, `Unexpected error in deleteAsync. ${e}`);
  }
};

/**
 * Get the token type of a given token or refresh token
 * @param token The token or refresh token
 * @returns The token type ('token' | 'refreshToken' | undefined)
 */
const getTokenType = async (token: string): Promise<string | undefined> => {
  const usernameKey = await getAsync(token); // <username>.refreshToken | <username>.token
  if (usernameKey) {
    // checking if usernameKey is token type or refreshToken type
    const regex =
      /(?<token>^(.+)\.token$)|(?<refreshToken>^(.+)\.refreshToken$)/;
    const match = regex.exec(usernameKey);
    if (match && match.groups) {
      if (match.groups.token) return 'token';
      if (match.groups.refreshToken) return 'refreshToken';
    }
  }
  return undefined;
};

/* Get the username (the owner) of a give token or refresh token
 * @param token The token or refresh token
 * @returns The user name or undefined
 */
const getUsernameFromToken = async (
  token: string
): Promise<string | undefined> => {
  const tokenType = await getTokenType(token);
  if (tokenType) {
    const usernameKey = await getAsync(token);
    if (usernameKey) {
      if (tokenType === 'token') return usernameKey.slice(0, -6);
      if (tokenType === 'refreshToken') return usernameKey.slice(0, -13);
    }
  }
  return undefined;
};
export {
  TokensDB,
  storeAsync,
  getAsync,
  deleteAsync,
  getTokenType,
  getUsernameFromToken,
};
