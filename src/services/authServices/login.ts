import { UserCredentials } from '../../types/types';
import updateTokens from './auth-utils/updateTokens';
import isValidCredentials from './auth-utils/isValidCredentials';

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

export { login };
