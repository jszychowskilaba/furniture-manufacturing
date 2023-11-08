import { Material } from '../../types/Material';

export class MaterialDto implements Material {
  status: 'active' | 'inactive';
  internalCode: string;
  description: string;
  stock: number;
  reservedStock: number;
  pricePerUnit: number;
  unit: string;
  purchaseTime: number;
  internalNotes: string;

  constructor(createdMaterial: Material) {
    this.status = createdMaterial.status;
    this.internalCode = createdMaterial.internalCode;
    this.description = createdMaterial.description;
    this.stock = createdMaterial.stock;
    this.reservedStock = createdMaterial.reservedStock;
    this.pricePerUnit = createdMaterial.pricePerUnit;
    this.unit = createdMaterial.unit;
    this.purchaseTime = createdMaterial.purchaseTime;
    this.internalNotes = createdMaterial.internalNotes;
  }
}
