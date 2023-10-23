import { Error } from '../types/types';

/**
 * Throws a error object with the correct shape in order to
 * be handled by the corresponding error middleware.
 * @param message The error message
 * @param status The HTTP status code
 */
export const throwError = (message: string, status: number) => {
  const error: Error = {
    message: message || 'Unexpected error',
    status: status || 500,
  };

  throw error;
};
