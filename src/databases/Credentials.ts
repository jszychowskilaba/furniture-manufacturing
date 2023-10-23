import { UserCredentials } from '../types/types';
import { throwError } from '../utils/throwError';

// For testing proposes
const DB = [
  { client_id: 'jose', client_secret: '123456' },
  { client_id: 'juan', client_secret: '5678910' },
];
/**
 * Check if user is registered given a user credential
 * @param userCredentials The user credential
 * @returns true if user is registered, error if not.
 */
const isValidCredentials = (userCredentials: UserCredentials): boolean => {
  const isValid = DB.find(
    (credential) =>
      credential.client_id === userCredentials.client_id &&
      credential.client_secret === userCredentials.client_secret
  );

  if (isValid) return true;

  throwError('Invalid user or password', 404);
  return false;
};

export { isValidCredentials };
