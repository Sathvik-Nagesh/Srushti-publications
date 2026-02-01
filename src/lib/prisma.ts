import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

/**
 * Prisma Client with Connection Pooling
 * 
 * Production-optimized configuration:
 * - Connection pooling with pg Pool
 * - Prepared statements for faster repeated queries
 * - Query logging in development
 * - Graceful shutdown handling
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// Connection pool configuration based on environment
const poolConfig = {
  // Production: Supabase/Vercel has limited connections, keep pool small
  // Development: Can use more connections for faster development
  max: process.env.NODE_ENV === "production" ? 3 : 5,
  
  // Idle timeout: Close unused connections after 30 seconds
  idleTimeoutMillis: 30000,
  
  // Connection timeout: Fail fast in serverless environment
  connectionTimeoutMillis: process.env.NODE_ENV === "production" ? 3000 : 10000,
  
  // Statement timeout: Prevent long-running queries (30 seconds)
  statement_timeout: 30000,
  
  // Prepared statements for query caching
  allowExitOnIdle: process.env.NODE_ENV === "production",
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // Create a PostgreSQL connection pool
  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
    ...poolConfig,
  });

  // Log pool events in development
  if (process.env.NODE_ENV !== "production") {
    pool.on("connect", () => {
      console.log("📦 New database connection established");
    });
    pool.on("error", (err) => {
      console.error("❌ Database pool error:", err.message);
    });
  }

  // Store pool reference for cleanup
  globalForPrisma.pool = pool;

  // Create the adapter using the pool
  const adapter = new PrismaPg(pool);

  // Create Prisma Client with the adapter
  // Enable query logging in development
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "production" 
      ? ["error"] 
      : ["query", "error", "warn"],
  });

  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown handler
async function gracefulShutdown() {
  console.log("🔄 Closing database connections...");
  await prisma.$disconnect();
  if (globalForPrisma.pool) {
    await globalForPrisma.pool.end();
  }
  console.log("✅ Database connections closed");
}

// Handle process termination
if (typeof process !== "undefined") {
  process.on("SIGTERM", gracefulShutdown);
  process.on("SIGINT", gracefulShutdown);
}

export default prisma;

