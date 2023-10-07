import * as Credentials from '../databases/Credentials';

const isValidCredentials = (userCredentials: object) => {
  try {
    const isValid = Credentials.isValidCredentials(userCredentials);
    return isValid;
  } catch (error) {
    throw error;
  }
};

const generateTokens = (userCredentials: object) => null;

export { isValidCredentials, generateTokens };
