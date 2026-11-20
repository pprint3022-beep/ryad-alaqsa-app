# Ryad Al Aqsa API

Fastify 4 + TypeScript + Prisma + optional Redis backend for the Ryad Al Aqsa
platform. This package replaces the legacy prototype's authentication layer
with a production-oriented foundation while keeping the prototype's response
and error conventions.

## Architecture

```
apps/api
├── prisma/schema.prisma      Authoritative data model
├── src
│   ├── config.ts             Zod-validated environment configuration
│   ├── index.ts              buildApp(), start(), error/404 handlers
│   ├── lib
│   │   ├── password.ts       argon2id + legacy PBKDF2/scrypt verification
│   │   ├── prisma.ts         Prisma singleton (lazy connection)
│   │   ├── redis.ts          Optional Redis client + TTL in-memory fallback
│   │   └── tokens.ts         JWT signing/verification, refresh tokens, hashing
│   ├── plugins
│   │   ├── audit.ts          app.audit() best-effort AuditLog writer
│   │   ├── auth.ts           authenticate / requirePortal / requireRoles
│   │   └── rbac.ts           Scope normalization and access checks
│   ├── routes
│   │   ├── auth.ts           login, refresh, me, logout, logout-all
│   │   └── health.ts         /api/health, /api/version
│   └── types
│       └── fastify.d.ts      Fastify/JWT module augmentation
├── tests/auth.test.ts        Supertest smoke tests (no database required)
├── jest.config.cjs
└── tsconfig.json
```

The API is CommonJS (the package has no `"type": "module"`). TypeScript sources
are compiled with `module: CommonJS`; `tsx` runs them directly in development.
Plugins are applied directly to the root Fastify instance so their decorators
are visible to route plugins without an additional `fastify-plugin` dependency.

## Requirements

- Node.js 20+
- PostgreSQL 16+ (for real authentication)
- Redis (optional; the API falls back to a process-local TTL cache)

## Setup and scripts

```bash
pnpm install
pnpm --filter api prisma:generate

# development (tsx watch)
pnpm --filter api dev

# build / run
pnpm --filter api build
pnpm --filter api start

# tests (health + validation only, no database needed)
pnpm --filter api test

# database-backed test
# PowerShell:
$env:RUN_DB_TESTS='1'; pnpm --filter api test
# POSIX:
RUN_DB_TESTS=1 pnpm --filter api test

# Prisma
pnpm --filter api prisma:migrate
pnpm --filter api prisma:seed
pnpm --filter api prisma:studio
```

The API reads environment variables from the process environment. Copy
`.env.example` for reference and inject the values through your process
manager, Docker, or Node's `--env-file` option. The API intentionally does not
add a dotenv dependency.

## Environment

| Variable | Default (non-production) | Notes |
| --- | --- | --- |
| `NODE_ENV` | `development` | `development`, `test`, or `production` |
| `PORT` | `3001` | HTTP port |
| `HOST` | `0.0.0.0` | Listen address |
| `DATABASE_URL` | local PostgreSQL URL | Required in production |
| `JWT_SECRET` | dev-only secret | Minimum 32 characters; required in production |
| `JWT_EXPIRES_IN` | `2h` | `45s`, `30m`, `2h`, `14d`, `1w` |
| `REFRESH_TTL_DAYS` | `14` | Refresh session lifetime in days |
| `CORS_ORIGIN` | `http://localhost:5173` | Comma-separated origins, or `*` |
| `REDIS_URL` | unset | Optional Redis connection string |
| `LOG_LEVEL` | `info` | Pino log level |
| `ARGON2_MEMORY_COST` | `19456` | KiB of memory per hash |
| `ARGON2_TIME_COST` | `2` | Argon2 iterations |
| `ARGON2_PARALLELISM` | `1` | Argon2 lanes |
| `ARGON2_HASH_LENGTH` | `32` | Derived key length in bytes |

Production startup fails fast if `DATABASE_URL` or `JWT_SECRET` is missing.
Development and test use safe fallbacks so the module can be imported without a
database or secret.

## Authentication flow

1. `POST /api/auth/login` accepts `{ login, password, portal }`, where `login`
   is an email or phone number. The portal must be `admin_portal` or `private`.
2. The user is looked up by email (case-insensitive) or phone. Passwords are
   verified with argon2id. Legacy `pbkdf2$...` and `scrypt$...` hashes from the
   prototype are also verified and transparently rehashed to argon2id after a
   successful login. Plain-text passwords are not accepted.
