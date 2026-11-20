import { z } from 'zod';

/**
 * Development-only fallbacks. These are intentionally public and must never be
 * used in production (the schema below rejects a missing secret when
 * NODE_ENV=production).
 */
const DEV_JWT_SECRET = 'dev-only-insecure-jwt-secret-change-before-production';
const DEV_DATABASE_URL =
  'postgresql://postgres:postgres@localhost:5432/ryad_alaqsa?schema=public';

const optionalString = z.preprocess(
  (value) => (value === '' || value === undefined ? undefined : value),
  z.string().min(1).optional(),
);

const optionalSecret = z.preprocess(
  (value) => (value === '' || value === undefined ? undefined : value),
  z.string().min(32, 'JWT_SECRET must be at least 32 characters').optional(),
);

const optionalRedisUrl = z.preprocess(
  (value) => (value === '' || value === undefined ? undefined : value),
  z.string().min(1, 'REDIS_URL must not be empty').optional(),
);

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3001),
    HOST: z.string().min(1).default('0.0.0.0'),

    DATABASE_URL: optionalString,
    JWT_SECRET: optionalSecret,
    JWT_EXPIRES_IN: z
      .string()
      .regex(
        /^\d+\s*(s|m|h|d|w)?$/i,
        'JWT_EXPIRES_IN must be a duration such as 45s, 30m, 2h, or 14d',
      )
      .default('2h'),
    REFRESH_TTL_DAYS: z.coerce.number().int().min(1).max(365).default(14),

    CORS_ORIGIN: z
      .string()
      .min(1)
      .default('http://localhost:5173'),
    REDIS_URL: optionalRedisUrl,
    LOG_LEVEL: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
      .default('info'),

    ARGON2_MEMORY_COST: z.coerce
      .number()
      .int()
      .min(8192)
      .max(1048576)
      .default(19456),
    ARGON2_TIME_COST: z.coerce.number().int().min(1).max(10).default(2),
    ARGON2_PARALLELISM: z.coerce.number().int().min(1).max(8).default(1),
    ARGON2_HASH_LENGTH: z.coerce.number().int().min(16).max(128).default(32),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV !== 'production') return;

    if (!env.DATABASE_URL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['DATABASE_URL'],
        message: 'DATABASE_URL is required in production',
      });
    }

    if (!env.JWT_SECRET) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['JWT_SECRET'],
        message: 'JWT_SECRET is required in production',
      });
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('\n');
  throw new Error(`Invalid environment configuration:\n${issues}`);
}

const env = parsed.data;

export type AppConfig = Omit<
  z.infer<typeof envSchema>,
  'DATABASE_URL' | 'JWT_SECRET'
> & {
  DATABASE_URL: string;
  JWT_SECRET: string;
};

export const config: AppConfig = Object.freeze({
  ...env,
  DATABASE_URL: env.DATABASE_URL ?? DEV_DATABASE_URL,
  JWT_SECRET: env.JWT_SECRET ?? DEV_JWT_SECRET,
});
