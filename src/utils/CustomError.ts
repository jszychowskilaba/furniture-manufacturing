import { ICustomError } from '../types/types';

export class CustomError extends Error implements ICustomError {
  status: number;
  constructor(message: string, status: number) {
    super(message || 'Unexpected error');
    this.status = status || 500;
  }
}


