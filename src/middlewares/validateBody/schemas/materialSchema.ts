import { JSONSchemaType } from 'ajv';
import { Material } from '../../../types/types';

export const materialSchema: JSONSchemaType<Material> = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['active', 'inactive']},
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
