import { CustomError } from '../../helpers/CustomError';
import { IDataBase } from '../../types/IDataBase';
import { CreationStamp } from './CreationStamp';
import { UpdateStamp } from './UpdateStamp';

interface ICRUDServices<T, CreatedT, PartialT> {
  create(
    data: T,
    username: string,
    column: string,
    value: string
  ): Promise<CreatedT>;
  getAll(): Promise<CreatedT[]>;
  getOne(dataId: string): Promise<CreatedT>;
  update(dataId: string, dataChanges: PartialT): Promise<CreatedT>;
}

class CRUDServices<T, CreatedT, PartialT, PartialCreatedT>
  implements ICRUDServices<T, CreatedT, PartialT>
{
  public dataBase: IDataBase<CreatedT, PartialCreatedT>;
  constructor(dataBase: IDataBase<CreatedT, PartialCreatedT>) {
    this.dataBase = dataBase;
  }

  /**
   * Adds a creation stamp to received data and stores the data
   * in the data base. Before adding the data, it checks if the
   * there is no previous data with the column value sent.
   * @param data The data
   * @param username The user name to add to creation stamp
   * @param column The column for checking if data already exists
   * @param value The value for checking if the data already exists
   * @returns
   */
  async create(
    data: T,
    username: string,
    column: string,
    value: string
  ): Promise<CreatedT> {
    if (await this.dataBase.hasWith(column, value)) {
      throw new CustomError('Data with same internal code already exists', 409);
    }

    const createdData = {
      ...new CreationStamp(username),
      ...data,
    } as CreatedT;

    await this.dataBase.create(createdData);

    return createdData;
  }

  /**
   * Get all stored data in the database
   * @returns The data
   */
  async getAll(): Promise<CreatedT[]> {
    const allData = await this.dataBase.getAll();
    return allData;
  }

  /**
   * Get one data from the database given a data Id
   * @param dataId The data Id
   * @returns The data
   */
  async getOne(dataId: string): Promise<CreatedT> {
    const data = await this.dataBase.getOne(dataId);

    if (!data) throw new CustomError('Data not found', 404);

    return data;
  }

  /**
   * Updates data in database given a object with updates.
   * @param dataId The data Id to update
   * @param dataChanges The object with updates
   * @returns The updated data
   */
  async update(dataId: string, dataChanges: PartialT): Promise<CreatedT> {
    await this.getOne(dataId); // Throws error if data not exists

    const dataUpdates = {
      ...dataChanges,
      ...new UpdateStamp(),
    } as PartialCreatedT;

    await this.dataBase.update(dataId, dataUpdates);
    return this.getOne(dataId);
  }
}

export default CRUDServices;
