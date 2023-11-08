import { PartialCreatedOrder, CreatedOrder } from '../../types/Order';

export class PartialCreatedOrderDto implements PartialCreatedOrder {
  manufactured: number;
  totalPrice: number;
  totalProductionTime: number;
  status: 'pending' | 'inProduction' | 'finished' | 'canceled';
  internalCode: string;
  description: string;
  unitsToManufacture: number;
  internalNotes: string;
  createdAt: string | Date;
  updatedAt: string;
  id: string;
  username: string;

  constructor(createdOrder: CreatedOrder) {
    this.manufactured = createdOrder.manufactured;
    this.totalPrice = createdOrder.totalPrice;
    this.totalProductionTime = createdOrder.totalProductionTime;
    this.status = createdOrder.status;
    this.internalCode = createdOrder.internalCode;
    this.description = createdOrder.description;
    this.unitsToManufacture = createdOrder.unitsToManufacture;
    this.internalNotes = createdOrder.internalNotes;
    this.createdAt = createdOrder.createdAt;
    this.updatedAt = createdOrder.updatedAt;
    this.id = createdOrder.id;
    this.username = createdOrder.username;
  }
}
