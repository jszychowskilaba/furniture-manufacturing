import { CustomError } from '../../helpers/CustomError';
import { DataBase } from '../../types/DataBase';
import { CreationStamp } from './CreationStamp';
import { UpdateStamp } from './UpdateStamp';

class CRUDServices<T, CreatedT, PartialT, PartialCreatedT> {
  private dataBase: DataBase<CreatedT, PartialCreatedT>;
  constructor(dataBase: DataBase<CreatedT, PartialCreatedT>) {
    this.dataBase = dataBase;
  }

  /**
   * Creates a new data and stores it in database
   * @param data The data to create
   * @param username The user data creator username
   * @returns The created data
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
