import { pool } from '../Pool';

/**
 * Create public schema if it does no exists.
 */
export const createPublicSchema = async (): Promise<void> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Creating custom types
    await client.query(`
        DO $$ BEGIN
            CREATE TYPE user_role AS ENUM ('inactive', 'sales', 'productionManager', 'inventoryAdministrator', 'admin');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;`);

    await client.query(`
        DO $$ BEGIN
            CREATE TYPE material_labor_status as ENUM ('active', 'inactive');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;`);

    await client.query(`
        DO $$ BEGIN
            CREATE TYPE order_status as ENUM ('pending', 'inProduction', 'finished', 'canceled');
        EXCEPTION
            WHEN duplicate_object THEN null;
        END $$;`);

    // Creating appUser table
    await client.query(`
        CREATE TABLE IF NOT EXISTS "appUser" (
            "username" VARCHAR(16) PRIMARY KEY,
            "email" VARCHAR(50) UNIQUE NOT NULL,
            "hashedPassword" VARCHAR(64) NOT NULL,
            "salt" VARCHAR(32) NOT NULL,
            "name" VARCHAR(45) NOT NULL,
            "lastName" VARCHAR(45) NOT NULL,
            "role" user_role NOT NULL,
            "createdAt" TIMESTAMP NOT NULL,
            "updatedAt" TIMESTAMP NOT NULL
        );`);

    // Creating labor table
    await client.query(`
        CREATE TABLE IF NOT EXISTS "labor" (
            "id" CHAR(36) PRIMARY KEY,
            "createdAt" TIMESTAMP NOT NULL,
            "updatedAt" TIMESTAMP NOT NULL,
            "status" material_labor_status NOT NULL,
            "internalCode" VARCHAR(30) UNIQUE NOT NULL,
            "description" VARCHAR(255) NOT NULL,
            "pricePerUnit" NUMERIC(9,2) NOT NULL CHECK ("pricePerUnit" >= 0),
            "timePerUnit" NUMERIC(9,2) NOT NULL CHECK ("timePerUnit" >= 0 ),
            "unit" VARCHAR(50) NOT NULL,
            "internalNotes" VARCHAR(255) NOT NULL,
            "username" VARCHAR(16) REFERENCES "appUser" ("username") NOT NULL
        );`);

    // Creating manufactureOrder table
    await client.query(`
        CREATE TABLE IF NOT EXISTS "manufactureOrder" (
            "id" CHAR(36) PRIMARY KEY,
            "createdAt" TIMESTAMP NOT NULL,
            "updatedAt" TIMESTAMP NOT NULL,
            "status" order_status NOT NULL,
            "internalCode" VARCHAR(30) UNIQUE NOT NULL,
            "description" VARCHAR(255) NOT NULL,
            "manufactured" NUMERIC(9) NOT NULL,
            "totalPrice" NUMERIC(9,2) NOT NULL CHECK ("totalPrice" >= 0),
            "totalProductionTime" NUMERIC(10,1),
            "unitsToManufacture" NUMERIC(9) NOT NULL CHECK ("unitsToManufacture" >= 0),
            "internalNotes" VARCHAR(255) NOT NULL,
            "username" VARCHAR(16) REFERENCES "appUser" ("username") NOT NULL
        );`);

    // Creating material table
    await client.query(`
        CREATE TABLE IF NOT EXISTS "material" (
            "id" CHAR(36) PRIMARY KEY,
            "createdAt" TIMESTAMP NOT NULL,
            "updatedAt" TIMESTAMP NOT NULL,
            "status" material_labor_status NOT NULL,
            "internalCode" VARCHAR(30) UNIQUE NOT NULL,
            "description" VARCHAR(255) NOT NULL,
            "stock" NUMERIC(9,2) NOT NULL CHECK ("stock" >= 0),
            "reservedStock" NUMERIC(9,2) NOT NULL CHECK ("reservedStock" >= 0),
            "pricePerUnit" NUMERIC(9,2) NOT NULL CHECK ("pricePerUnit" >= 0),
            "unit" VARCHAR(50) NOT NULL,
            "purchaseTime" NUMERIC(4,1) NOT NULL CHECK ("purchaseTime" >= 0),
            "internalNotes" VARCHAR(255) NOT NULL,
            "username" VARCHAR(16) REFERENCES "appUser" ("username") NOT NULL
        );`);

    // Creating orderHasLabor table
    await client.query(`
        CREATE TABLE IF NOT EXISTS "orderHasLabor" (
            "createdAt" TIMESTAMP NOT NULL,
            "updatedAt" TIMESTAMP NOT NULL,
            "manufactureOrderId" CHAR(36) REFERENCES "manufactureOrder" (id),
            "laborId" CHAR(36) REFERENCES "labor" (id),
            "quantity" NUMERIC(9,2) NOT NULL CHECK (quantity >= 0),
            PRIMARY KEY ("manufactureOrderId", "laborId"));`);

    // Creating orderHasMaterial table
    await client.query(`
        CREATE TABLE IF NOT EXISTS "orderHasMaterial" (
            "createdAt" TIMESTAMP NOT NULL,
            "updatedAt" TIMESTAMP NOT NULL,
            "manufactureOrderId" CHAR(36) REFERENCES "manufactureOrder" ("id"),
            "materialId" CHAR(36) REFERENCES "material" ("id"),
            "quantity" NUMERIC(9,2) NOT NULL CHECK ("quantity" >= 0),
            PRIMARY KEY ("manufactureOrderId", "materialId"));`);

    console.log('Public schema has been loaded.');

    await client.query('COMMIT');
  } catch (error) {
    console.log('Can not load tables.');

    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.release();
  }
};
