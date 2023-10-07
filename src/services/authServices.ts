/* eslint-disable no-useless-catch */
import { UserCredentials } from '../types';
import * as Credentials from '../databases/Credentials';

const isValidCredentials = (userCredentials: UserCredentials) => {
  try {
    const isValid = Credentials.isValidCredentials(userCredentials);
    return isValid;
  } catch (error) {
    throw error;
  }
};

const generateTokens = (userCredentials: UserCredentials) => {
  const a = userCredentials;
  return a;
};

export { isValidCredentials, generateTokens };
