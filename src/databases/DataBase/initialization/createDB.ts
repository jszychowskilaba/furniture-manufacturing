import { Client } from 'pg';
import { config } from '../config/config';

/**
 * Creates database if it does not exists.
 */
export const createDB = async (): Promise<void> => {
  const client = new Client({
    host: config.host,
    user: config.user,
    password: config.password,
    port: config.port,
  });
  try {
    await client.connect();

    const res = await client.query(
      `SELECT datname FROM pg_catalog.pg_database WHERE datname = '${config.database}'`
    );

    if (!res.rowCount) {
      await client.query(`CREATE DATABASE "${config.database}";`);
      console.log(`Database created: ${config.database}.`);
    } else {
      console.log(`Not necessary to create database: ${config.database}.`);
    }
  } finally {
    await client.end();
  }
};
