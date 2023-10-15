import { JSONSchemaType } from 'ajv';
import { Material, PartialMaterial } from '../../../types/types';

/**
 * Material schema for post method
 */
export const materialSchema: JSONSchemaType<Material> = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['active', 'inactive'] },
    internalCode: { type: 'string', minLength: 0, maxLength: 255 },
    description: { type: 'string', minLength: 1, maxLength: 255 },
    quantity: { type: 'number', minimum: 0 },
    pricePerUnit: { type: 'number', minimum: 0 },
    unit: { type: 'string', minLength: 1, maxLength: 255 },
    purchaseTime: { type: 'number', minimum: 0 },
    internalNotes: { type: 'string', minLength: 1, maxLength: 255 },
  },
  required: [
    'internalCode',
    'description',
    'quantity',
    'pricePerUnit',
    'unit',
    'purchaseTime',
    'internalNotes',
  ],
  additionalProperties: false,
};

/**
 * Partial material schema for patch method
 */
export const partialMaterialSchema: JSONSchemaType<PartialMaterial> = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['active', 'inactive'], nullable: true },
    internalCode: { type: 'string', minLength: 0, maxLength: 255, nullable: true },
    description: { type: 'string', minLength: 1, maxLength: 255, nullable: true },
    quantity: { type: 'number', minimum: 0, nullable: true },
    pricePerUnit: { type: 'number', minimum: 0, nullable: true },
    unit: { type: 'string', minLength: 1, maxLength: 255, nullable: true },
    purchaseTime: { type: 'number', minimum: 0, nullable: true },
    internalNotes: { type: 'string', minLength: 1, maxLength: 255, nullable: true },
  },
  additionalProperties: false,
};