3. The account must be active, the requested portal must match `User.portal`,
   and the role must belong to that portal. Admin portal roles: `director`,
   `deputy`, `supervisor`, `clerk`, `admin`. Private portal roles: `teacher`,
   `parent`, `student`. A mismatch returns `403 portal_mismatch`.
4. A `Session` row is created with `refreshHash = sha256(refreshToken)`,
   `expiresAt`, and a UUID id. The opaque refresh token is 48 random bytes
   encoded as base64url and is never stored in plain form.
5. An access JWT is signed with `{ sub, role, portal, scope, name, email, sid }`
   and a 2-hour default lifetime. `sid` identifies the session for logout.
6. The response is:
   ```json
   {
     "ok": true,
     "token": "<jwt>",
     "refreshToken": "<opaque token>",
     "expiresIn": 7200,
     "user": {
       "id": "u_dir",
       "name": "Director",
       "email": "director@ryad.ma",
       "role": "director",
       "portal": "admin_portal",
       "scope": {}
     }
   }
   ```
7. `POST /api/auth/refresh` hashes the supplied refresh token, checks that the
   session is unrevoked, unrotated, and unexpired, then atomically revokes the
   old session and creates a new one. It returns a new token pair. Invalid,
   expired, or already-rotated tokens return `401 invalid_refresh`.
8. `GET /api/auth/me` requires a bearer token and returns the current user.
9. `POST /api/auth/logout` revokes the session referenced by the access token's
   `sid`. `POST /api/auth/logout-all` revokes every active session for the user.
   Access JWTs remain valid until expiry; revoking the session prevents future
   refresh-token use.

`app.authenticate` verifies the JWT signature/expiry, loads the user once from
the database, rejects inactive or deleted accounts, and attaches the current
`role`, `portal`, and normalized `scope` to `request.user`. `app.requirePortal`
and `app.requireRoles` are guards to chain after authenticate.

### Scope shapes

```json
{ "classIds": ["c1"], "levelIds": ["l1"] }   // teacher
{ "childIds": ["s1", "s2"] }                  // parent
{ "studentId": "s1" }                         // student (self only)
{ "all": true }                               // future admin-wide access
```

The prototype aliases `classes`, `levels`, and `children` are accepted by
`normalizeScope` so migrated records keep working. `assertScope` throws a 403
`forbidden` error when a student or class is outside the caller's scope.

## Authorization helpers

- `canAccessClass(scope, classId, levelId?)`
- `canAccessStudent(scope, { id, classId, levelId })`
- `assertScope(scope, { studentId, student, classId, levelId })`
- `roleBelongsToPortal(role, portal)`

For student users to be limited to themselves, their `scope` must contain
`studentId` (or `selfId`).

## Error format

All API errors use:

```json
{ "ok": false, "error": "code", "message": "Human-readable message" }
```

- Zod validation failures: `400 validation_error` (includes `details.fieldErrors`)
- Missing/invalid/expired JWT, inactive user: `401 unauthorized`
- Wrong portal or role: `403 portal_mismatch` / `403 forbidden`
- Prisma `P2002`: `409 conflict`
- Prisma `P2025`: `404 not_found`
- Unknown routes: `404 not_found`
- Rate limit (200 requests/minute): `429 rate_limited`
- Unexpected failures: `500 internal_error`

## Health and version

- `GET /api/health` always returns HTTP 200 for liveness. `database` is
  `connected` or `disconnected` after a `SELECT 1`; `redis.enabled` indicates
  whether `REDIS_URL` is configured.
- `GET /api/version` returns the API version and environment.

## Tests

`tests/auth.test.ts` uses `buildApp()` and supertest. The default suite never
needs PostgreSQL or Redis: it checks health, version, login body validation,
unauthenticated `/me`, and the JSON 404 handler. Database-backed login tests are
skipped unless `RUN_DB_TESTS=1`.

Jest requires `ts-jest`, `@types/jest`, and `@types/supertest`, which were added
to `devDependencies`. They are not installed by this change.

## Operational notes and next steps

- Run `prisma generate` after installing dependencies and after schema changes.
- Create a seed/migration for legacy users. Legacy plain-text passwords are
  rejected by design; hash them with `hashPassword` or seed PBKDF2/scrypt
  hashes that will be upgraded on first login.
- Add a scheduled cleanup for expired/revoked `Session` rows.
- Add per-route rate limits, password reset, 2FA, and refresh-token reuse
  detection that revokes the whole session family.
- Add OpenAPI documentation and integration tests against a disposable
  PostgreSQL database.
- Keep CORS origins explicit in production; `*` reflects the request origin
  and is intended for development only.
