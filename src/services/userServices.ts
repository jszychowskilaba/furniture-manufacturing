import { User, PartialUser, CreatedUser } from '../types/User';
import { CreationStamp } from './helpers/CreationStamp';
import userDataBase from '../repositories/UserDataBase';
import { CustomError } from '../helpers/CustomError';
import { PartialCreatedUser } from '../types/User';
import { IService } from '../types/IService';
import { Crypto } from '../helpers/Crypto';
import { CreatedUserDto } from '../dtos/user/CreatedUserDto';

class UserServices implements IService<User, CreatedUserDto, PartialUser> {
  async create(user: User, username: string): Promise<CreatedUser> {
    if (await userDataBase.hasWith('username', user.username)) {
      throw new CustomError('Username already in use.', 409);
    }

    const createdData = {
      ...new CreationStamp(username),
      ...user,
      ...new Crypto().createPassword(user.password as string),
    } as CreatedUser;

    await userDataBase.create(new CreatedUserDto(createdData));

    createdData.hashedPassword = '*';
    createdData.salt = '*';
    createdData.password = '*';

    return createdData;
  }

  async getAll(): Promise<CreatedUserDto[]> {
    const users = await userDataBase.getAll();
    users.forEach((user) => {
      user.hashedPassword = '*';
      user.salt = '*';
    });
    return users;
  }

  async getOne(userId: string): Promise<CreatedUserDto> {
    const user = await userDataBase.getOne(userId);

    if (!user) throw new CustomError('Data not found', 404);

    user.hashedPassword = '*';
    user.salt = '*';

    return user;
  }

  async update(
    userId: string,
    userChanges: PartialUser
  ): Promise<CreatedUserDto> {
    let newUserChanges = {};

    if (userChanges.password) {
      const password = userChanges.password;
      delete userChanges.password;

      newUserChanges = {
        ...userChanges,
        ...new Crypto().createPassword(password),
      };
    } else {
      newUserChanges = {
        ...userChanges,
      };
    }

    await userDataBase.update(userId, newUserChanges);

    return this.getOne(userId);
  }
}

export default new UserServices();
