import type { FastifyInstance, FastifyReply } from 'fastify';
import { Portal } from '@prisma/client';
import { z } from 'zod';
import { config } from '../config';
import { hashPassword, needsRehash, verifyPassword } from '../lib/password';
import { prisma } from '../lib/prisma';
import {
  ACCESS_TOKEN_TTL_SECONDS,
  generateRefreshToken,
  hashToken,
  newId,
  signAccessToken,
} from '../lib/tokens';
import { normalizeScope, roleBelongsToPortal } from '../plugins/rbac';

const REFRESH_TTL_MS = 24 * 60 * 60 * 1_000;

const loginSchema = z.object({
  login: z.string().trim().min(1, 'login is required'),
  password: z.string().min(1, 'password is required'),
  portal: z.nativeEnum(Portal),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'refreshToken is required'),
});

function fail(
  reply: FastifyReply,
  statusCode: number,
  error: string,
  message: string,
): FastifyReply {
  return reply.code(statusCode).send({ ok: false, error, message });
}

function publicUser(user: {
  id: string;
  name: string;
  email: string | null;
  role: string;
  portal: string;
  scope: unknown;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    portal: user.portal,
    scope: normalizeScope(user.scope),
  };
}

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post('/api/auth/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: body.login, mode: 'insensitive' } },
          { phone: body.login },
        ],
      },
    });

    // Deliberately generic responses for unknown and inactive accounts to
    // avoid account enumeration.
    if (!user || !user.isActive) {
      return fail(
        reply,
        401,
        'invalid_credentials',
        'Invalid email/phone or password',
      );
    }

    const passwordValid = await verifyPassword(body.password, user.password);
    if (!passwordValid) {
      return fail(
        reply,
        401,
        'invalid_credentials',
        'Invalid email/phone or password',
      );
    }

    if (
      user.portal !== body.portal ||
      !roleBelongsToPortal(user.role, body.portal)
    ) {
      return fail(
        reply,
        403,
        'portal_mismatch',
        'This account does not belong to the selected portal',
      );
    }

    // Upgrade legacy PBKDF2/scrypt hashes after a successful login. A failure
    // here must not block the login itself.
    if (needsRehash(user.password)) {
      try {
        const passwordHash = await hashPassword(body.password);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: passwordHash },
        });
      } catch (error) {
        request.log.warn(
          { err: error, userId: user.id },
          'password rehash failed',
        );
      }
    }

    const refreshToken = generateRefreshToken();
    const sessionId = newId();
    const expiresAt = new Date(
      Date.now() + config.REFRESH_TTL_DAYS * REFRESH_TTL_MS,
    );

    await prisma.session.create({
      data: {
        id: sessionId,
        userId: user.id,
        refreshHash: hashToken(refreshToken),
        expiresAt,
      },
    });

    const scope = normalizeScope(user.scope);
    const token = signAccessToken(app, {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      portal: user.portal,
      scope,
      sessionId,
    });

    const userAgent = request.headers['user-agent'];

    app.audit({
      actorId: user.id,
      role: user.role,
      action: 'LOGIN',
      entityType: 'session',
      entityId: sessionId,
      details: {
        portal: user.portal,
        ip: request.ip,
        userAgent: typeof userAgent === 'string' ? userAgent : null,
      },
    });

    return reply.send({
      ok: true,
      token,
      refreshToken,
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
      user: publicUser(user),
    });
  });

  app.post('/api/auth/refresh', async (request, reply) => {
    const body = refreshSchema.parse(request.body);
    const now = new Date();

    const session = await prisma.session.findFirst({
      where: { refreshHash: hashToken(body.refreshToken) },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
        revokedAt: true,
        rotatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            portal: true,
            scope: true,
            isActive: true,
          },
        },
      },
    });

    if (
      !session ||
      session.revokedAt ||
      session.rotatedAt ||
      session.expiresAt <= now ||
      !session.user.isActive
    ) {
      return fail(
        reply,
        401,
        'invalid_refresh',
        'Refresh token is invalid or expired',
      );
    }

    const nextRefreshToken = generateRefreshToken();
    const nextSessionId = newId();
    const nextExpiresAt = new Date(
      now.getTime() + config.REFRESH_TTL_DAYS * REFRESH_TTL_MS,
    );

    // Revoke the old session and create the new one atomically. The conditional
    // update also prevents two concurrent refreshes from both succeeding.
    const rotated = await prisma.$transaction(async (tx) => {
      const revoked = await tx.session.updateMany({
        where: {
          id: session.id,
          revokedAt: null,
          rotatedAt: null,
        },
        data: {
          revokedAt: now,
          rotatedAt: now,
        },
      });

      if (revoked.count !== 1) return false;

      await tx.session.create({
        data: {
          id: nextSessionId,
          userId: session.userId,
          refreshHash: hashToken(nextRefreshToken),
          expiresAt: nextExpiresAt,
        },
      });

      return true;
    });

    if (!rotated) {
      return fail(
        reply,
        401,
        'invalid_refresh',
        'Refresh token is invalid or expired',
      );
    }

    const scope = normalizeScope(session.user.scope);
    const token = signAccessToken(app, {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
      portal: session.user.portal,
      scope,
      sessionId: nextSessionId,
    });

    app.audit({
      actorId: session.user.id,
      role: session.user.role,
      action: 'REFRESH',
      entityType: 'session',
      entityId: nextSessionId,
      details: { previousSessionId: session.id },
    });

    return reply.send({
      ok: true,
      token,
      refreshToken: nextRefreshToken,
      expiresIn: ACCESS_TOKEN_TTL_SECONDS,
    });
  });

  app.get(
    '/api/auth/me',
    { preHandler: [app.authenticate] },
    async (request) => {
      const { sub, name, email, role, portal, scope } = request.user;

      return {
        ok: true,
        user: {
          id: sub,
          name,
          email,
          role,
          portal,
          scope,
        },
      };
    },
  );

  app.post(
    '/api/auth/logout',
    { preHandler: [app.authenticate] },
    async (request) => {
      const { sub, sid, role } = request.user;

      if (sid) {
        await prisma.session.updateMany({
          where: { id: sid, userId: sub, revokedAt: null },
          data: { revokedAt: new Date() },
        });
      }

      app.audit({
        actorId: sub,
        role,
        action: 'LOGOUT',
        entityType: 'session',
        entityId: sid ?? null,
        details: {},
      });

      return { ok: true };
    },
  );

  app.post(
    '/api/auth/logout-all',
    { preHandler: [app.authenticate] },
    async (request) => {
      const { sub, role } = request.user;

      const result = await prisma.session.updateMany({
        where: { userId: sub, revokedAt: null },
        data: { revokedAt: new Date() },
      });

      app.audit({
        actorId: sub,
        role,
        action: 'LOGOUT_ALL',
        entityType: 'user',
        entityId: sub,
        details: { revokedSessions: result.count },
      });

      return { ok: true, revoked: result.count };
    },
  );
}
