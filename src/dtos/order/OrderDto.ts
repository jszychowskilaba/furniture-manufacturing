import { Order } from '../../types/Order';

export class OrderDto implements Order {
  status: 'pending' | 'inProduction' | 'finished' | 'canceled';
  internalCode: string;
  description: string;
  unitsToManufacture: number;
  materials: { id: string; quantity: number }[];
  labors: { id: string; quantity: number }[];
  internalNotes: string;

  constructor(createdOrder: Order) {
    this.status = createdOrder.status;
    this.internalCode = createdOrder.internalCode;
    this.description = createdOrder.description;
    this.unitsToManufacture = createdOrder.unitsToManufacture;
    this.materials = createdOrder.materials;
    this.labors = createdOrder.labors;
    this.internalNotes = createdOrder.internalNotes;
  }
}
