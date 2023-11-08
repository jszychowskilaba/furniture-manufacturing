import { PartialCreatedUserDto } from '../dtos/user/PartialCreatedUserDto';
import { CreatedUserDto } from '../dtos/user/CreatedUserDto';
import { PartialUserDto } from '../dtos/user/PartialUserDto';
import { UserDto } from '../dtos/user/UserDto';
import { CreatedUser, PartialCreatedUser, PartialUser } from '../types/User';
import { CreationStamp } from './helpers/CreationStamp';
import userDataBase, { UserDataBase } from '../repositories/UserDataBase';
import { CustomError } from '../helpers/CustomError';
import { IService } from '../types/IService';
import { Crypto } from '../helpers/Crypto';

class UserServices
  implements IService<UserDto, CreatedUserDto, PartialUserDto>
{
  private userDataBase: UserDataBase;

  constructor(userDataBase: UserDataBase) {
    this.userDataBase = userDataBase;
  }

  async create(user: UserDto, username: string): Promise<CreatedUserDto> {
    if (await this.userDataBase.hasWith('username', user.username)) {
      throw new CustomError('Username already in use.', 409);
    }

    const createdData: CreatedUser = {
      ...new CreationStamp(username),
      ...user,
      ...new Crypto().createPassword(user.password as string),
    };

    await this.userDataBase.create(new CreatedUserDto(createdData));

    createdData.hashedPassword = '*';
    createdData.salt = '*';
    createdData.password = '*';

    return createdData;
  }

  async getAll(): Promise<CreatedUserDto[]> {
    const users: CreatedUserDto[] = await this.userDataBase.getAll();

    users.forEach((user) => {
      user.hashedPassword = '*';
      user.salt = '*';
    });
    return users;
  }

  async getOne(userId: string): Promise<CreatedUserDto> {
    const user: CreatedUserDto = await this.userDataBase.getOne(userId);

    if (!user) throw new CustomError('Data not found', 404);

    user.hashedPassword = '*';
    user.salt = '*';

    return user;
  }

  async update(
    userId: string,
    userChanges: PartialUser
  ): Promise<CreatedUserDto> {
    let newUserChanges: PartialCreatedUser = {};

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

    await this.userDataBase.update(
      userId,
      new PartialCreatedUserDto(newUserChanges)
    );

    return this.getOne(userId);
  }
}

export default new UserServices(userDataBase);
export { UserServices };
