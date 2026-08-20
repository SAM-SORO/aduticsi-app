import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { mockPrisma } from './mock/mock-prisma';
import logger from './logger';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma 7 requires a driver adapter.
// We use pg Pool with SSL disabled (rejectUnauthorized: false) to allow
// connection to Supabase's self-signed SSL certificate in local dev.
const connectionString = process.env.DATABASE_URL;

// No real DATABASE_URL configured (fresh clone, frontend-only work): fall
// back to the in-memory mock so pages relying on prisma still render.
const isMockMode = !connectionString || connectionString === 'your_database_url_here';

function createRealClient(): PrismaClient {
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

if (isMockMode) {
  logger.warn(
    'DATABASE_URL is not configured — using in-memory mock data from lib/mock/. Set real Supabase credentials in .env.local to use a live database.'
  );
}

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  (isMockMode ? (mockPrisma as unknown as PrismaClient) : createRealClient());

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
