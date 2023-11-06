import { ICreationStamp } from '../types/types';

export interface User {
  username: string;
  email: string;
  password: string;
  name: string;
  lastName: string;
  role:
    | 'inactive'
    | 'sales'
    | 'productionManager'
    | 'inventoryAdministrator'
    | 'admin';
}

export interface ICreatedPassword {
  hashedPassword: string;
  salt: string;
}

export interface CreatedUser extends User, ICreatedPassword, ICreationStamp {}
export interface PartialUser extends Partial<User> {}
export interface PartialCreatedUser extends Partial<CreatedUser> {}
