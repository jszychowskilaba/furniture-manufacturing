import {
  CreatedOrder,
  Order,
  PartialCreatedOrder,
  PartialOrder,
} from '../types/Order';
import OrderDataBase from '../databases/DataBase/OrderDataBase';
import { CreatedMaterial } from '../types/Material';
import { CreatedLabor } from '../types/Labor';
import { CustomError } from '../helpers/CustomError';
import orderHelper from './helpers/OrderHelper';

class OrderServices {
  async createOrder(order: Order, username: string) {
    const materials = await orderHelper.getAll<CreatedMaterial>(
      'material',
      order.materials
    );
    const labors = await orderHelper.getAll<CreatedLabor>(
      'labor',
      order.labors
    );
    const totalPrice = orderHelper.calculateTotalPrice(
      materials,
      labors,
      order
    );
    const totalProductionTime = orderHelper.calculateTotalProductionTime(
      labors,
      order
    );

    await orderHelper.checkForMissingMaterials(order);

    const createdOrder = orderHelper.createOrderObject(
      order,
      totalPrice,
      totalProductionTime,
      username
    );

    const partialCreatedOrder = createdOrder as PartialCreatedOrder;

    delete partialCreatedOrder.materials;
    delete partialCreatedOrder.labors;

    const orderHasLabor = orderHelper.createOrderHasLaborTable(
      order.labors,
      createdOrder.id
    );

    const orderHasMaterial = orderHelper.createOrderHasMaterialTable(
      order.materials,
      createdOrder.id
    );

    await OrderDataBase.createOrder(
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

  async getAllOrders(): Promise<CreatedOrder[]> {
    const orderIds = await OrderDataBase.getAllOrderIds();
    const createdOrders = [];
    for (const orderId of orderIds) {
      createdOrders.push(await this.getOneOrder(orderId.id));
    }
    return createdOrders;
  }

  async updateOrder(
    orderChanges: PartialOrder,
    orderId: string
  ): Promise<CreatedOrder> {
    const oldOrder = await this.getOneOrder(orderId);

    //Updating order
    const updatedOrder: CreatedOrder = { ...oldOrder, ...orderChanges };
    updatedOrder.createdAt = new Date(updatedOrder.createdAt).toISOString();
    updatedOrder.updatedAt = new Date().toISOString();

    const materials = await orderHelper.getAll<CreatedMaterial>(
      'material',
      updatedOrder.materials
    );
    const labors = await orderHelper.getAll<CreatedLabor>(
      'labor',
      updatedOrder.labors
    );

    const totalPrice = orderHelper.calculateTotalPrice(
      materials,
      labors,
      updatedOrder
    );
    updatedOrder.totalPrice = totalPrice;

    const totalProductionTime = orderHelper.calculateTotalProductionTime(
      labors,
      updatedOrder
    );
    updatedOrder.totalProductionTime = totalProductionTime;

    await orderHelper.checkForMissingMaterials(updatedOrder);

    const orderHasLabor = orderHelper.createOrderHasLaborTable(
      updatedOrder.labors,
      updatedOrder.id,
      updatedOrder.createdAt
    );

    const orderHasMaterial = orderHelper.createOrderHasMaterialTable(
      updatedOrder.materials,
      updatedOrder.id,
      updatedOrder.createdAt
    );

    const partialUpdatedOrder = updatedOrder as PartialCreatedOrder;

    delete partialUpdatedOrder.materials;
    delete partialUpdatedOrder.labors;

    await OrderDataBase.updateOrder(
      oldOrder,
      partialUpdatedOrder,
      orderHasLabor,
      orderHasMaterial,
      updatedOrder.unitsToManufacture
    );

    return updatedOrder;
  }

  async manufactureOrder(quantity: number, orderId: string) {
    const manufactureOrder = await this.getOneOrder(orderId);
    if (manufactureOrder.status !== 'inProduction') {
      throw new CustomError(
        `Can not manufacture, order status: ${manufactureOrder.status}`,
        403
      );
    }

    await this.produce(manufactureOrder, quantity);
  }

  async produce(manufactureOrder: CreatedOrder, quantity: number) {
    const nextManufacturedTotal =
      Number(manufactureOrder.manufactured) + quantity;

    if (nextManufacturedTotal > Number(manufactureOrder.unitsToManufacture)) {
      throw new CustomError(
        `Exceeding quantity to manufacture by ${
          nextManufacturedTotal - Number(manufactureOrder.unitsToManufacture)
        }`,
        403
      );
    }
    await OrderDataBase.produce(manufactureOrder, quantity);
  }
}
export default new OrderServices();
