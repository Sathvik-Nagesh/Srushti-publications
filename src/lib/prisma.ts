import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Prisma 7 requires a driver adapter for the new "client" engine
// This provides the database connection details

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // Create a PostgreSQL connection pool with SSL for Supabase
  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false, // Required for Supabase
    },
    max: 10, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  // Create the adapter using the pool
  const adapter = new PrismaPg(pool);

  // Create and return the Prisma Client with the adapter
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
