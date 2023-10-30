import { User } from '../../../types/User';
import { JSONSchemaType } from 'ajv';

/**
 * User schema for post method
 */
export const userSchema: JSONSchemaType<User> = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 0, maxLength: 16 },
    email: { type: 'string', minLength: 0, maxLength: 50 },
    password: { type: 'string', minLength: 6, maxLength: 32 },
    name: { type: 'string', minLength: 0, maxLength: 45 },
    lastName: { type: 'string', minLength: 0, maxLength: 45 },
    role: {
      type: 'string',
      enum: [
        'inactive',
        'sales',
        'productionManager',
        'inventoryAdministrator',
        'admin',
      ],
    },
  },
  required: ['username', 'email', 'password', 'name', 'lastName', 'role'],
  additionalProperties: false,
};

/**
 * User schema for update method
 */
export const partialUserSchema: JSONSchemaType<User> = {
  type: 'object',
  properties: {
    username: { type: 'string', minLength: 0, maxLength: 16 },
    email: { type: 'string', minLength: 0, maxLength: 50 },
    password: { type: 'string', minLength: 6, maxLength: 32 },
    name: { type: 'string', minLength: 0, maxLength: 45 },
    lastName: { type: 'string', minLength: 0, maxLength: 45 },
    role: {
      type: 'string',
      enum: [
        'inactive',
        'sales',
        'productionManager',
        'inventoryAdministrator',
        'admin',
      ],
    },
    
  },
  not: {
    required: ["username"]
  },
  required: [],
  additionalProperties: false,
};
