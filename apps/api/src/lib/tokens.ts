import { createHash, randomBytes, randomUUID } from 'node:crypto';
import type { FastifyInstance } from 'fastify';
import type { Portal, Role } from '@prisma/client';
import { config } from '../config';
import type { AuthScope } from '../plugins/rbac';

const DURATION_UNITS: Record<string, number> = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 24 * 60 * 60,
  w: 7 * 24 * 60 * 60,
};

export interface AuthUser {
  sub: string;
  name: string;
  email: string | null;
  role: Role;
  portal: Portal;
  scope: AuthScope;
  typ: 'access';
  sid?: string;
}

export interface AccessTokenInput {
  id: string;
  name: string;
  email: string | null;
  role: Role;
  portal: Portal;
  scope: AuthScope;
  sessionId?: string;
}

/**
 * Parses durations such as "45s", "30m", "2h", "14d", or "1w" into seconds.
 * A numeric input is treated as seconds.
 */
export function parseDuration(value: string | number): number {
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(`Invalid duration: ${value}`);
    }
    return Math.floor(value);
  }

  const match = /^(\d+)\s*(s|m|h|d|w)?$/i.exec(value.trim());
  if (!match) {
    throw new Error(`Invalid duration: ${value}`);
  }

  const amount = Number(match[1]);
  const unit = (match[2] ?? 's').toLowerCase();
  const multiplier = DURATION_UNITS[unit];

  if (!Number.isSafeInteger(amount) || amount <= 0 || !multiplier) {
    throw new Error(`Invalid duration: ${value}`);
  }

  return amount * multiplier;
}

export const ACCESS_TOKEN_TTL_SECONDS = parseDuration(config.JWT_EXPIRES_IN);

export function signAccessToken(
  app: FastifyInstance,
  input: AccessTokenInput,
): string {
  const payload: AuthUser = {
    sub: input.id,
    name: input.name,
    email: input.email,
    role: input.role,
    portal: input.portal,
    scope: input.scope,
    typ: 'access',
  };

  if (input.sessionId) {
    payload.sid = input.sessionId;
  }

  return app.jwt.sign(payload, { expiresIn: ACCESS_TOKEN_TTL_SECONDS });
}

export function verifyAccessToken(
  app: FastifyInstance,
  token: string,
): AuthUser {
  const payload = app.jwt.verify<AuthUser>(token);

  if (payload.typ !== 'access') {
    throw new Error('Invalid access token type');
  }

  return payload;
}

/**
 * Opaque refresh token: 48 random bytes encoded as base64url (64 characters).
 * Only its SHA-256 hash is persisted, so a database leak does not expose
 * usable refresh tokens.
 */
export function generateRefreshToken(): string {
  return randomBytes(48).toString('base64url');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function newId(): string {
  return randomUUID();
}
