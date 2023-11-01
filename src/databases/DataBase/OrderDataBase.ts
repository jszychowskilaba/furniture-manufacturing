import {
  CreatedOrder,
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

  async getAllOrderIds(): Promise<Array<{ id: string }>> {
    return (await pool.query('SELECT "id" FROM "manufactureOrder"')).rows;
  }

  async getOrderMaterials(
    orderId: string
  ): Promise<Array<{ id: string; quantity: number }>> {
    return (
      await pool.query(
        `SELECT "materialId" AS "id", "quantity" FROM "orderHasMaterial" WHERE "manufactureOrderId" = '${orderId}'`
      )
    ).rows;
  }
  async getOrder(orderId: string): Promise<CreatedOrder> {
    return (
      await pool.query(
        `SELECT * FROM "manufactureOrder" WHERE "id" = '${orderId}'`
      )
    ).rows[0];
  }
  async getOrderLabors(
    orderId: string
  ): Promise<Array<{ id: string; quantity: number }>> {
    return (
      await pool.query(
        `SELECT "laborId" AS "id", "quantity" FROM "orderHasLabor" WHERE "manufactureOrderId" = '${orderId}'`
      )
    ).rows;
  }

  async get<T>(tableName: string, dataId: string): Promise<T> {
    return (
      await pool.query(`SELECT * FROM "${tableName}" WHERE "id" = '${dataId}'`)
    ).rows[0];
  }

  async createTransaction(
    createdOrder: PartialCreatedOrder,
    orderHasLabor: orderHasLabor[],
    orderHasMaterial: orderHasMaterial[],
    unitsToManufacture: number
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
        const { stock, reservedStock } = (
          await client.query(
            `SELECT "stock", "reservedStock" FROM "material" WHERE "id" = '${item.materialId}'`
          )
        ).rows[0];
        const updatedValues = {
          stock: Number(stock) - item.quantity * unitsToManufacture,
          reservedStock:
            Number(reservedStock) + item.quantity * unitsToManufacture,
        };
        await client.query(
          queryCreator.update('material', updatedValues, 'id', item.materialId)
        );
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async produceTransaction(manufactureOrder: CreatedOrder, quantity: number) {
    const client = await pool.connect();

    await client.query('BEGIN');
    try {
      for (const material of manufactureOrder.materials) {
        await client.query(
          `UPDATE "material" SET "reservedStock" = "reservedStock" -  '${
            material.quantity * quantity
          }' WHERE "id" = '${material.id}'`
        );
      }

      await client.query(
        `UPDATE "manufactureOrder" SET "manufactured" = "manufactured" + '${quantity}' WHERE "id" = '${manufactureOrder.id}'`
      );
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      await client.query('COMMIT');
      client.release();
    }
  }
}

export default new OrderDataBase();
