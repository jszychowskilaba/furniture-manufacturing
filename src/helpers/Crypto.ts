import * as crypto from 'crypto';
import { ICreatedPassword } from '../dto/User';

interface ICrypto {
  createPassword(userPassword: string): ICreatedPassword;
  isValidPassword(
    userPassword: string,
    storedHash: string,
    storedSalt: string
  ): boolean;
}

export class Crypto implements ICrypto {
  createPassword(userPassword: string): ICreatedPassword {
    const salt = crypto.randomBytes(16).toString('hex') as string;

    const hashedPassword = crypto
      .createHmac('sha256', salt)
      .update(userPassword)
      .digest('hex') as string;

    const createdPassword: ICreatedPassword = {
      hashedPassword: hashedPassword,
      salt: salt,
    };

    return createdPassword;
  }

  isValidPassword(
    userPassword: string,
    storedHash: string,
    storedSalt: string
  ): boolean {
    const hashedPassword = crypto
      .createHmac('sha256', storedSalt)
      .update(userPassword)
      .digest('hex');
    return hashedPassword === storedHash;
  }
}
