import { CreatedOrder } from '../../types/Order';

export class CreatedOrderDto implements CreatedOrder {
  manufactured: number;
  totalPrice: number;
  totalProductionTime: number;
  status: 'pending' | 'inProduction' | 'finished' | 'canceled';
  internalCode: string;
  description: string;
  unitsToManufacture: number;
  materials: { id: string; quantity: number }[];
  labors: { id: string; quantity: number }[];
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
    this.materials = createdOrder.materials;
    this.labors = createdOrder.labors;
    this.internalNotes = createdOrder.internalNotes;
    this.createdAt = createdOrder.createdAt;
    this.updatedAt = createdOrder.updatedAt;
    this.id = createdOrder.id;
    this.username = createdOrder.username;
  }
}
