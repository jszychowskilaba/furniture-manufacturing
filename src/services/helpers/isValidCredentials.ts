import { Crypto } from '../../helpers/Crypto';
import { pool } from '../../databases/DataBase/Pool';
import { UserCredentials } from '../../types/types';
import { CustomError } from '../../helpers/CustomError';

/**
 * Checks if user credential es valid. Function will modified
 * after setting up project main data base
 * @param userCredentials The user credential
 * @returns true if valid, error if not
 */
const isValidCredentials = async (
  userCredentials: UserCredentials
): Promise<void> => {
  try {
    const { hashedPassword, salt } = (
      await pool.query(
        `SELECT "hashedPassword", "salt" FROM "appUser" WHERE "username" = '${userCredentials.client_id}'`
      )
    ).rows[0];

    let isValid;
    if (userCredentials.client_secret) {
      isValid = new Crypto().isValidPassword(
        userCredentials.client_secret,
        hashedPassword,
        salt
      );
    }

    if (!isValid) {
      throw new CustomError('Not valid client_ID or client_secret', 404);
    }
  } catch (error) {
    throw new CustomError('Not valid client_ID or client_secret', 404);
  }
};

export default isValidCredentials;
