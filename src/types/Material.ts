import { ICreationStamp } from './types';

export interface Material {
  status: 'active' | 'inactive';
  internalCode: string;
  description: string;
  stock: number;
  reservedStock: number;
  pricePerUnit: number;
  unit: string;
  purchaseTime: number;
  internalNotes: string;
}
export interface PartialMaterial extends Partial<Material> {}

export interface CreatedMaterial extends Material, ICreationStamp {}
export interface PartialCreatedMaterial extends Partial<CreatedMaterial> {}
