import { selectByTableColumnValueQuery } from './helpers/selectByQuery';
import { selectByRowQuery } from './helpers/selectByRowQuery';
import { CreatedMaterial } from '../../types/Material';
import { insertQuery } from './helpers/insertQuery';
import { pool } from './Pool';

class InventoryDataBase {
  private tableName: string;
  constructor() {
    this.tableName = 'material';
  }
  /**
   * Stores a created material in the database
   * @param material The material
   */
  async createMaterial(material: CreatedMaterial): Promise<void> {
    const query = insertQuery(this.tableName, material);
    await pool.query(query);
  }

  async hasMaterialWith(column: string, value: string): Promise<boolean> {
    const result = await pool.query(
      selectByTableColumnValueQuery(this.tableName, column, value)
    );
    return !(result.rows[0] === undefined);
  }

  /**
   * Get all materials from database
   * @returns The materials
   */
  async getAllMaterials(): Promise<CreatedMaterial[]> {
    const query = selectByRowQuery(this.tableName, '*');
    return (await pool.query(query)).rows;
  }
}

export default new InventoryDataBase();
