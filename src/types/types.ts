export interface UserCredentials {
  client_id: string;
  client_secret: string | null;
}

export interface ICustomError extends Error {
  status: number;
}

export interface Material {
  status: 'active' | 'inactive';
  internalCode: string;
  description: string;
  quantity: number;
  pricePerUnit: number;
  unit: string;
  purchaseTime: number;
  internalNotes: string;
}
export interface PartialMaterial extends Partial<Material> {}

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

export interface Order {
  internalCode: string;
  description: string;
  unitsToManufacture: number;
  materials: Array<{ id: string; quantity: number }>;
  labors: Array<{ id: string; quantity: number }>;
  internalNotes: string;
}
export interface PartialOrder extends Partial<Order> {}
