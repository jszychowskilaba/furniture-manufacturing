import queryCreator from './QueryCreator';
import { pool } from '../../databases/DataBase/Pool';

interface ICRUDODataBase<T> {
  create(data: T): Promise<void>;
  hasWith(column: string, value: string): Promise<boolean>;
  hasWith(column: string, value: string): Promise<boolean>;
  getAll(): Promise<T[]>;
  getOne(dataId: string): Promise<T>;
  update(
    dataId: string,
    dataUpdates: { [key: string]: unknown }
  ): Promise<void>;
}

class CRUDODataBase<T extends object> implements ICRUDODataBase<T> {
  private tableName: string;
  private primaryKeyColumnName: string;

  constructor(tableName: string, primaryKeyColumnName: string) {
    this.tableName = tableName;
    this.primaryKeyColumnName = primaryKeyColumnName;
  }

  /**
   * Stores a created data in the database
   * @param data The data
   */
  async create(data: T): Promise<void> {
    const query = queryCreator.insert(this.tableName, data);
    await pool.query(query);
  }

  /**
   * Check if a data exist given a column and a value
   * @param column  The column
   * @param value The value
   * @returns <true> if data exists | <false> if data does not exists
   */
  async hasWith(column: string, value: string): Promise<boolean> {
    const query = queryCreator.selectByTableColumnValue(
      this.tableName,
      column,
      value
    );
    const result = await pool.query(query);
    return !(result.rows[0] === undefined);
  }

  /**
   * Get all data from the table
   * @returns The data
   */
  async getAll(): Promise<T[]> {
    const query = queryCreator.selectByColumn(this.tableName, '*');
    return (await pool.query(query)).rows;
  }

  /**
   * Get one data from database
   * @param dataId The data id
   * @returns The data
   */
  async getOne(dataId: string): Promise<T> {
    const query = queryCreator.selectByTableColumnValue(
      this.tableName,
      this.primaryKeyColumnName,
      dataId
    );
    return (await pool.query(query)).rows[0];
  }

  /**
   * Update a data in the database
   * @param dataId The data to update
   * @param dataUpdates The object that contains the updates
   */
  async update(
    dataId: string,
    dataUpdates: { [key: string]: unknown }
  ): Promise<void> {
    const query = queryCreator.update(
      this.tableName,
      dataUpdates,
      this.primaryKeyColumnName,
      dataId
    );
    await pool.query(query);
  }
}

export { CRUDODataBase };
