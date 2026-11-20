import { pbkdf2Sync, scryptSync, timingSafeEqual } from 'node:crypto';
import argon2 from 'argon2';
import { config } from '../config';

const PBKDF2_PREFIX = 'pbkdf2$';
const SCRYPT_PREFIX = 'scrypt$';

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: config.ARGON2_MEMORY_COST,
  timeCost: config.ARGON2_TIME_COST,
  parallelism: config.ARGON2_PARALLELISM,
  hashLength: config.ARGON2_HASH_LENGTH,
} as const;

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, ARGON2_OPTIONS);
}

function isHex(value: string): boolean {
  return value.length > 0 && value.length % 2 === 0 && /^[0-9a-f]+$/i.test(value);
}

function safeEqual(actual: Buffer, expected: Buffer): boolean {
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/**
 * Legacy prototype format: pbkdf2$<iterations>$<salt>$<hexHash>
 */
function verifyPbkdf2(password: string, stored: string): boolean {
  const parts = stored.split('$');
  if (parts.length !== 4) return false;

  const [, iterationsRaw, salt, expectedHex] = parts;
  const iterations = Number(iterationsRaw);

  if (
    !Number.isInteger(iterations) ||
    iterations < 1 ||
    iterations > 10_000_000 ||
    !salt ||
    !isHex(expectedHex)
  ) {
    return false;
  }

  const expected = Buffer.from(expectedHex, 'hex');
  const actual = pbkdf2Sync(password, salt, iterations, expected.length, 'sha256');
  return safeEqual(actual, expected);
}

/**
 * Legacy prototype format: scrypt$<N>$<r>$<p>$<salt>$<hexHash>
 */
function verifyScrypt(password: string, stored: string): boolean {
  const parts = stored.split('$');
  if (parts.length !== 6) return false;

  const [, nRaw, rRaw, pRaw, salt, expectedHex] = parts;
  const N = Number(nRaw);
  const r = Number(rRaw);
  const p = Number(pRaw);

  if (
    !Number.isInteger(N) ||
    !Number.isInteger(r) ||
    !Number.isInteger(p) ||
    N < 2 ||
    (N & (N - 1)) !== 0 ||
    N > 1_048_576 ||
    r < 1 ||
    r > 32 ||
    p < 1 ||
    p > 16 ||
    !salt ||
    !isHex(expectedHex)
  ) {
    return false;
  }

  const expected = Buffer.from(expectedHex, 'hex');
  const maxmem = Math.max(32 * 1024 * 1024, 128 * N * r * 2);

  try {
    const actual = scryptSync(password, salt, expected.length, {
      N,
      r,
      p,
      maxmem,
    });
    return safeEqual(actual, expected);
  } catch {
    return false;
  }
}

/**
 * Verifies argon2id hashes as well as the legacy PBKDF2-SHA256 and scrypt
 * formats found in data migrated from the prototype. Plain-text passwords are
 * deliberately not accepted.
 */
export async function verifyPassword(
  password: string,
  stored: string | null | undefined,
): Promise<boolean> {
  if (!stored) return false;

  if (stored.startsWith('$argon2')) {
    try {
      return await argon2.verify(stored, password);
    } catch {
      return false;
    }
  }

  if (stored.startsWith(PBKDF2_PREFIX)) {
    return verifyPbkdf2(password, stored);
  }

  if (stored.startsWith(SCRYPT_PREFIX)) {
    return verifyScrypt(password, stored);
  }

  return false;
}

/**
 * True when the stored hash is not argon2id or uses weaker parameters than the
 * current configuration. Login uses this to transparently upgrade legacy
 * hashes after a successful password check.
 */
export function needsRehash(stored: string | null | undefined): boolean {
  if (!stored || !stored.startsWith('$argon2')) return true;

  try {
    return argon2.needsRehash(stored, ARGON2_OPTIONS);
  } catch {
    return true;
  }
}
