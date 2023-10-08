/* eslint-disable @typescript-eslint/no-throw-literal */
import { createClient } from 'redis';
import { UserCredentials, Error } from '../types';

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
 * Store token in TokensDB. Two values are stored. Token can be
 * token or refresh token.
 * 1. The uuid as key and the value as the <username.token_type>
 * 2. The <username.token_type> as key and the uuid as the value.
 * 1 => Allows as to know if the token is valid, and update 2.
 * 2 => Allows as to know the tokens uuid, so we can delete previous
 * tokens when the user loges in again.
 * @param uuid The uuid
 * @param userCredentials The user credentials
 * @param tokenType The  token type
 */
const storeTokenAsync = async (
  uuid: string,
  userCredentials: UserCredentials,
  tokenType: string,
): Promise<void> => {
  await setTokenAsync(uuid, `${userCredentials.username}.${tokenType}`);
  await setTokenAsync(`${userCredentials.username}.${tokenType}`, uuid);
};

export { TokensDB, storeTokenAsync, getTokenAsync };
