import {
  User,
  CreatedUser,
  PartialUser,
  PartialCreatedUser,
} from '../types/User';
import UserDataBase from '../databases/DataBase/UserDataBase';
import { ICRUDServices } from '../types/ICRUDServices';
import CRUDServices from './helpers/CRUDServices';
import { IService } from '../types/IService';
import { IDataBase } from '../types/IDataBase';
import { CustomError } from '../helpers/CustomError';
import { CreationStamp } from './helpers/CreationStamp';

class UserCRUDServices extends CRUDServices<
  User,
  CreatedUser,
  PartialUser,
  PartialCreatedUser
> {
  constructor(dataBase: IDataBase<CreatedUser, PartialCreatedUser>) {
    super(dataBase);
  }
  // Over writing method
  async create(
    data: CreatedUser,
    username: string,
    column: string,
    value: string
  ): Promise<CreatedUser> {
    console.log(column, value);
    if (await this.dataBase.hasWith(column, value)) {
      throw new CustomError('Data with same internal code already exists', 409);
    }

    const createdData = {
      ...new CreationStamp(username),
      ...data,
    } as CreatedUser;

    delete createdData.id;

    await this.dataBase.create(createdData);

    createdData.password = '*';

    return createdData;
  }
}

class UserServices implements IService<User, CreatedUser, PartialUser> {
  private crudServices: ICRUDServices<User, CreatedUser, PartialUser>;

  constructor() {
    this.crudServices = new UserCRUDServices(UserDataBase);
  }

  async create(user: User, username: string): Promise<CreatedUser> {
    return await this.crudServices.create(
      user,
      username,
      'username',
      user.username
    );
  }

  async getAll(): Promise<CreatedUser[]> {
    const users = await this.crudServices.getAll();
    users.forEach((user) => (user.password = '*'));
    return users;
  }

  async getOne(userId: string): Promise<CreatedUser> {
    const user = await this.crudServices.getOne(userId);
    user.password = '*';
    return user;
  }

  async update(userId: string, userChanges: PartialUser): Promise<CreatedUser> {
    return await this.crudServices.update(userId, userChanges);
  }
}

export default new UserServices();