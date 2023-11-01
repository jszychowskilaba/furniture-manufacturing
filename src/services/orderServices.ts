import { CreatedOrder, Order, PartialCreatedOrder } from '../types/Order';
import OrderDataBase from '../databases/DataBase/OrderDataBase';
import { CreatedMaterial } from '../types/Material';
import { CreatedLabor } from '../types/Labor';
import { CustomError } from '../helpers/CustomError';
import { CreationStamp } from './helpers/CreationStamp';

class OrderServices {
  async createOrder(order: Order, username: string) {
    const materials = await this.getAll<CreatedMaterial>(
      'material',
      order.materials
    );
    const labors = await this.getAll<CreatedLabor>('labor', order.labors);

    const totalPrice = this.calculateTotalPrice(materials, labors, order);

    const totalProductionTime = this.calculateTotalProductionTime(
      labors,
      order
    );

    const missingMaterials = await this.getMissingMaterials(order);

    if (missingMaterials.length)
      throw new CustomError(
        `There are not enough materials to process the order. ${JSON.stringify(
          missingMaterials
        )}`,
        422
      );

    const createdOrder: CreatedOrder = {
      ...new CreationStamp(username),
      ...order,
      manufactured: 0,
      totalPrice: totalPrice,
      totalProductionTime: totalProductionTime,
    };

    const partialCreatedOrder = createdOrder as PartialCreatedOrder;
    delete partialCreatedOrder.materials;
    delete partialCreatedOrder.labors;

    const orderHasLabor = order.labors.map((labor) => {
      return {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        manufactureOrderId: createdOrder.id,
        laborId: labor.id,
        quantity: labor.quantity,
      };
    });

    const orderHasMaterial = order.materials.map((material) => {
      return {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        manufactureOrderId: createdOrder.id,
        materialId: material.id,
        quantity: material.quantity,
      };
    });

    await OrderDataBase.createTransaction(
      partialCreatedOrder,
      orderHasLabor,
      orderHasMaterial,
      order.unitsToManufacture
    );

    return createdOrder;
  }

  async getOneOrder(orderId: string): Promise<CreatedOrder> {
    const order = await OrderDataBase.getOrder(orderId);
    if (!order) throw new CustomError('Order not found', 404);
    const materials = await OrderDataBase.getOrderMaterials(orderId);
    const labors = await OrderDataBase.getOrderLabors(orderId);

    const CreatedOrder = {
      ...order,
      materials: [...materials],
      labors: [...labors],
    };
    return CreatedOrder;
  }

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

  async getMissingMaterials(order: Order) {
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

    return missingMaterials;
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
}
export default new OrderServices();
