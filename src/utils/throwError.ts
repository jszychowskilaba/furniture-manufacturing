import { Error } from '../types/types';

export const throwError = (status: number, message: string) => {
  const error: Error = {
    status: status || 500,
    message: message || 'Unexpected error',
  };

  throw error;
};
