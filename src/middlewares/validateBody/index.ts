import Ajv, { JSONSchemaType } from 'ajv';
import { Request, Response, NextFunction } from 'express';
import {
  materialSchema,
  partialMaterialSchema,
} from './schemas/materialSchema';
import { orderSchema, partialOrderSchema } from './schemas/orderSchema';
import { laborSchema, partialLaborSchema } from './schemas/laborSchema';
import { CustomError } from '../../helpers/CustomError';

/**
 * High order function that returns a middleware validating request body
 * against a predefined schema. If request body is invalid, throws an error.
 * @param schema The predefined schema
 * @returns The middleware
 */
export const validateBody = (schema: JSONSchemaType<unknown>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const ajv = new Ajv();
    const validate = ajv.compile(schema);

    if (validate(data)) {
      next();
    } else {
      next(
        new CustomError(
          `Error in request body. ${JSON.stringify(validate.errors)}`,
          400
        )
      );
    }
  };
};

export {
  materialSchema,
  partialMaterialSchema,
  laborSchema,
  partialLaborSchema,
  orderSchema,
  partialOrderSchema,
};
