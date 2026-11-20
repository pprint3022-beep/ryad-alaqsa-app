import type { FastifyInstance } from 'fastify';
import { config } from '../config';
import { prisma } from '../lib/prisma';

const VERSION = process.env.npm_package_version ?? '2.0.0';

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/health', async (request) => {
    let database: 'connected' | 'disconnected' = 'disconnected';

    try {
      await prisma.$queryRaw`SELECT 1`;
      database = 'connected';
    } catch (error) {
      request.log.debug({ err: error }, 'health database check failed');
    }

    return {
      status: 'ok',
      uptime: process.uptime(),
      version: VERSION,
      database,
      redis: {
        enabled: Boolean(config.REDIS_URL),
      },
      timestamp: new Date().toISOString(),
    };
  });

  app.get('/api/version', async () => {
    return {
      ok: true,
      version: VERSION,
      environment: config.NODE_ENV,
    };
  });
}
