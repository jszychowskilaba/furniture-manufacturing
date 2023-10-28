import { CreatedMaterial, PartialCreatedMaterial } from '../../types/Material';
import { selectByTableColumnValueQuery } from './helpers/selectByQuery';
import { selectByRowQuery } from './helpers/selectByRowQuery';
import { insertQuery } from './helpers/insertQuery';
import { updateQuery } from './helpers/updateQuery';
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

  /**
   * Check if a material exist given a column and a value
   * @param column  The column
   * @param value The value
   * @returns <true> if material exists | <false> if material does not exists
   */
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

  /**
   * Get one material from database
   * @param materialId The material id
   * @returns The material
   */
  async getOneMaterial(materialId: string): Promise<CreatedMaterial> {
    const query = selectByTableColumnValueQuery(
      this.tableName,
      'id',
      materialId
    );
    return (await pool.query(query)).rows[0];
  }

  /**
   * Update a material in the database
   * @param materialId The material to update
   * @param materialUpdates The object that contains the updates
   */
  async updateMaterial(
    materialId: string,
    materialUpdates: PartialCreatedMaterial
  ): Promise<void> {
    const query = updateQuery(
      this.tableName,
      materialUpdates,
      'id',
      materialId
    );
    await pool.query(query);
  }
}

export default new InventoryDataBase();
