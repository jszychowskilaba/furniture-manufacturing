export interface UserCredentials {
  username: string;
  password: string;
}

export interface Error {
  status: number;
  message: string;
}

export interface Tokens {
  token: string;
  refreshToken: string;
}
