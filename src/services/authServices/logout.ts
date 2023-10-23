import * as Auth from '../../databases/Auth';
import { CustomError } from '../../utils/CustomError';

/**
 * Delete tokens from Auth Data Base if incoming token is valid
 * @param token The token
 */
const logout = async (token: string): Promise<void> => {
  const username = await Auth.getUsernameFromToken(token);

  if (!username) {
    throw new CustomError('Invalid token', 401);
  }

  const refreshToken = await Auth.getAsync(`${username}.refreshToken`);

  // Deleting tokens
  await Auth.deleteAsync(token);
  await Auth.deleteAsync(`${username}.token`);

  if (refreshToken) {
    await Auth.deleteAsync(refreshToken);
    await Auth.deleteAsync(`${username}.refreshToken`);
  }
};

export { logout };
