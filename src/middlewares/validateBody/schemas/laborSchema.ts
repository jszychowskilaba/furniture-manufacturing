import { JSONSchemaType } from 'ajv';
import { Labor, PartialLabor } from '../../../types/Labor';

/**
 * Labor schema for post method
 */
export const laborSchema: JSONSchemaType<Labor> = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['active', 'inactive'] },
    internalCode: { type: 'string', minLength: 0, maxLength: 255 },
    description: { type: 'string', minLength: 1, maxLength: 255 },
    pricePerUnit: { type: 'number', minimum: 0 },
    timePerUnit: { type: 'number', minimum: 0 },
    unit: { type: 'string', minLength: 1, maxLength: 255 },
    internalNotes: { type: 'string', minLength: 1, maxLength: 255 },
  },
  required: [
    'status',
    'internalCode',
    'description',
    'pricePerUnit',
    'timePerUnit',
    'unit',
    'internalNotes',
  ],
  additionalProperties: false,
};

/**
 * Partial labor schema for patch method
 */
export const partialLaborSchema: JSONSchemaType<PartialLabor> = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['active', 'inactive'], nullable: true },
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
    pricePerUnit: { type: 'number', minimum: 0, nullable: true },
    timePerUnit: { type: 'number', minimum: 0, nullable: true },
    unit: { type: 'string', minLength: 1, maxLength: 255, nullable: true },
    internalNotes: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
      nullable: true,
    },
  },
  additionalProperties: false,
};
