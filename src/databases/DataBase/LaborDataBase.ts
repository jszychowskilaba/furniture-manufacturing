import { CreatedLabor, PartialCreatedLabor } from '../../types/Labor';
import { selectByTableColumnValueQuery } from './helpers/selectByQuery';
import { selectByRowQuery } from './helpers/selectByRowQuery';
import { insertQuery } from './helpers/insertQuery';
import { updateQuery } from './helpers/updateQuery';
import { pool } from './Pool';

class InventoryDataBase {
  private tableName: string;
  constructor() {
    this.tableName = 'labor';
  }
  /**
   * Stores a created labor in the database
   * @param labor The labor
   */
  async createLabor(labor: CreatedLabor): Promise<void> {
    const query = insertQuery(this.tableName, labor);
    await pool.query(query);
  }

  /**
   * Check if a labor exist given a column and a value
   * @param column  The column
   * @param value The value
   * @returns <true> if labor exists | <false> if labor does not exists
   */
  async hasLaborWith(column: string, value: string): Promise<boolean> {
    const result = await pool.query(
      selectByTableColumnValueQuery(this.tableName, column, value)
    );
    return !(result.rows[0] === undefined);
  }

  /**
   * Get all labors from database
   * @returns The labors
   */
  async getAllLabors(): Promise<CreatedLabor[]> {
    const query = selectByRowQuery(this.tableName, '*');
    return (await pool.query(query)).rows;
  }

  /**
   * Get one labor from database
   * @param laborId The labor id
   * @returns The labor
   */
  async getOneLabor(laborId: string): Promise<CreatedLabor> {
    const query = selectByTableColumnValueQuery(
      this.tableName,
      'id',
      laborId
    );
    return (await pool.query(query)).rows[0];
  }

  /**
   * Update a labor in the database
   * @param laborId The labor to update
   * @param laborUpdates The object that contains the updates
   */
  async updateLabor(
    laborId: string,
    laborUpdates: PartialCreatedLabor
  ): Promise<void> {
    const query = updateQuery(
      this.tableName,
      laborUpdates,
      'id',
      laborId
    );
    await pool.query(query);
  }
}

export default new InventoryDataBase();
