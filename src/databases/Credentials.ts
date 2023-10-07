/* eslint-disable @typescript-eslint/no-throw-literal */
import { UserCredentials } from '../types';

const DB = [
  { username: 'jose', password: '123456' },
  { username: 'juan', password: '5678910' },
];

const isValidCredentials = (userCredentials: UserCredentials) => {
  // eslint-disable-next-line consistent-return
  DB.forEach((credential) => {
    if (
      credential.username === userCredentials.username
      && credential.password === userCredentials.password
    ) {
      return true;
    }
  });

  throw { status: 404, message: 'Invalid user or password' };
};

export { isValidCredentials };
