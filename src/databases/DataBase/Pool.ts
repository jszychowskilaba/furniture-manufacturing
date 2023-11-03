import { Pool } from 'pg';
import { config } from '../../config/DataBase';
import * as pg from 'pg';

const types = pg.types;
types.setTypeParser(1700, function (val) {
  return parseFloat(val);
});

export const pool = new Pool({
  host: config.host,
  user: config.user,
  database: config.database,
  password: config.password,
  port: config.port,
});
