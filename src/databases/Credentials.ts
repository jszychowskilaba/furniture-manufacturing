/* eslint-disable @typescript-eslint/no-throw-literal */
import { UserCredentials, Error } from '../types';

// For testing porpuses
const DB = [
  { username: 'jose', password: '123456' },
  { username: 'juan', password: '5678910' },
];
/**
 * Check if user is registred given a user credential
 * @param userCredentials The user credential
 * @returns true if user is regiesterd, error if not.
 */
const isValidCredentials = (userCredentials: UserCredentials): boolean => {
  const isValid = DB.find(
    (credential) => credential.username === userCredentials.username
      && credential.password === userCredentials.password,
  );

  if (isValid) return true;

  const error: Error = {
    status: 404,
    message: 'Invalid user or password',
  };
  throw error;
};

// eslint-disable-next-line import/prefer-default-export
export { isValidCredentials };
