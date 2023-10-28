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

export interface CreatedMaterial extends Material, ICreationStamp {}

export interface PartialMaterial extends Partial<Material> {}
