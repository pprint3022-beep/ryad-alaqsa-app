# API verification report

Workspace (run directory): `ryad-alaqsa-app/apps/api`
Date: 2026-11-19
Node/npm: Node >=20, npm 11.20.0

## Environment note

This package is part of a monorepo with a root `package.json` that declares
`workspaces: ["apps/*", "packages/*", "services/*"]`. Running `npm install`
from `apps/api` therefore hoists/uses the root `node_modules`
(`ryad-alaqsa-app/node_modules`). No `pnpm` was used.

---

## 1. Install

Command:
```
npm.cmd install --no-audit --no-fund
```

Result: **SUCCESS** (`EXIT=0`, "up to date in 3s").

Notes:
- npm emitted non-fatal warnings that install scripts for 6 packages
  (`@prisma/client`, `@prisma/engines`, `argon2`, `prisma`, two `esbuild`
  versions) are not covered by the configured `allowScripts` allow-list.
- Dependencies resolve from the hoisted root `node_modules` (prisma,
  @prisma/client, typescript, jest, ts-jest, tsx, fastify, argon2 all present).

## 2. Prisma generate

Commands:
```
$env:DATABASE_URL='postgresql://postgres:postgres@localhost:5432/ryad'; npx.cmd prisma validate
$env:DATABASE_URL='postgresql://postgres:postgres@localhost:5432/ryad'; npx.cmd prisma generate
```

Result: **PASS** — `The schema at prisma/schema.prisma is valid 🚀` and
`Generated Prisma Client (v5.22.0) to ../../node_modules/@prisma/client`.

History: the first run failed with P1012 because 12 relation fields had no
opposite back-relation. The schema owner then added back-relations on `Level`,
`Subject`, `CompetencyReference`, `User`, `Student` and `FeedbackCard` (plus the
new first-class `Assessment`, `Grade`, `Attendance`, `Assignment` and
`Submission` models), and both commands were re-run successfully.

Independent typecheck of the seed script (excluded from `tsconfig.json`):
```
npx.cmd tsc --noEmit --target ES2022 --module commonjs --moduleResolution node --esModuleInterop --skipLibCheck --types node prisma/seed.ts
```
Result: **PASS** (no diagnostics).

## 3. TypeScript

Command:
```
$env:DATABASE_URL='postgresql://postgres:postgres@localhost:5432/ryad'; npx.cmd tsc --noEmit
```

Result: **PASS** (`EXIT=0`, no diagnostics). No type errors in `src/` or the
included files; `tsconfig.json` excludes `tests/` (ts-jest type-checks tests at
runtime with `isolatedModules`).

## 4. Jest

Command:
```
$env:DATABASE_URL='postgresql://postgres:postgres@localhost:5432/ryad'; $env:NODE_ENV='test'; npx.cmd jest --runInBand
```

Result: **PASS** (`EXIT=0`).
```
Test Suites: 1 passed, 1 total
Tests:       1 skipped, 6 passed, 7 total
Snapshots:   0 total
```
- All 6 non-DB "API foundation" tests passed.
- The single DB-dependent test group (`auth with a database`) was skipped as
  designed — it is gated behind `RUN_DB_TESTS=1` and no PostgreSQL server is
  available (health check logs `Can't reach database server at localhost:5432`
  but the endpoint correctly reports `database: "disconnected"` and returns
  200, so this is not a failure).
- Non-fatal warning (fixed after the first run): ts-jest reported `isolatedModules`
  as deprecated in the transform config. It was moved to `tsconfig.json` and
  removed from `jest.config.cjs`; the suite now runs without that warning.

No code-caused test failures; no source/test fixes were required in `src/`
or `tests/`.

## 5. package.json seed config

