import Ajv, { JSONSchemaType } from 'ajv';
import { Request, Response, NextFunction } from 'express';
import { materialSchema } from './schemas/materialSchema';

/**
 * High order function that returns a middleware validating request body 
 * against a predefined schema. If request body is invalid, throws an error.
 * @param schema The predefined schema
 * @returns The middleware
 */
export const validateBody = (schema: JSONSchemaType<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    const ajv = new Ajv();
    const validate = ajv.compile(schema);

    if (validate(data)) {
      next();
    } else {
      throw validate.errors;
    }
  };
};

export {materialSchema}
