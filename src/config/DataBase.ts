const config = {
  user: process.env.POSTGRES_USER || 'admin',
  host: process.env.DATABASE_HOST || 'localhost',
  database: process.env.DATABASE_DB || 'manufacturing_system',
  password: process.env.POSTGRES_PASSWORD || 'admin',
  port: Number(process.env.DATABASE_PORT) || 5432,
};


Object.freeze(config);

export { config };
