import { Pool } from 'pg';
import { config } from '../../config/DataBase';

export const pool = new Pool({
  host: config.host,
  user: config.user,
  database: config.database,
  password: config.password,
  port: config.port,
});
