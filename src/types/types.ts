export interface UserCredentials {
  client_id: string;
  client_secret: string | null;
}

export interface ICustomError extends Error {
  status: number;
}

export interface ICreationStamp {
  createdAt: string;
  updatedAt: string;
  id?: string;
  username: string;
}



export interface Order {
  internalCode: string;
  description: string;
  unitsToManufacture: number;
  materials: Array<{ id: string; quantity: number }>;
  labors: Array<{ id: string; quantity: number }>;
  internalNotes: string;
}
export interface PartialOrder extends Partial<Order> {}
