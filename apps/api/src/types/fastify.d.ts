import type { Portal, Role } from '@prisma/client';
import type { AuthUser } from '../lib/tokens';
import type { AuditEntry } from '../plugins/audit';
import type { AuthPreHandler } from '../plugins/auth';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: AuthUser;
    user: AuthUser;
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user: import('@fastify/jwt').FastifyJWT['user'];
  }

  interface FastifyInstance {
    /** Verifies the bearer token and reloads the active user from the database. */
    authenticate: AuthPreHandler;
    /** Must run after authenticate; enforces portal separation. */
    requirePortal(portal: Portal): AuthPreHandler;
    /** Must run after authenticate; enforces an allow-list of roles. */
    requireRoles(roles: Role[]): AuthPreHandler;
    /** Best-effort, non-blocking audit log write. */
    audit(entry: AuditEntry): void;
  }
}
