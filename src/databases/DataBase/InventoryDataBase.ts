import { createSelectByQuery } from './helpers/createSelectByQuery';
import { createInsertQuery } from './helpers/createInsertQuery';
import { CreatedMaterial } from '../../types/Material';
import { pool } from './Pool';

class InventoryDataBase {
  private tableName: string;
  constructor() {
    this.tableName = 'material';
  }
  async createMaterial(material: CreatedMaterial): Promise<void> {
    const query = createInsertQuery(this.tableName, material);
    await pool.query(query);
  }

  async hasMaterialWith(column: string, value: string): Promise<boolean> {
    const result = await pool.query(
      createSelectByQuery(this.tableName, column),
      [value]
    );
    return !(result.rows[0] === undefined);
  }
}

export default new InventoryDataBase();
