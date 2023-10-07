/* eslint-disable no-useless-catch */
// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuid } from 'uuid';
import { UserCredentials, Tokens } from '../types';
import * as Credentials from '../databases/Credentials';

const isValidCredentials = (userCredentials: UserCredentials) => {
  try {
    const isValid = Credentials.isValidCredentials(userCredentials);
    return isValid;
  } catch (error) {
    throw error;
  }
};

const generateTokens = () => {
  const tokens: Tokens = {
    token: uuid(),
    refreshToken: uuid(),
  };

  return tokens;
};

export { isValidCredentials, generateTokens };
