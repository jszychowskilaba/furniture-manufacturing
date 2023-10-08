/* eslint-disable @typescript-eslint/no-throw-literal */
import { createClient } from 'redis';
import { Error } from '../types';

// Create redis TokensDB client
const TokensDB = createClient({ url: 'redis://localhost:6379' });

/**
 * Set a pair of key value on TokensDB. Thows an error if operation
 * is not succesfull.
 * @param key The key
 * @param value The value
 */
const setTokenAsync = async (key: string, value: string): Promise<void> => {
  try {
    const isCreated = await TokensDB.set(key, value);

    if (!isCreated) {
      const error: Error = {
        status: 500,
        message: 'Can not create token',
      };
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw error;
    }
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw { status: 500, message: (error as Error).message || error };
  }
};

/**
 * Returns a stored token of a given key from TokensDB. If there key
 * is not present, returns null.
 * @param key The key
 * @returns The value
 */
const getTokenAsync = async (key: string): Promise<string | null> => {
  try {
    const token = await TokensDB.get(key);
    return token;
  } catch (error) {
    throw { status: 500, message: error };
  }
};

/**
 * Store pair of key value in TokensDB
 * @param uuid The uuid
 * @param userCredentials The user credentials
 * @param tokenType The  token type
 */
const storeTokenAsync = async (key: string, value: string): Promise<void> => {
  await setTokenAsync(key, value);
};

/**
 * Delete pair of key value given a key in TokensDB
 * @param key The key
 */
const deleteTokenAsync = async (key: string): Promise<void> => {
  try {
    await TokensDB.del(key);
  } catch (error) {
    throw { status: 500, message: error };
  }
};
export {
  TokensDB, storeTokenAsync, getTokenAsync, deleteTokenAsync,
};
