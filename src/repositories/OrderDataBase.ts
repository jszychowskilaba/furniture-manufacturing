import { CreatedOrder, PartialCreatedOrder } from '../types/Order';
import { orderHasLabor, orderHasMaterial } from '../types/Order';
import queryCreator from './helpers/QueryCreator';
import { pool } from '../databases/DataBase/Pool';
import { PoolClient } from 'pg';

class OrderDataBase {
  async getAllOrderIds(): Promise<Array<{ id: string }>> {
    return (await pool.query('SELECT "id" FROM "manufactureOrder"')).rows;
  }

  async getOrderIdsByQuery(
    queryParams: object
  ): Promise<Array<{ id: string }>> {
    const query = queryCreator.selectByQueryParams(
      'manufactureOrder',
      queryParams,
      'id'
    );
    return (await pool.query(query)).rows;
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

  async createOrder(
    createdOrder: PartialCreatedOrder,
    orderHasLabor: orderHasLabor[],
    orderHasMaterial: orderHasMaterial[],
    unitsToManufacture: number
  ) {
    const client = await pool.connect();

    try {
      client.query('BEGIN');

      await this.createTransaction(
        createdOrder,
        orderHasLabor,
        orderHasMaterial,
        unitsToManufacture,
        client
      );
    } catch (error) {
      client.query('ROLLBACK');
      throw error;
    } finally {
      await client.query('COMMIT');
      client.release();
    }
  }

  async createTransaction(
    createdOrder: PartialCreatedOrder,
    orderHasLabor: orderHasLabor[],
    orderHasMaterial: orderHasMaterial[],
    unitsToManufacture: number,
    client: PoolClient
  ) {
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
  }

  async updateOrder(
    oldOrder: CreatedOrder,
    createdOrder: PartialCreatedOrder,
    orderHasLabor: orderHasLabor[],
    orderHasMaterial: orderHasMaterial[],
    unitsToManufacture: number
  ) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await this.restoreMaterials(oldOrder, client);
      await this.restoreLabors(oldOrder, client);
      await client.query(
        `DELETE FROM "manufactureOrder" WHERE "id" = '${oldOrder.id}'`
      );
      await this.createTransaction(
        createdOrder,
        orderHasLabor,
        orderHasMaterial,
        unitsToManufacture,
        client
      );
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async restoreMaterials(oldOrder: CreatedOrder, client: PoolClient) {
    // returning oldOrder materials and deleting them

    for (const material of oldOrder.materials) {
      await client.query(
        `DELETE FROM "orderHasMaterial" WHERE "materialId" = '${material.id}' AND "manufactureOrderId" = '${oldOrder.id}' `
      );

      const pendingQuantity =
        (Number(oldOrder.unitsToManufacture) - Number(oldOrder.manufactured)) *
        Number(material.quantity);

      await client.query(
        `UPDATE "material" SET "reservedStock" = "reservedStock" - '${pendingQuantity}' WHERE "id" = '${material.id}' `
      );

      await client.query(
        `UPDATE "material" SET "stock" = "stock" + '${pendingQuantity}' WHERE "id" = '${material.id}' `
      );
    }
  }

  async restoreLabors(oldOrder: CreatedOrder, client: PoolClient) {
    for (const labor of oldOrder.labors) {
      await client.query(
        `DELETE FROM "orderHasLabor" WHERE "laborId" = '${labor.id}' AND "manufactureOrderId" = '${oldOrder.id}' `
      );
    }
  }

  async produce(manufactureOrder: CreatedOrder, quantity: number) {
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

      if (
        manufactureOrder.manufactured + quantity ==
        manufactureOrder.unitsToManufacture
      ) {
        await client.query(
          `UPDATE "manufactureOrder" SET "status" = 'finished' WHERE "id" = '${manufactureOrder.id}'`
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
export { OrderDataBase };
