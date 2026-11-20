import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { config } from './config';
import { prisma } from './lib/prisma';
import { quitRedis } from './lib/redis';
import { auditPlugin } from './plugins/audit';
import { authPlugin } from './plugins/auth';
import { authRoutes } from './routes/auth';
import { domainRoutes } from './routes/domain';
import { healthRoutes } from './routes/health';

function resolveCorsOrigin(): true | string[] {
  const value = config.CORS_ORIGIN.trim();

  if (value === '*') return true;

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

/**
 * Builds a fully configured (but not listening) Fastify instance. Tests use
 * this factory with `app.inject()` or supertest against `app.server`.
 */
export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: config.NODE_ENV === 'test' ? false : { level: config.LOG_LEVEL },
  });

  app.register(cors, {
    origin: resolveCorsOrigin(),
    credentials: true,
  });

  app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
  });

  app.register(rateLimit, {
    max: 200,
    timeWindow: '1 minute',
    errorResponseBuilder: () => ({
      ok: false,
      error: 'rate_limited',
      message: 'Too many requests, please try again later',
    }),
  });

  // Applied to the root instance so the decorators are visible to every route.
  authPlugin(app);
  auditPlugin(app);

  app.register(healthRoutes);
  app.register(authRoutes);
  app.register(domainRoutes);

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      reply.code(400).send({
        ok: false,
        error: 'validation_error',
        message: 'Request validation failed',
        details: error.flatten().fieldErrors,
      });
      return;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        reply.code(409).send({
          ok: false,
          error: 'conflict',
          message: 'A record with the same unique value already exists',
        });
        return;
      }

      if (error.code === 'P2025') {
        reply.code(404).send({
          ok: false,
          error: 'not_found',
          message: 'The requested record was not found',
        });
        return;
      }
    }

    const statusCode =
      typeof error.statusCode === 'number' && error.statusCode >= 400
        ? error.statusCode
        : 500;

    if (statusCode >= 500) {
      request.log.error({ err: error }, 'request failed');
    }

    const code =
      statusCode >= 500
        ? 'internal_error'
        : typeof error.code === 'string'
          ? error.code.toLowerCase()
          : 'request_failed';

    reply.code(statusCode).send({
      ok: false,
      error: code,
      message: statusCode >= 500 ? 'Internal server error' : error.message,
    });
  });

  app.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
      ok: false,
      error: 'not_found',
      message: `Route ${request.method} ${request.url} not found`,
    });
  });

  app.addHook('onClose', async () => {
    await prisma.$disconnect().catch((error: unknown) => {
      app.log.warn({ err: error }, 'prisma disconnect failed');
    });
    await quitRedis().catch((error: unknown) => {
      app.log.warn({ err: error }, 'redis disconnect failed');
    });
  });

  await app.ready();
  return app;
}

/**
 * Starts the HTTP server. Only called when this file is executed directly.
 */
export async function start(): Promise<void> {
  const app = await buildApp();
  let shuttingDown = false;

  const shutdown = async (signal: string): Promise<void> => {
    if (shuttingDown) return;
    shuttingDown = true;

    app.log.info({ signal }, 'shutting down');

    try {
      await app.close();
      process.exit(0);
    } catch (error) {
      app.log.error({ err: error }, 'shutdown failed');
      process.exit(1);
    }
  };

  process.once('SIGINT', () => {
    void shutdown('SIGINT');
  });
  process.once('SIGTERM', () => {
    void shutdown('SIGTERM');
  });

  try {
    await app.listen({ port: config.PORT, host: config.HOST });
  } catch (error) {
    app.log.error({ err: error }, 'failed to start API');
    await app.close().catch(() => undefined);
    process.exit(1);
  }
}

if (require.main === module) {
  void start().catch((error: unknown) => {
    console.error('Failed to start API', error);
    process.exit(1);
  });
}
