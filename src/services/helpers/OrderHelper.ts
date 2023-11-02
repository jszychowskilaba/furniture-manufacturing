import { CustomError } from '../../helpers/CustomError';
import OrderDataBase from '../../repositories/OrderDataBase';
import { CreatedMaterial } from '../../types/Material';
import { CreatedLabor } from '../../types/Labor';
import { CreatedOrder, Order } from '../../types/Order';
import { CreationStamp } from './CreationStamp';

class OrderHelper {
  async getAll<T>(
    tableName: string,
    orderData: Array<{ id: string; quantity: number }>
  ): Promise<T[]> {
    const allData = [];

    for (const data of orderData) {
      const storedData = await OrderDataBase.get<T>(tableName, data.id);
      if (!storedData)
        throw new CustomError(
          `Data id: ${data.id} is not stored in ${tableName}.`,
          404
        );

      allData.push(storedData);
    }
    return allData;
  }

  calculateTotalPrice(
    materials: CreatedMaterial[],
    labors: CreatedLabor[],
    order: Order
  ) {
    const laborPriceArray = labors.map((labor) => {
      return { id: labor.id, pricePerUnit: Number(labor.pricePerUnit) };
    });

    const materialPriceArray = materials.map((material) => {
      return {
        id: material.id,
        pricePerUnit: Number(material.pricePerUnit),
      };
    });

    const totalLaborPrice = this.calculatePrice(
      laborPriceArray,
      order.labors,
      order.unitsToManufacture
    );

    const totalMaterialPrice = this.calculatePrice(
      materialPriceArray,
      order.materials,
      order.unitsToManufacture
    );
    return totalLaborPrice + totalMaterialPrice;
  }

  calculatePrice(
    priceArray: Array<{ id: string; pricePerUnit: number }>,
    quantityArray: Array<{ id: string; quantity: number }>,
    unitsToManufacture: number
  ): number {
    const priceMap = new Map();
    for (const el of priceArray) {
      priceMap.set(el.id, Number(el.pricePerUnit));
    }

    let totalPrice = 0;

    for (const item of quantityArray) {
      totalPrice += priceMap.get(item.id) * item.quantity;
    }

    return totalPrice * unitsToManufacture;
  }

  calculateTotalProductionTime(labors: CreatedLabor[], order: Order): number {
    const timeArray = labors.map((labor) => {
      return { id: labor.id, timePerUnit: Number(labor.timePerUnit) };
    });

    const timeMap = new Map();
    for (const el of timeArray) {
      timeMap.set(el.id, el.timePerUnit);
    }
    let totalTime = 0;

    for (const item of order.labors) {
      totalTime += timeMap.get(item.id) * item.quantity;
    }
    return totalTime * order.unitsToManufacture;
  }

  async checkForMissingMaterials(order: Order) {
    const missingMaterials = [];

    for (const orderMaterial of order.materials) {
      const inventoryMaterial = await OrderDataBase.get<CreatedMaterial>(
        'material',
        orderMaterial.id
      );

      const materialToUse = orderMaterial.quantity * order.unitsToManufacture;

      if (materialToUse > inventoryMaterial.stock) {
        missingMaterials.push({
          id: inventoryMaterial.id,
          missingQuantities: materialToUse - inventoryMaterial.stock,
          purchaseTime: inventoryMaterial.purchaseTime,
        });
      }
    }

    if (missingMaterials.length)
      throw new CustomError(
        `There are not enough materials to process the order. ${JSON.stringify(
          missingMaterials
        )}`,
        422
      );
  }

  createOrderObject(
    order: Order,
    totalPrice: number,
    totalProductionTime: number,
    username: string
  ): CreatedOrder {
    const createdOrder: CreatedOrder = {
      ...new CreationStamp(username),
      ...order,
      manufactured: 0,
      totalPrice: totalPrice,
      totalProductionTime: totalProductionTime,
    };

    return createdOrder;
  }

  createOrderHasLaborTable(
    labors: Array<{ id: string; quantity: number }>,
    orderId: string,
    createdAt: string | null = null
  ) {
    return labors.map((labor) => {
      return {
        createdAt: createdAt ? createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        manufactureOrderId: orderId,
        laborId: labor.id,
        quantity: labor.quantity,
      };
    });
  }

  createOrderHasMaterialTable(
    materials: Array<{ id: string; quantity: number }>,
    orderId: string,
    createdAt: string | null = null
  ) {
    return materials.map((material) => {
      return {
        createdAt: createdAt ? createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        manufactureOrderId: orderId,
        materialId: material.id,
        quantity: material.quantity,
      };
    });
  }
}

export default new OrderHelper();
