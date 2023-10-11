import { UserCredentials, Error } from '../types';

// For testing proposes
const DB = [
  { username: 'jose', password: '123456' },
  { username: 'juan', password: '5678910' },
];
/**
 * Check if user is registered given a user credential
 * @param userCredentials The user credential
 * @returns true if user is registered, error if not.
 */
const isValidCredentials = (userCredentials: UserCredentials): boolean => {
  const isValid = DB.find(
    (credential) =>
      credential.username === userCredentials.username &&
      credential.password === userCredentials.password
  );

  if (isValid) return true;

  const error: Error = {
    status: 404,
    message: 'Invalid user or password',
  };
  throw error;
};

export { isValidCredentials };
