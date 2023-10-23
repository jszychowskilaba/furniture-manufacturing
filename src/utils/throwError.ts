import { ICustomError } from '../types/types';

class CustomError extends Error implements ICustomError {
  status: number;
  constructor(message: string, status: number) {
    super(message || 'Unexpected error');
    this.status = status || 500;
  }
}

/**
 * Throws a error object with the correct shape in order to
 * be handled by the corresponding error middleware.
 * @param message The error message
 * @param status The HTTP status code
 */
export const throwError = (message: string, status: number) => {
  const customError = new CustomError(message, status);
  throw customError;
};
