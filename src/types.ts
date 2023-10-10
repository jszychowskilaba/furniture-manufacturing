export interface UserCredentials {
  username: string;
  password: string | null;
}

export interface Error {
  status: number;
  message: string;
}
