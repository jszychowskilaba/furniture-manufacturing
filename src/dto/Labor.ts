import { ICreationStamp } from '../types/types';

export interface Labor {
  status: 'active' | 'inactive';
  internalCode: string;
  description: string;
  pricePerUnit: number;
  timePerUnit: number;
  unit: string;
  internalNotes: string;
}

export interface PartialLabor extends Partial<Labor> {}

export interface CreatedLabor extends Labor, ICreationStamp {}
export interface PartialCreatedLabor extends Partial<CreatedLabor> {}
