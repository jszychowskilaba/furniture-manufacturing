import { ICreationStamp } from './types';

export interface Order {
  status: 'pending' | 'inProduction' | 'finished' | 'canceled';
  internalCode: string;
  description: string;
  unitsToManufacture: number;
  materials: Array<{ id: string; quantity: number }>;
  labors: Array<{ id: string; quantity: number }>;
  internalNotes: string;
}
export interface PartialOrder extends Partial<Order> {}

export interface CreatedOrder extends Order, ICreationStamp {
  manufactured: number;
  totalPrice: number;
  totalProductionTime: number;
}

export interface PartialCreatedOrder extends Partial<CreatedOrder> {}

export interface orderHasLabor {
  createdAt: string;
  updatedAt: string;
  manufactureOrderId: string;
  laborId: string;
}

export interface orderHasMaterial {
  createdAt: string;
  updatedAt: string;
  manufactureOrderId: string;
  materialId: string;
}
