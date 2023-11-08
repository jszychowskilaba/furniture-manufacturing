import { CreatedMaterial } from '../../types/Material';

export class CreatedMaterialDto implements CreatedMaterial {
  status: 'active' | 'inactive';
  internalCode: string;
  description: string;
  stock: number;
  reservedStock: number;
  pricePerUnit: number;
  unit: string;
  purchaseTime: number;
  internalNotes: string;
  createdAt: string | Date;
  updatedAt: string;
  id: string;
  username: string;

  constructor(createdMaterial: CreatedMaterial) {
    this.status = createdMaterial.status;
    this.internalCode = createdMaterial.internalCode;
    this.description = createdMaterial.description;
    this.stock = createdMaterial.stock;
    this.reservedStock = createdMaterial.reservedStock;
    this.pricePerUnit = createdMaterial.pricePerUnit;
    this.unit = createdMaterial.unit;
    this.purchaseTime = createdMaterial.purchaseTime;
    this.internalNotes = createdMaterial.internalNotes;
    this.createdAt = createdMaterial.createdAt;
    this.updatedAt = createdMaterial.updatedAt;
    this.id = createdMaterial.id;
    this.username = createdMaterial.username;
  }
}
