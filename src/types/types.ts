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
  id: string;
  username: string;
}
