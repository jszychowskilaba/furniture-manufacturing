import 'dotenv/config';
import { CustomError } from '../helpers/CustomError';
import { TokensDB } from '../databases/Auth/Auth';

// FOR DOCKER 'redis://AuthDB:6379'
// For TypeScript 'redis://localhost:6379'

class AuthDataBase {
  /**
   * Set a pair of key value on Auth Data Base with a given expiration time
   * in the Auth data base.
   * @param key The key
   * @param value The value
   * @param value The expiration time
   */
  async storeAsync(
    key: string,
    value: string,
    expirationTime: number
  ): Promise<void> {
    const isCreated = await TokensDB.set(key, value);

    await TokensDB.expire(key, expirationTime);

    if (!isCreated) {
      throw new CustomError('Cannot store key value.', 500);
    }
  }

  /**
   * Returns a stored value of a given key from Auth Data Base. If there key
   * is not present, returns null.
   * @param key The key
   * @returns The value
   */
  async getAsync(key: string): Promise<string | null | void> {
    const token = await TokensDB.get(key);
    return token;
  }

  /**
   * Delete pair of key value given a key in Auth Data Base
   * @param key The key
   */
  async deleteAsync(key: string): Promise<void> {
    await TokensDB.del(key);
  }

  /**
   * Get the token type of a given token or refresh token
   * @param token The token or refresh token
   * @returns The token type ('token' | 'refreshToken' | undefined)
   */
  async getTokenType(token: string): Promise<string | undefined> {
    const usernameKey = await this.getAsync(token); // <username>.refreshToken | <username>.token
    if (usernameKey) {
      // checking if usernameKey is token type or refreshToken type
      const regex =
        /(?<token>^(.+)\.token$)|(?<refreshToken>^(.+)\.refreshToken$)/;
      const match = regex.exec(usernameKey);
      if (match && match.groups) {
        if (match.groups.token) return 'token';
        if (match.groups.refreshToken) return 'refreshToken';
      }
    }
    return undefined;
  }

  /* Get the username (the owner) of a give token or refresh token
   * @param token The token or refresh token
   * @returns The user name or undefined
   */
  async getUsernameFromToken(token: string): Promise<string | undefined> {
    const tokenType = await this.getTokenType(token);
    if (tokenType) {
      const usernameKey = await this.getAsync(token);
      if (usernameKey) {
        if (tokenType === 'token') return usernameKey.slice(0, -6);
        if (tokenType === 'refreshToken') return usernameKey.slice(0, -13);
      }
    }
    return undefined;
  }
}

export default new AuthDataBase();
export { AuthDataBase };
