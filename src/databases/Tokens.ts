import { createClient } from 'redis';
import { UserCredentials, Error } from '../types';

const TokensDB = createClient({ url: 'redis://localhost:6379' });

const setTokenAsync = async (key: string, value: string) => {
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

const getTokenAsync = async (key: string) => {
  try {
    const isStored = await TokensDB.get(key);
  } catch (error) {}
};

const createToken = async (uuid: string, userCredentials: UserCredentials) => {
  await setTokenAsync(uuid, userCredentials.username);
  await setTokenAsync(userCredentials.username, uuid);
};

export { TokensDB, createToken };
