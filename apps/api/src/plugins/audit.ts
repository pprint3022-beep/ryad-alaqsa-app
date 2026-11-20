import { randomUUID } from 'node:crypto';
import type { FastifyInstance } from 'fastify';
import type { Prisma, Role } from '@prisma/client';
import { prisma } from '../lib/prisma';

export interface AuditEntry {
  actorId?: string | null;
  role?: Role | string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: Record<string, unknown>;
}

/**
 * Decorates app.audit. Writes are best-effort and fire-and-forget: an audit
 * failure is logged but never fails the user's request.
 */
export function auditPlugin(app: FastifyInstance): void {
  app.decorate('audit', (entry: AuditEntry): void => {
    let details: Prisma.InputJsonValue;

    try {
      details = JSON.parse(
        JSON.stringify(entry.details ?? {}),
      ) as Prisma.InputJsonValue;
    } catch (error) {
      app.log.warn(
        { err: error, action: entry.action },
        'audit details could not be serialized',
      );
      return;
    }

    void prisma.auditLog
      .create({
        data: {
          id: randomUUID(),
          actorId: entry.actorId ?? null,
          role: entry.role ?? null,
          action: entry.action,
          entityType: entry.entityType,
          entityId: entry.entityId ?? null,
          details,
        },
      })
      .catch((error: unknown) => {
        app.log.warn(
          { err: error, action: entry.action },
          'audit log write failed',
        );
      });
  });
}
