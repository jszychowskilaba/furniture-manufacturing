import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../helpers/CustomError';
import { pool } from '../../databases/DataBase/Pool';
import { Role } from './roles';

export const checkUserIs = (role: Role) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const username = req.headers.username as string;

    try {
      const userRole = (
        await pool.query(
          `SELECT "role" FROM "appUser" WHERE "username" = '${username}'`
        )
      ).rows[0];

      if (userRole === role || userRole === Role.ADMIN) {
        next();
      } else {
        next(new CustomError('Not allowed to access to resource', 403));
      }
    } catch (error) {
      next(error);
    }
  };
};
