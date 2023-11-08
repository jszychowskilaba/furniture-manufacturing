import { CreatedUser } from '../../types/User';

export class CreatedUserDto {
  username: string;
  email: string;
  name: string;
  lastName: string;
  role:
    | 'inactive'
    | 'sales'
    | 'productionManager'
    | 'inventoryAdministrator'
    | 'admin';
  hashedPassword: string;
  salt: string;
  createdAt: string | Date;
  updatedAt: string;
  constructor(user: CreatedUser) {
    this.username = user.username;
    this.email = user.email;
    this.name = user.name;
    this.lastName = user.lastName;
    this.role = user.role;
    this.hashedPassword = user.hashedPassword;
    this.salt = user.salt;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
