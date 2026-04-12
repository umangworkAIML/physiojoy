import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from ".prisma/client";
import { DATABASE_URL } from "@/lib/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    // Supabase pooler (PgBouncer) runs in transaction mode,
    // which does NOT support prepared statements.
    // Setting statement_timeout avoids "prepared statement already exists" errors.
    // See: https://supabase.com/docs/guides/database/connecting-to-postgres#connecting-with-drizzle
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
