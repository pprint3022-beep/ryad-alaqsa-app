import jwt from '@fastify/jwt';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { Portal, Role } from '@prisma/client';
import { config } from '../config';
import { prisma } from '../lib/prisma';
import { normalizeScope } from './rbac';

export type AuthPreHandler = (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<unknown>;

function unauthorized(
  reply: FastifyReply,
  message = 'Missing, invalid, or expired access token',
): FastifyReply {
  return reply.code(401).send({
    ok: false,
    error: 'unauthorized',
    message,
  });
}

/**
 * Registers JWT support and the auth guards. Called directly on the root
 * instance (not through app.register) so the decorators are visible to all
 * route plugins. This avoids a dependency on fastify-plugin.
 */
export function authPlugin(app: FastifyInstance): void {
  app.register(jwt, { secret: config.JWT_SECRET });

  const authenticate: AuthPreHandler = async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch {
      return unauthorized(reply);
    }

    const tokenUser = request.user;
    if (!tokenUser?.sub || tokenUser.typ !== 'access') {
      return unauthorized(reply);
    }

    // One database lookup per authenticated request: verifies the account is
    // still active and refreshes role/portal/scope from the source of truth.
    const user = await prisma.user.findUnique({
      where: { id: tokenUser.sub },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        portal: true,
        scope: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return unauthorized(reply, 'Account is inactive or no longer exists');
    }

    request.user = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      portal: user.portal,
      scope: normalizeScope(user.scope),
      typ: 'access',
      sid: tokenUser.sid,
    };
  };

  app.decorate('authenticate', authenticate);

  app.decorate('requirePortal', (portal: Portal): AuthPreHandler => {
    return async (request, reply) => {
      if (!request.user?.sub) {
        return unauthorized(reply);
      }

      if (request.user.portal !== portal) {
        return reply.code(403).send({
          ok: false,
          error: 'portal_mismatch',
          message: 'This account does not belong to the requested portal',
        });
      }
    };
  });

  app.decorate('requireRoles', (roles: Role[]): AuthPreHandler => {
    const allowed = new Set<Role>(roles);

    return async (request, reply) => {
      if (!request.user?.sub) {
        return unauthorized(reply);
      }

      if (!allowed.has(request.user.role)) {
        return reply.code(403).send({
          ok: false,
          error: 'forbidden',
          message: 'This role is not allowed to perform this action',
        });
      }
    };
  });
}
