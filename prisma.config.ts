import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

// Load .env.local first (Next.js convention), falling back to .env
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // Use DIRECT_URL for CLI commands (migrate, db push, studio).
    // Falls back to DATABASE_URL if DIRECT_URL is not set.
    // DIRECT_URL bypasses PgBouncer so prepared statements work.
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || "postgresql://dummy:dummy@dummy/dummy",
  },
});
