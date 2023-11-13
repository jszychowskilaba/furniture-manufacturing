import { CreatedUserDto } from '../dtos/user/CreatedUserDto';
import { PartialCreatedUser } from '../types/User';
import queryCreator from './helpers/QueryCreator';
import { pool } from '../databases/DataBase/Pool';
import { IDataBase } from '../types/IDataBase';
import { CustomError } from '../helpers/CustomError';

class UserDataBase implements IDataBase<CreatedUserDto, PartialCreatedUser> {
  private tableName: string;
  constructor() {
    this.tableName = 'appUser';
  }

  async create(user: CreatedUserDto): Promise<void> {
    const query = queryCreator.insert(this.tableName, user);

    await pool.query(query);
  }

  async hasWith(column: string, value: string): Promise<boolean> {
    const query = queryCreator.selectByTableColumnValue(
      this.tableName,
      column,
      value
    );
    const result = await pool.query(query);

    return !(result.rows[0] === undefined);
  }

  async getAll(): Promise<CreatedUserDto[]> {
    const query = queryCreator.selectByColumn(this.tableName, '*');
    const users = (await pool.query(query)).rows.map(
      (user) => new CreatedUserDto(user)
    );

    return users;
  }

  async getByQuery(queryParams: object): Promise<CreatedUserDto[]> {
    const query = queryCreator.selectByQueryParams(this.tableName, queryParams);

    const filteredMaterials = (await pool.query(query)).rows.map(
      (filteredMaterial) => new CreatedUserDto(filteredMaterial)
    );

    return filteredMaterials;
  }

  async getOne(userId: string): Promise<CreatedUserDto> {
    const query = queryCreator.selectByTableColumnValue(
      this.tableName,
      'username',
      userId
    );

    const user = (await pool.query(query)).rows[0];
    if (!user) throw new CustomError('User not found', 404);

    return new CreatedUserDto(user);
  }

  async update(userId: string, userUpdates: PartialCreatedUser): Promise<void> {
    const query = queryCreator.update(
      this.tableName,
      userUpdates,
      'username',
      userId
    );

    await pool.query(query);
  }
}

export default new UserDataBase();
export { UserDataBase };
