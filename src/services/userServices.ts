import { CreationStamp } from './helpers/CreationStamp';
import UserDataBase from '../repositories/UserDataBase';
import { ICRUDServices } from '../types/ICRUDServices';
import { CustomError } from '../helpers/CustomError';
import CRUDServices from './helpers/CRUDServices';
import { Crypto } from '../helpers/Crypto';

import { PartialCreatedUser } from '../types/User';
import { IDataBase } from '../types/IDataBase';
import { IService } from '../types/IService';
import { CreatedUser } from '../types/User';
import { PartialUser } from '../types/User';
import { User } from '../types/User';

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
    if (await this.dataBase.hasWith(column, value)) {
      throw new CustomError('Data with same internal code already exists', 409);
    }

    const createdData = {
      ...new CreationStamp(username),
      ...data,
      ...new Crypto().createPassword(data.password as string),
    } as CreatedUser;

    delete (createdData as PartialCreatedUser).id;
    delete (createdData as PartialCreatedUser).password;

    await this.dataBase.create(createdData);

    createdData.hashedPassword = '*';
    createdData.salt = '*';

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
    users.forEach((user) => {
      user.hashedPassword = '*';
      user.salt = '*';
    });
    return users;
  }

  async getOne(userId: string): Promise<CreatedUser> {
    const user = await this.crudServices.getOne(userId);
    user.password = '*';
    return user;
  }

  async update(userId: string, userChanges: PartialUser): Promise<CreatedUser> {
    let newUserChanges = {};
    if (userChanges.password) {
      const password = userChanges.password;
      delete userChanges.password;
      newUserChanges = {
        ...userChanges,
        ...new Crypto().createPassword(password),
      };
    }
    const updatedUser = await this.crudServices.update(userId, newUserChanges);
    updatedUser.hashedPassword = '*';
    updatedUser.salt = '*';
    return updatedUser;
  }
}

export default new UserServices();
