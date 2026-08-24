import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma 7 requires a driver adapter.
// Par défaut on accepte les certificats auto-signés de Supabase. Un Postgres
// sans TLS (cas d'une stack self-hosted) refuse la négociation : y ajouter
// sslmode=disable dans DATABASE_URL, ou DATABASE_SSL=false.
const connectionString = process.env.DATABASE_URL;

const sslDisabled =
  process.env.DATABASE_SSL === 'false' ||
  /[?&]sslmode=disable/.test(connectionString ?? '');

const pool = new Pool({
  connectionString,
  ssl: sslDisabled ? false : { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
