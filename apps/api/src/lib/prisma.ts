import { PrismaClient } from '@prisma/client';
import { config } from '../config';

type PrismaLogLevel = 'query' | 'info' | 'warn' | 'error';

const globalForPrisma = globalThis as typeof globalThis & {
  __ryadAlAqsaPrisma?: PrismaClient;
};

const log: PrismaLogLevel[] =
  config.NODE_ENV === 'development'
    ? ['query', 'info', 'warn', 'error']
    : ['warn', 'error'];

/**
 * A single Prisma client per process. The client connects lazily on the first
 * query, so importing this module (for example in tests) does not require a
 * running database.
 */
export const prisma =
  globalForPrisma.__ryadAlAqsaPrisma ??
  new PrismaClient({
    datasources: {
      db: { url: config.DATABASE_URL },
    },
    log,
  });

if (config.NODE_ENV !== 'production') {
  globalForPrisma.__ryadAlAqsaPrisma = prisma;
}
