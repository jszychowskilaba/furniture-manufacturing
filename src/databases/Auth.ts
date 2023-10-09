/* eslint-disable @typescript-eslint/no-throw-literal */
import { createClient } from 'redis';
import { Error } from '../types';
import 'dotenv/config';

// Create redis TokensDB client
const TokensDB = createClient({ url: 'redis://localhost:6379' });

/**
 * Set a pair of key value on Auth Data Base with a given expiration time
 * @param key The key
 * @param value The value
 * @param value The expiration time
 */
const storeAsync = async (
  key: string,
  value: string,
  expirationTime: number,
): Promise<void> => {
  try {
    const isCreated = await TokensDB.set(key, value);
    await TokensDB.expire(key, expirationTime);
    if (!isCreated) {
      const error: Error = {
        status: 500,
        message: 'Can not create token',
      };
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw error;
    }
  } catch (err) {
    const error: Error = {
      status: (err as Error).status || 500,
      message: (err as Error).message || `${err}`,
    };
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw { error };
  }
};

/**
 * Returns a stored value of a given key from Auth Data Base. If there key
 * is not present, returns null.
 * @param key The key
 * @returns The value
 */
const getAsync = async (key: string): Promise<string | null> => {
  try {
    const token = await TokensDB.get(key);
    return token;
  } catch (err) {
    const error: Error = {
      status: 500,
      message: `Can not get token. ${err}`,
    };
    throw error;
  }
};

/**
 * Delete pair of key value given a key in Auth Data Base
 * @param key The key
 */
const deleteAsync = async (key: string): Promise<void> => {
  try {
    await TokensDB.del(key);
  } catch (err) {
    const error: Error = {
      status: 500,
      message: `Can not get token. ${err}`,
    };
    throw { error };
  }
};
export {
  TokensDB, storeAsync, getAsync, deleteAsync,
};
