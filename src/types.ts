export interface UserCredentials {
  client_id: string;
  client_secret: string | null;
}

export interface Error {
  status: number;
  message: string;
}
