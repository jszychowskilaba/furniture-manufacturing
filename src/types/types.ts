export interface UserCredentials {
  client_id: string;
  client_secret: string | null;
}

export interface Error {
  status: number;
  message: string;
}

export interface Material {
  status?: 'active' | 'inactive';
  internalCode: string;
  description: string;
  quantity: number;
  pricePerUnit: number;
  unit: string;
  purchaseTime: number;
  internalNotes: string;
}

export interface Labor {
  status?: 'active' | 'inactive';
  internalCode: string;
  description: string;
  pricePerUnit: number;
  timePerUnit: number;
  unit: string;
  internalNote: string;
}
