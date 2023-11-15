import { CreatedMaterialDto } from '../../dtos/inventory/CreatedMaterialDto';
import { CreatedOrderDto } from '../../dtos/order/CreatedOrderDto';
import OrderDataBase from '../../repositories/OrderDataBase';
import { CustomError } from '../../helpers/CustomError';
import { CreatedMaterial } from '../../types/Material';
import { CreatedLabor } from '../../types/Labor';
import { Order } from '../../types/Order';
import { CreationStamp } from './CreationStamp';


class OrderHelper {
  async getAll<T>(
    tableName: string,
    orderData: Array<{ id: string; quantity: number }>
  ): Promise<T[]> {
    const allData = [];
    const unStoredResources = [];

    for (const data of orderData) {
      const storedData = await OrderDataBase.get<T>(tableName, data.id);
      if (!storedData)
        unStoredResources.push({ id: data.id, resource: tableName });

      if (unStoredResources.length)
        throw new CustomError(
          `These resources are not stored in the db. ${JSON.stringify(
            unStoredResources
          )}`,
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
  ): number {
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

  checkForMissingMaterials(
    orderMaterials: CreatedMaterialDto[],
    order: Order
  ): void {
    const missingMaterials = [];

    for (const orderMaterial of order.materials) {
      const inventoryMaterial = orderMaterials.find(
        (material) => orderMaterial.id == material.id
      );

      if (!inventoryMaterial)
        throw new CustomError(`Material id${orderMaterial.id} not found.`, 404);

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
  ): CreatedOrderDto {
    const createdOrder = new CreatedOrderDto({
      ...new CreationStamp(username),
      ...order,
      manufactured: 0,
      totalPrice: totalPrice,
      totalProductionTime: totalProductionTime,
    });

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

  checkForInactiveResource(
    materials: CreatedMaterial[],
    labors: CreatedLabor[]
  ): void {
    const checkForInactiveResources = [];

    for (const material of materials) {
      if (material.status == 'inactive')
        checkForInactiveResources.push(material.id);
    }

    for (const labor of labors) {
      if (labor.status == 'inactive') checkForInactiveResources.push(labor.id);
    }

    if (checkForInactiveResources.length > 0)
      throw new CustomError(
        `Can not proceed. These resource IDs are inactive: ${JSON.stringify(
          checkForInactiveResources
        )}`,
        422
      );
  }
}

export default new OrderHelper();
