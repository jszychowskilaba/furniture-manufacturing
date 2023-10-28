import { ICreationStamp } from './types';

export interface User {
  username: string;
  email: string;
  password: string;
  name: string;
  lastName: string;
  role: 'inactive | sales | productionManager | inventoryAdministrator | admin';
}

export interface CreatedUser extends User, ICreationStamp {}
export interface PartialUser extends Partial<User>{}