/* eslint-disable @typescript-eslint/no-unused-vars */
import { error } from 'ajv/dist/vocabularies/applicator/dependencies';
import { CustomError } from '../../helpers/CustomError';
import { CreatedLabor } from '../../types/Labor';
import { CreatedMaterial } from '../../types/Material';
import {
  CreatedOrder,
  Order,
  orderHasLabor,
  orderHasMaterial,
  PartialCreatedOrder,
} from '../../types/Order';
import queryCreator from './helpers/QueryCreator';
import { pool } from './Pool';

class OrderDataBase {
  async getAllOrderResource(ids: string[], resource: string) {
    const values = Object.values(ids)
      .map((id) => `'${id}'`)
      .join(', ');
    const query = `SELECT * FROM "${resource}" WHERE "id" IN (${values})`;
    return (await pool.query(query)).rows;
  }

  async get<T>(tableName: string, dataId: string): Promise<T> {
    return (
      await pool.query(`SELECT * FROM "${tableName}" WHERE "id" = '${dataId}'`)
    ).rows[0];
  }

  async createTransaction(
    createdOrder: PartialCreatedOrder,
    orderHasLabor: orderHasLabor[],
    orderHasMaterial: orderHasMaterial[]
  ) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      await client.query(queryCreator.insert('manufactureOrder', createdOrder));

      for (const item of orderHasLabor) {
        await client.query(queryCreator.insert('orderHasLabor', item));
      }

      for (const item of orderHasMaterial) {
        await client.query(queryCreator.insert('orderHasMaterial', item));
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

export default new OrderDataBase();
