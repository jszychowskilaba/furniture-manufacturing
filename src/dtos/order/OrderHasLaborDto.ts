import { orderHasLabor } from '../../types/Order';

export class OrderHasLaborDto implements orderHasLabor {
  createdAt: string | Date;
  updatedAt: string | Date;
  manufactureOrderId: string;
  laborId: string;
  quantity: number;

  constructor(orderHasLabor: orderHasLabor) {
    this.createdAt = orderHasLabor.createdAt;
    this.updatedAt = orderHasLabor.updatedAt;
    this.manufactureOrderId = orderHasLabor.manufactureOrderId;
    this.laborId = orderHasLabor.laborId;
    this.quantity = orderHasLabor.quantity;
  }
}
