import { JSONSchemaType } from 'ajv';
import { Order } from '../../../types/types';

/**
 * Material schema for post method
 */
export const orderSchema: JSONSchemaType<Order> = {
  type: 'object',
  properties: {
    internalCode: { type: 'string', minLength: 0, maxLength: 255 },
    description: { type: 'string', minLength: 1, maxLength: 255 },
    materials: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          quantity: { type: 'number', minimum: 0 },
          required: ['id', 'quantity'],
        },
      },
    },
    unitsToManufacture: { type: 'number', minimum: 0 },
    internalNotes: { type: 'string', minLength: 1, maxLength: 255 },
  },
  required: [
    'internalCode',
    'description',
    'materials',
    'unitsToManufacture',
    'internalNotes',
  ],
  additionalProperties: false,
};
