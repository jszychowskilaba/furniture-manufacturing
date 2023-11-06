import { IDataBase } from '../types/IDataBase';
import { CreatedUser, PartialCreatedUser } from '../dto/User';
import { CRUDODataBase } from './helpers/CRUDODataBase';

class UserDataBase implements IDataBase<CreatedUser, PartialCreatedUser> {
  private operations: CRUDODataBase<CreatedUser>;
  constructor() {
    this.operations = new CRUDODataBase('appUser', 'username');
  }

  async create(user: CreatedUser): Promise<void> {
    await this.operations.create(user);
  }

  async hasWith(column: string, value: string): Promise<boolean> {
    return await this.operations.hasWith(column, value);
  }

  async getAll(): Promise<CreatedUser[]> {
    return await this.operations.getAll();
  }

  async getOne(userId: string): Promise<CreatedUser> {
    return await this.operations.getOne(userId);
  }

  async update(userId: string, userUpdates: PartialCreatedUser): Promise<void> {
    await this.operations.update(userId, userUpdates);
  }
}

export default new UserDataBase();
