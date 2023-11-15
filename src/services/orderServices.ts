import { PartialCreatedOrderDto } from '../dtos/order/PartialCreatedOrderDto';
import { CreatedMaterialDto } from '../dtos/inventory/CreatedMaterialDto';
import { OrderHasMaterialDto } from '../dtos/order/OrderHasMaterialDto';
import { OrderHasLaborDto } from '../dtos/order/OrderHasLaborDto';
import { CreatedLaborDto } from '../dtos/labor/CreatedLaborDto';
import { CreatedOrderDto } from '../dtos/order/CreatedOrderDto';
import { OrderDto } from '../dtos/order/OrderDto';

import orderDataBase, { OrderDataBase } from '../repositories/OrderDataBase';
import { CustomError } from '../helpers/CustomError';
import orderHelper from './helpers/OrderHelper';
import { CreatedOrder, PartialOrder } from '../types/Order';

class OrderServices {
  private orderDataBase: OrderDataBase;

  constructor(orderDataBase: OrderDataBase) {
    this.orderDataBase = orderDataBase;
  }

  async createOrder(order: OrderDto, username: string) {
    const materials: CreatedMaterialDto[] =
      await orderHelper.getAll<CreatedMaterialDto>('material', order.materials);

    const labors: CreatedLaborDto[] = await orderHelper.getAll<CreatedLaborDto>(
      'labor',
      order.labors
    );

    orderHelper.checkForInactiveResource(materials, labors);

    const totalPrice: number = orderHelper.calculateTotalPrice(
      materials,
      labors,
      order
    );

    const totalProductionTime: number =
      orderHelper.calculateTotalProductionTime(labors, order);

    orderHelper.checkForMissingMaterials(materials, order);

    const createdOrder: CreatedOrderDto = orderHelper.createOrderObject(
      order,
      totalPrice,
      totalProductionTime,
      username
    );

    const orderHasLabor = orderHelper.createOrderHasLaborTable(
      order.labors,
      createdOrder.id
    );

    const orderHasMaterial = orderHelper.createOrderHasMaterialTable(
      order.materials,
      createdOrder.id
    );

    await this.orderDataBase.createOrder(
      new PartialCreatedOrderDto(createdOrder),
      orderHasLabor.map((el) => new OrderHasLaborDto(el)),
      orderHasMaterial.map((el) => new OrderHasMaterialDto(el)),
      order.unitsToManufacture
    );

    return this.getOneOrder(createdOrder.id);
  }

  async getOneOrder(orderId: string): Promise<CreatedOrderDto> {
    const order: CreatedOrder = await this.orderDataBase.getOrder(orderId);

    if (!order) throw new CustomError('Order not found', 404);

    const materials = await this.orderDataBase.getOrderMaterials(orderId);
    const labors = await this.orderDataBase.getOrderLabors(orderId);

    const createdOrderDto = new CreatedOrderDto({
      ...order,
      materials: [...materials],
      labors: [...labors],
    });

    return createdOrderDto;
  }

  async getAllOrders(): Promise<CreatedOrderDto[]> {
    const orderIds = await this.orderDataBase.getAllOrderIds();
    const createdOrders: CreatedOrderDto[] = [];

    for (const orderId of orderIds) {
      createdOrders.push(await this.getOneOrder(orderId.id));
    }

    return createdOrders;
  }

  async getAllOrdersByQuery(queryParams: object): Promise<CreatedOrderDto[]> {
    const orderIds = await this.orderDataBase.getOrderIdsByQuery(queryParams);
    const createdOrders: CreatedOrderDto[] = [];

    for (const orderId of orderIds) {
      createdOrders.push(await this.getOneOrder(orderId.id));
    }

    return createdOrders;
  }

  async updateOrder(
    orderChanges: PartialOrder,
    orderId: string
  ): Promise<CreatedOrderDto> {
    const oldOrder = await this.getOneOrder(orderId);

    if (orderChanges.status == 'canceled') {
      // If we cancel the order, we return the materials to recover the stock.
      orderChanges.materials = [];
      orderChanges.labors = [];
    }

    if (orderChanges.status != 'canceled' && oldOrder.manufactured != 0)
      throw new CustomError(
        'Can not update a order with manufactured units. Try canceling order and creating a new one.',
        403
      );

    //Updating order
    const updatedOrder: CreatedOrder = { ...oldOrder, ...orderChanges };

    updatedOrder.createdAt = new Date(updatedOrder.createdAt).toISOString();
    updatedOrder.updatedAt = new Date().toISOString();

    const materials: CreatedMaterialDto[] =
      await orderHelper.getAll<CreatedMaterialDto>(
        'material',
        updatedOrder.materials
      );

    const labors: CreatedLaborDto[] = await orderHelper.getAll<CreatedLaborDto>(
      'labor',
      updatedOrder.labors
    );

    orderHelper.checkForInactiveResource(materials, labors);

    const totalPrice: number = orderHelper.calculateTotalPrice(
      materials,
      labors,
      updatedOrder
    );

    updatedOrder.totalPrice = totalPrice;

    const totalProductionTime: number =
      orderHelper.calculateTotalProductionTime(labors, updatedOrder);

    updatedOrder.totalProductionTime = totalProductionTime;

    await orderHelper.checkForMissingMaterials(materials, updatedOrder);

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

    await this.orderDataBase.updateOrder(
      new CreatedOrderDto(oldOrder),
      new PartialCreatedOrderDto(updatedOrder),
      orderHasLabor.map((el) => new OrderHasLaborDto(el)),
      orderHasMaterial.map((el) => new OrderHasMaterialDto(el)),
      updatedOrder.unitsToManufacture
    );

    return this.getOneOrder(oldOrder.id);
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

  async produce(manufactureOrder: CreatedOrderDto, quantity: number) {
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
    await this.orderDataBase.produce(manufactureOrder, quantity);
  }
}
export default new OrderServices(orderDataBase);
export { OrderServices };
