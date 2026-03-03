// Prisma 7 configuration for Srushti Publications
//
// Two connection strings are needed for Supabase:
//   DATABASE_URL → PgBouncer pooler (port 6543, ?pgbouncer=true)
//                   Used by the app at runtime via the PrismaPg adapter
//   DIRECT_URL   → Direct Postgres (port 5432, no pgbouncer)
//                   Used here by the Prisma CLI for db push / migrate
//
// The app runtime still reads DATABASE_URL in prisma.ts (PrismaPg Pool adapter).
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // CLI uses the direct connection — bypasses PgBouncer, supports DDL
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
