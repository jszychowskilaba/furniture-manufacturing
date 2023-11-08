import { orderHasMaterial } from '../../types/Order';

export class OrderHasMaterialDto implements orderHasMaterial {
  createdAt: string | Date;
  updatedAt: string | Date;
  manufactureOrderId: string;
  materialId: string;
  quantity: number;

  constructor(orderHasMaterial: orderHasMaterial) {
    this.createdAt = orderHasMaterial.createdAt;
    this.updatedAt = orderHasMaterial.updatedAt;
    this.manufactureOrderId = orderHasMaterial.manufactureOrderId;
    this.materialId = orderHasMaterial.materialId;
    this.quantity = orderHasMaterial.quantity;
  }
}
