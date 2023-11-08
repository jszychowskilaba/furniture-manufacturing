import { UserCredentials } from '../types/types';
import updateTokens from './helpers/updateTokens';
import isValidCredentials from './helpers/isValidCredentials';
import Auth, { AuthDataBase } from '../repositories/AuthDataBase';
import { CustomError } from '../helpers/CustomError';

class AuthServices {
  private Auth: AuthDataBase;

  constructor(AuthDataBase: AuthDataBase) {
    this.Auth = AuthDataBase;
  }

  /**
   * Login user if user credentials are valid. It works by generating
   * oauth tokens, storing them in AuthDB and returning them
   * @param userCredentials The user credentials
   * @returns The tokens
   */
  async login(userCredentials: UserCredentials): Promise<string[]> {
    await isValidCredentials(userCredentials);

    return updateTokens(userCredentials);
  }

  /**
   * Delete tokens from Auth Data Base if incoming token is valid
   * @param token The token
   */
  async logout(token: string): Promise<void> {
    const username = await this.Auth.getUsernameFromToken(token);

    if (!username) {
      throw new CustomError('Invalid token', 401);
    }

    const refreshToken = await this.Auth.getAsync(`${username}.refreshToken`);

    // Deleting tokens
    await this.Auth.deleteAsync(token);
    await this.Auth.deleteAsync(`${username}.token`);

    if (refreshToken) {
      await this.Auth.deleteAsync(refreshToken);
      await this.Auth.deleteAsync(`${username}.refreshToken`);
    }
  }

  /*
   * Refresh the token and refresh token if the incoming
   * refresh token is valid
   * @param refreshToken The refresh token
   * @returns The new tokens
   */
  async refreshTokens(refreshToken: string): Promise<string[]> {
    const tokenType = await this.Auth.getTokenType(refreshToken);

    if (tokenType === 'refreshToken') {
      const username = await this.Auth.getUsernameFromToken(refreshToken);

      if (username) {
        const userCredentials: UserCredentials = {
          client_id: username,
          client_secret: null,
        };

        return updateTokens(userCredentials);
      }
    }

    throw new CustomError('Refresh token not valid', 401);
  }
}

export default new AuthServices(Auth);
