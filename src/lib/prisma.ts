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

  // Create a PostgreSQL connection pool optimized for Serverless (Vercel)
  // We limit max connections to 1 or 2 per lambda instance to avoid hitting 
  // the Supabase/Postgres limit during scaling.
  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
    max: 2, // Low limits are better for serverless to prevent connection exhaustion
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000, // Faster timeout for serverless
  });

  // Create the adapter using the pool
  const adapter = new PrismaPg(pool);

  // Create and return the Prisma Client with the adapter
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
