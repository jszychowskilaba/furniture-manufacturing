import { Error } from '../types/types';

/**
 * Throws a error with the correct shape in order to 
 * be handled by the corresponding error handler.
 * @param status The status code
 * @param message The error message
 */
export const throwError = (status: number, message: string) => {
  const error: Error = {
    status: status || 500,
    message: message || 'Unexpected error',
  };

  throw error;
};
