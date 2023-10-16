import { JSONSchemaType } from 'ajv';
import { Order, PartialOrder } from '../../../types/types';

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
 * Material schema for patch method
 */
export const partialOrderSchema: JSONSchemaType<PartialOrder> = {
  type: 'object',
  properties: {
    internalCode: {
      type: 'string',
      minLength: 0,
      maxLength: 255,
      nullable: true,
    },
    description: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
      nullable: true,
    },

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
      nullable: true,
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
      nullable: true,
    },

    unitsToManufacture: { type: 'number', minimum: 0, nullable: true },
    internalNotes: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
      nullable: true,
    },
  },
  additionalProperties: false,
};
