import Redis from 'ioredis';
import { config } from '../config';

interface CacheEntry {
  payload: string;
  expiresAt: number | null;
}

const MAX_MEMORY_ENTRIES = 10_000;
const memory = new Map<string, CacheEntry>();

let client: Redis | null | undefined;
let lastWarningAt = 0;

function warnRedis(error: unknown): void {
  const now = Date.now();
  if (now - lastWarningAt < 30_000) return;

  lastWarningAt = now;
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[redis] ${message}`);
}

/**
 * Returns a lazily-created Redis client, or null when REDIS_URL is not set.
 * The client connects in the background; cache helpers use the in-memory
 * fallback until the connection is ready, so Redis is never on the request's
 * critical path.
 */
export function getRedis(): Redis | null {
  if (client !== undefined) return client;

  if (!config.REDIS_URL) {
    client = null;
    return client;
  }

  const redis = new Redis(config.REDIS_URL, {
    connectTimeout: 2_000,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    retryStrategy: (times) => Math.min(times * 200, 5_000),
  });

  redis.on('error', warnRedis);
  client = redis;
  return client;
}

function readyClient(): Redis | null {
  const redis = getRedis();
  return redis && redis.status === 'ready' ? redis : null;
}

function pruneMemory(): void {
  if (memory.size < MAX_MEMORY_ENTRIES) return;

  const now = Date.now();
  for (const [key, entry] of memory) {
    if (entry.expiresAt !== null && entry.expiresAt <= now) {
      memory.delete(key);
    }
  }

  while (memory.size >= MAX_MEMORY_ENTRIES) {
    const oldest = memory.keys().next();
    if (oldest.done) break;
    memory.delete(oldest.value);
  }
}

function memoryGet<T>(key: string): T | null {
  const entry = memory.get(key);
  if (!entry) return null;

  if (entry.expiresAt !== null && entry.expiresAt <= Date.now()) {
    memory.delete(key);
    return null;
  }

  try {
    return JSON.parse(entry.payload) as T;
  } catch {
    return null;
  }
}

function memorySet(key: string, payload: string, ttlSeconds?: number): void {
  pruneMemory();
  memory.set(key, {
    payload,
    expiresAt:
      ttlSeconds && ttlSeconds > 0 ? Date.now() + ttlSeconds * 1_000 : null,
  });
}

export async function getJson<T>(key: string): Promise<T | null> {
  const redis = readyClient();

  if (redis) {
    try {
      const raw = await redis.get(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch (error) {
      warnRedis(error);
    }
  }

  return memoryGet<T>(key);
}

export async function setJson(
  key: string,
  value: unknown,
  ttlSeconds?: number,
): Promise<void> {
  const payload = JSON.stringify(value) ?? 'null';
  const ttl =
    ttlSeconds && ttlSeconds > 0 ? Math.ceil(ttlSeconds) : undefined;

  memorySet(key, payload, ttl);

  const redis = readyClient();
  if (!redis) return;

  try {
    if (ttl) {
      await redis.set(key, payload, 'EX', ttl);
    } else {
      await redis.set(key, payload);
    }
  } catch (error) {
    warnRedis(error);
  }
}

export async function del(key: string): Promise<void> {
  memory.delete(key);

  const redis = readyClient();
  if (!redis) return;

  try {
    await redis.del(key);
  } catch (error) {
    warnRedis(error);
  }
}

export async function quitRedis(): Promise<void> {
  if (!client) return;

  const current = client;
  client = undefined;

  try {
    await current.quit();
  } catch {
    current.disconnect();
  }
}
