/* eslint-disable @typescript-eslint/no-throw-literal */
import { UserCredentials, Error } from '../types';

const DB = [
  { username: 'jose', password: '123456' },
  { username: 'juan', password: '5678910' },
];

const isValidCredentials = (userCredentials: UserCredentials) => {
  const isValid = DB.find(
    (credential) => credential.username === userCredentials.username
      && credential.password === userCredentials.password,
  );

  if (isValid) return true;

  const error: Error = { status: 404, message: 'Invalid user or password' };
  throw error;
};

// eslint-disable-next-line import/prefer-default-export
export { isValidCredentials };
