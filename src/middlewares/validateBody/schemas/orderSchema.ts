import { JSONSchemaType } from 'ajv';
import { Order, } from '../../../types/Order';

/**
 * Material schema for post method
 */
export const orderSchema: JSONSchemaType<Order> = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['pending', 'inProduction', 'finished'] },
    internalCode: { type: 'string', minLength: 0, maxLength: 255 },
    description: { type: 'string', minLength: 1, maxLength: 255 },

    materials: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', minLength: 1, maxLength: 255 },
          quantity: { type: 'number', minimum: 0 },
        },
        required: ['id', 'quantity'],
        additionalProperties: false,
      },
    },

    labors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', minLength: 1, maxLength: 255 },
          quantity: { type: 'number', minimum: 0 },
        },
        required: ['id', 'quantity'],
        additionalProperties: false,
      },
    },

    unitsToManufacture: { type: 'number', minimum: 0 },
    internalNotes: { type: 'string', minLength: 1, maxLength: 255 },
  },
  required: [
    'status',
    'internalCode',
    'description',
    'materials',
    'labors',
    'unitsToManufacture',
    'internalNotes',
  ],
  additionalProperties: false,
};

/**
 * Partial Material schema for patch method
 */
export const partialOrderSchema: JSONSchemaType<Order> = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['pending', 'inProduction', 'finished'] },
    internalCode: { type: 'string', minLength: 0, maxLength: 255 },
    description: { type: 'string', minLength: 1, maxLength: 255 },

    materials: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', minLength: 1, maxLength: 255 },
          quantity: { type: 'number', minimum: 0 },
        },
        required: ['id', 'quantity'],
        additionalProperties: false,
      },
    },

    labors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', minLength: 1, maxLength: 255 },
          quantity: { type: 'number', minimum: 0 },
        },
        required: ['id', 'quantity'],
        additionalProperties: false,
      },
    },

    unitsToManufacture: { type: 'number', minimum: 0 },
    internalNotes: { type: 'string', minLength: 1, maxLength: 255 },
  },
  required: [],
  additionalProperties: false,
};