Added (it was absent), in `apps/api/package.json`:
```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

---

## 6. Domain API extension

Registered `domainRoutes` in `src/index.ts` (after auth/health) and added
`src/routes/domain.ts`. Every route requires a bearer token, revalidates the
user against Prisma on each request, and checks that role/portal agree.

Routes (all return `{ ok: true, ...data }` or
`{ ok: false, error, message }`):

| Method | Path | Access / scope |
| --- | --- | --- |
| GET | `/api/students` | Both portals; teacher = own classes, parent = own children, student = self, admin = all unless scope narrows |
| GET | `/api/classes` | Both portals; same class/level scope rules |
| GET | `/api/reports/overview` | Both portals; aggregate counts scoped to caller |
| GET / POST | `/api/attendance` | GET scoped; POST teachers + admin-portal staff, status enum checked, class scope asserted, bulk `entries[]` |
| GET / POST | `/api/grades` | GET scoped; POST teachers + admin-portal staff, score within `[0, scale]`, bulk `entries[]` |
| GET / PATCH | `/api/feedback-cards` / `/api/feedback-cards/:id` | GET scoped; PATCH admin_portal only, validated status transitions + history + audit |
| GET / PATCH | `/api/cases` / `/api/cases/:id` | GET scoped; PATCH admin_portal only, validated status transitions + audit |
| POST | `/api/cases/:id/timeline` | admin_portal only, scoped to case student |
| GET / POST | `/api/communications` | GET scoped; POST admin_portal only, stored as `draft` |
| POST | `/api/communications/:id/send` | admin_portal only; requires recorded human `approval` **and** `consent` in governance before `sent`; advisory ML output can never satisfy the gate |
| GET | `/api/audit-logs` | admin_portal only; filterable/paginated |

Notes:
- `admin_portal` vs `private` separation is enforced by `requirePortal` on
  staff-only endpoints and by `roleBelongsToPortal` on every domain route.
- Teacher/parent/student read access is enforced by Prisma `where` filters
  derived from `User.scope` (`classIds`/`levelIds`, `childIds`, `studentId`),
  using the canonical and legacy alias fields in `plugins/rbac.ts`.
- Writes call `assertScope`, so a teacher cannot record attendance/grades for a
  class or student outside scope (HTTP 403 `forbidden`).
- Advisory ML output is persisted only under `governance.advisory`; it is never
  written to approval/consent/decision fields.

Verification run (final):

```
$env:DATABASE_URL='postgresql://postgres:postgres@localhost:5432/ryad'; npx.cmd tsc --noEmit
```
Result: **PASS** (no diagnostics).

```
$env:DATABASE_URL='postgresql://postgres:postgres@localhost:5432/ryad'; $env:NODE_ENV='test'; npx.cmd jest --runInBand
```
Result: **PASS**.
```
Test Suites: 2 passed, 2 total
Tests:       1 skipped, 19 passed, 20 total
Snapshots:   0 total
```
- `tests/domain.test.ts` uses `jest.mock('../src/lib/prisma')` (no database).
  It covers scope enforcement (teacher/parent/student/admin), attendance status
  validation and out-of-scope rejection, feedback status transitions (valid +
  invalid), the communication approval+consent send gate (including an advisory-
  only attempt), and audit-log writes/admin reads.
- The existing DB-gated suite (`auth with a database`) stays skipped; the
  non-fatal DB-unreachable log from the health test is unchanged.

### 6.1 Feedback-card transition alignment (2026-11-19)

The `CARD_TRANSITIONS` map in `apps/api/src/routes/domain.ts` was aligned with
the human-review workflow used by the web card-review center and the JSON
prototype. The UI offers these transitions, and the production API now accepts
exactly the same set:

| From | Allowed next statuses |
|---|---|
| `proposed` | `approved`, `rejected`, `in_progress` |
| `approved` | `in_progress`, `rejected` |
| `in_progress` | `completed`, `rejected` |
| `rejected` | terminal |
| `completed` | terminal |

Previously the production map omitted `proposed → in_progress` and
`in_progress → rejected` and allowed `rejected → proposed`. Those two UI
buttons would have returned `409 invalid_transition`; they now succeed, while
`rejected` and `completed` remain terminal everywhere. Every accepted
transition still writes history and an audit entry, and the advisory-only /
human-review rule is unchanged.

Final verification after this change (2026-11-19):
- `npx.cmd tsc --noEmit` — **PASS** (no diagnostics).
- `npx.cmd jest --runInBand` — **PASS** (`Test Suites: 2 passed`,
  `Tests: 1 skipped, 19 passed, 20 total`). The illegal-transition test
  (`proposed → completed`) and the legal-transition test (`proposed → approved`)
  in `tests/domain.test.ts` both remain green.

---

## Files changed

- `apps/api/package.json` — added the `prisma.seed` config block.
- `apps/api/VERIFICATION.md` — this report (section 6 added for the domain API).
- `apps/api/prisma/schema.prisma` — added missing back-relations and the five
  core learning models (done by the schema owner after the first verification).
- `apps/api/src/index.ts` — registers `domainRoutes`.
- `apps/api/src/routes/domain.ts` — new scoped, RBAC-protected domain API
  (students, classes, reports, attendance, grades, feedback cards, cases,
  communications, audit logs); `CARD_TRANSITIONS` aligned with the UI/prototype
  workflow on 2026-11-19 (see section 6.1).
- `apps/api/tests/domain.test.ts` — new mocked-Prisma tests for the domain API.

## Blockers

1. **No PostgreSQL server** at `localhost:5432`, so the `RUN_DB_TESTS` DB test
   and any seed run were intentionally skipped. Once a database is available:
   ```
   $env:DATABASE_URL='postgresql://.../ryad'; npx.cmd prisma migrate dev
   $env:DATABASE_URL='postgresql://.../ryad'; npx.cmd prisma db seed
   ```
2. A cosmetic DB-unreachable log appears from the health test; the endpoint still
   returns 200 with `database: "disconnected"`.
