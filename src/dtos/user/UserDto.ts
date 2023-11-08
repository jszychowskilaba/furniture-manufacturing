import { User } from '../../types/User';

export class UserDto implements User {
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
  constructor(user: User) {
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.name = user.name;
    this.lastName = user.lastName;
    this.role = user.role;
  }
}
