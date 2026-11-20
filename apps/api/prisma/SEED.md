# Seed & prototype migration — Ryad Al Aqsa

`apps/api/prisma/seed.ts` migrates the working prototype data in
`backend/data.json` into PostgreSQL through Prisma. It is a **seed**, not a
schema migration: apply the Prisma schema first, then run the seed.

The script is intentionally conservative:

- upserts by primary key, so it is safe to re-run;
- copies legacy password hashes verbatim;
- never invents a database column;
- reports every collection it reads, writes, or skips;
- exits non-zero on a fatal error (missing data file, invalid JSON, unavailable
  Prisma client, database failure).

---

## 1. Prerequisites

| Requirement | Details |
|---|---|
| Node.js | 20 LTS or newer (`node:crypto`, `fs`, `path` only) |
| pnpm | 9+ |
| PostgreSQL | 16 (the schema uses `Json`, `String[]`, and PostgreSQL enums) |
| Prisma CLI | Installed in `apps/api` (`prisma` 5.10) |
| Database | Empty database, or one already owned by this seed |
| Backup | Take a backup before seeding production |

The seed has **no dependency** other than `@prisma/client`.

### Important: the schema must validate

The seed is generated against `apps/api/prisma/schema.prisma`. It never patches
the schema and never runs raw DDL.

Before seeding, confirm:

```bash
cd apps/api
pnpm exec prisma validate
pnpm exec prisma generate
```

At the time of writing, `prisma validate` still reports Prisma **P1012**
“missing an opposite relation field” for several one-to-many relations
(`Level`/`Curriculum`, `Level`/`CompetencyReference`, `Subject`/`StudentCompetency`,
`User`/`FeedbackCard`, `User`/`Case`, `Student`/`AgentRun`, and others). Those
back-relations are owned by the schema owner. `prisma generate` and the seed
will fail until they are added; the seed deliberately does not work around an
invalid schema.

The academic models (`Assessment`, `Grade`, `Attendance`, `Assignment`,
`Submission`) **are** part of the schema and are seeded.

---

## 2. Commands

Run from the repository root.

```bash
# 1. Install dependencies
pnpm install

# 2. Create/update the database schema
pnpm --filter api exec prisma migrate deploy
# development only:
# pnpm --filter api exec prisma migrate dev

# 3. Generate the client against the current schema
pnpm --filter api prisma:generate

# 4. Seed (current package script; works today)
pnpm --filter api prisma:seed

# 5. Re-run any time; upserts are idempotent
pnpm --filter api prisma:seed
```

`apps/api/package.json` currently defines the working script as
`"prisma:seed": "tsx prisma/seed.ts"`.

Prisma's standard entry point requires a `prisma.seed` block in
`apps/api/package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Once that block is added by the package owner, the requested form also works:

```bash
pnpm --filter api prisma db seed
# or, if pnpm does not resolve the binary for that form:
pnpm --filter api exec prisma db seed
```

Direct invocation from `apps/api`:

```bash
pnpm exec tsx prisma/seed.ts
```

### From a different working directory

`SEED_DATA_FILE` is resolved as follows:

| Value | Resolution |
|---|---|
| unset | `../../../backend/data.json` relative to `apps/api/prisma/seed.ts` |
| absolute path | used as-is |
| relative path | resolved from the process working directory |

```bash
# macOS / Linux
SEED_DATA_FILE=/srv/ryad/data.json pnpm --filter api prisma:seed

# PowerShell
$env:SEED_DATA_FILE = "C:\srv\ryad\data.json"
pnpm --filter api prisma:seed
```

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection string, e.g. `postgresql://postgres:postgres@localhost:5432/ryad_alaqsa?schema=public` |
| `SEED_DATA_FILE` | no | Alternative JSON source; defaults to `backend/data.json` |
| `NODE_ENV` | no | Not used by the seed |

Do not commit `.env` or production credentials. See `apps/api/.env.example`.

---

## 3. What the seed reads and writes

The source file has 43 top-level keys. Collections are processed in dependency
order so foreign keys exist before dependants.

### Migrated

| `data.json` | Prisma model | Notes |
|---|---|---|
| `users` | `User` | Legacy hashes copied; plain-text passwords hashed to scrypt; `delegations` preserved inside `scope` |
| `levels` | `Level` | `order` preserved |
| `classes` | `Class` | `teacherId` derived from the teacher's `scope.classes` |
| `subjects` | `Subject` | |
| `students` | `Student` | `profile` JSON preserved; invalid `guardianId` becomes `NULL` |
| `assignments` | `Assignment` | `dueDate`, `teacherId`; status normalised to `open`/`closed`/`archived` |
| `submissions` | `Submission` | `grade`/`feedback`; unique `(assignmentId, studentId)` |
| `grades` | `Grade` | `score`/`scale`, `term`, `teacherId`; `createdAt` used as `date` fallback |
| `attendance` | `Attendance` | status normalised to `present`/`late`/`absent`/`excused` |
| `assessments` | `Assessment` | subject name → `subjectId`; `refId` matched by `(subject, refSkill)`; `level` → `levelName` |
| `curriculum` | `Curriculum` | `lessons[]`, `status`, `language`, `createdAt` |
| `competencyReferences` | `CompetencyReference` | `level` → `levelName`; `levelId` resolved by level name |
| `competencies` | `StudentCompetency` | `refId` validated |
| `feedbackCards` | `FeedbackCard` | `date` → `createdAt`; `assignee` → `assigneeId`; `actions` stays JSON |
| `feedbackCards[].history` | `FeedbackCardHistory` | Created only when an identical row is absent |
| `cases` | `Case` | `openedAt`, `nextReview`, owner |
| `cases[].timeline` | `CaseTimeline` | `date` → `eventDate`; `by` → `byUser` |
| `talents` | `Talent` | |
| `learningPaths` | `LearningPath` | Prototype has no id; stable deterministic id generated |
| `interventions` | `Intervention` | |
| `alerts` | `Alert` | |
| `activities` | `Activity` | |
| `activityEnrollments` | `ActivityEnrollment` | Duplicate `(studentId, activityId)` pairs are collapsed |
| `agentProfiles` | `AgentProfile` | |
| `agentRuns` | `AgentRun` | `agent` → `agentId`; `target` → `Student` relation |
| `evidence` | `Evidence` | |
| `publications` | `Publication` | |
| `library` | `LibraryResource` | |
| `drafts` | `Draft` | |
| `communications` | `Communication` | `by` → `byUser`; `at` → `createdAt`; `governance` JSON preserved |
| `impactLog` | `ImpactLog` | |
| `wellbeingCheckins` | `WellbeingCheckin` | |
| `mentoringPairs` | `MentoringPair` | |
| `staff` | `Staff` | |
| `goals` | `Goal` | |
| `competitors` | `Competitor` | Prototype has no id; stable deterministic id generated |
| `partnerships` | `Partnership` | Prototype has no id; stable deterministic id generated |
| `strategy` | `Strategy` | Single row, id `default` |
| `finance` | `Finance` | Single row, id `default`; `monthly`/`categories` JSON |
| `calendarEvents` | `CalendarEvent` | Optional; key is absent in the current data |
| `auditLogs` | `AuditLog` | Read-only history; `details` JSON preserved |
| `engagementLog` | `EngagementLog` | |
| `contentSamples` | `ContentSample` | Prototype has no id; id generated as `cs_<levelId>` |
| `languageConfig` | `LanguageConfig` | Single row, id `default` |

### Intentionally not migrated

| Collection | Reason |
|---|---|
| `sessions` | Prototype stores **plaintext refresh tokens**. Migrating them would carry compromised credentials into production; users must sign in again |
| `retentionPolicy` | No settings/retention table in the schema; keep this policy in deployment configuration |

`retentionPolicy` is counted as `skipped` in the summary. It is not silently
dropped, and the value remains in `backend/data.json`.

---

## 4. Field mapping decisions

### Preserved inside a JSON column

| Source field | Destination | Why |
|---|---|---|
| `users[].delegations` | `User.scope.delegations` | `User` has no profile JSON column; `scope` is the only JSON field |
| `students[].profile` | `Student.profile` | Already JSON |
| `feedbackCards[].actions` | `FeedbackCard.actions` | Already JSON; unrelated extra fields are not stuffed into this array |
| `communications[].governance` | `Communication.governance` | Already JSON |
| `auditLogs[].details` | `AuditLog.details` | Already JSON |
| `strategy.initiatives` | `Strategy.initiatives` | Already JSON |
| `finance.monthly`, `finance.categories` | `Finance.monthly`, `Finance.categories` | Already JSON |
| `languageConfig.languageNames` | `LanguageConfig.languageNames` | Already JSON |

### Derived values (not invented columns)

- **Class teacher**: the prototype has no `teacherId` on classes. The seed picks
  the first user with `role = teacher` whose `scope.classes` contains the
  class. If no teacher covers it, `teacherId` stays `NULL`.
- **Learning-path id**: `lp_<studentId>_<sha1(type|focus|nextSteps)[0..12]>`.
  This is deterministic, so re-runs update the same row.
- **Competitor / partnership ids**: deterministic SHA-1 suffixes because the
  prototype rows have no ids.
- **Content-sample id**: `cs_<levelId>`.
- **Communication `sentAt`**: set to `at` only when `status = sent`; `sentBy`
  is taken from `governance.approvedBy`. Otherwise both stay `NULL`.
- **Publication `publishedAt`**: `publishedAt` if present; otherwise
  `reviewedAt`, then the publication `date`, when status is `published`.
- **Assessment subject/reference**: the prototype stores names, not ids.
  `subject` is resolved against `Subject.name`; `refId` is resolved against
  `CompetencyReference (subject, skill)`. An unmatched name leaves the relation
  `NULL` while keeping `subjectName`/`refSkill`.
- **Grade date**: prototype grades have `createdAt` but not `date`; the seed
  uses `date` if present, otherwise `createdAt`, otherwise the current time.
- **Attendance/assignment/submission status**: unknown values fall back to the
  schema's default-safe value (`present`, `open`, `pending`) instead of
  failing the whole seed.

### Fields skipped with a logged note

- `publications[].studentId` — no column on `Publication`; kept only in
  `backend/data.json`.
- `publications[].reviewedAt` — no column; used only as a `publishedAt`
  fallback.
- `feedbackCards[].date` — mapped to `createdAt`, so it is not lost.
- `cases[].timeline[].type` — absent in the prototype; left `NULL`.
- `sessions` / `retentionPolicy` — see §3.

The seed prints a per-collection note whenever a source field cannot be stored.

---

## 5. Passwords and authentication

The prototype uses two hashing formats plus plain text:

```text
pbkdf2$<iterations>$<salt-hex>$<hash-hex>
scrypt$<N>$<r>$<p>$<salt-hex>$<hash-hex>
```

Behaviour:

1. If the stored value starts with `scrypt$`, `pbkdf2$`, or `$argon2`, it is
   copied **verbatim**.
2. If the value is plain text (for example the demo password `1234`), the seed
   hashes it with Node's `crypto.scryptSync` using the prototype parameters:
   - `N = 16384`, `r = 8`, `p = 1`
   - 16-byte random salt, hex encoded
   - 64-byte derived key, hex encoded
   - output: `scrypt$16384$8$1$<salt>$<hash>`
3. On re-runs, plain-text source passwords are hashed **only on create**. The
   `update` payload omits `password`, so an existing database password is not
   reset.
4. The API's `verifyPassword()` already accepts `scrypt$` and `pbkdf2$`, then
   upgrades to Argon2id after a successful login (`needsRehash`).

Current data contains 18 plain-text demo accounts with password `1234`.
**Change or disable these accounts before production.**

---

## 6. Idempotency and re-run behaviour

- Every table is written with `upsert` keyed by `id`.
- `FeedbackCardHistory` and `CaseTimeline` use auto-increment ids. The seed
  looks for an identical `(cardId, at, byUser, action, note)` or
  `(caseId, eventDate, event)` row first, then creates only when absent.
- Duplicate source ids are collapsed with **last occurrence wins** and reported.
  Current data duplicates `evidence.ev4` and `evidence.ev5`; the seed writes
  11 unique evidence rows from 13 source rows.
- Duplicate `(studentId, activityId)` enrolments are collapsed.
- The seed **never deletes** rows. If a record is removed from `data.json`, it
  remains in the database. Reconciliation requires an explicit, reviewed
  cleanup step — do not truncate production tables blindly.
- `createdAt`/`updatedAt` values are preserved when the source has them. Rows
  without a source date fall back to the database default or the current time.

### Expected summary

The script prints a table like:

```text
Collection            Model                    Read   Written   Skipped  Note
--------------------  ---------------------  ------  --------  --------  ----
users                 user                       22        22         0
assignments           assignment                 11        11         0
submissions           submission                  2         2         0
grades                grade                      73        73         0
attendance            attendance                 94        94         0
assessments           assessment                 40        40         0
...
sessions              Session (intentional)     124         0       124  Not migrated ...
retentionPolicy       (no model)                  1         0         1  No settings table ...
```

The summary is authoritative for the data file used. Exact counts change when
`backend/data.json` changes (the prototype app appends audit/session rows while
running).

`Written` counts unique upserts, so a re-run normally writes the same number of
rows again (updates, not duplicates).

---

## 7. Verification queries

Connect with `psql "$DATABASE_URL"` and run:

```sql
-- High-level row counts
SELECT 'User' AS table_name, count(*) FROM "User"
UNION ALL SELECT 'Level', count(*) FROM "Level"
UNION ALL SELECT 'Class', count(*) FROM "Class"
UNION ALL SELECT 'Subject', count(*) FROM "Subject"
UNION ALL SELECT 'Student', count(*) FROM "Student"
UNION ALL SELECT 'Assignment', count(*) FROM "Assignment"
UNION ALL SELECT 'Submission', count(*) FROM "Submission"
UNION ALL SELECT 'Grade', count(*) FROM "Grade"
UNION ALL SELECT 'Attendance', count(*) FROM "Attendance"
UNION ALL SELECT 'Assessment', count(*) FROM "Assessment"
UNION ALL SELECT 'Curriculum', count(*) FROM "Curriculum"
UNION ALL SELECT 'CompetencyReference', count(*) FROM "CompetencyReference"
UNION ALL SELECT 'StudentCompetency', count(*) FROM "StudentCompetency"
UNION ALL SELECT 'FeedbackCard', count(*) FROM "FeedbackCard"
UNION ALL SELECT 'FeedbackCardHistory', count(*) FROM "FeedbackCardHistory"
UNION ALL SELECT 'Case', count(*) FROM "Case"
UNION ALL SELECT 'CaseTimeline', count(*) FROM "CaseTimeline"
UNION ALL SELECT 'LearningPath', count(*) FROM "LearningPath"
UNION ALL SELECT 'ActivityEnrollment', count(*) FROM "ActivityEnrollment"
UNION ALL SELECT 'AgentRun', count(*) FROM "AgentRun"
UNION ALL SELECT 'Evidence', count(*) FROM "Evidence"
UNION ALL SELECT 'AuditLog', count(*) FROM "AuditLog"
ORDER BY table_name;
```

```sql
-- No user may retain a plain-text password (all rows must match a hash prefix)
SELECT id, email
FROM "User"
WHERE password NOT LIKE 'scrypt$%'
  AND password NOT LIKE 'pbkdf2$%'
  AND password NOT LIKE '$argon2%';

-- Legacy scrypt format sanity check
SELECT id, split_part(password, '$', 1) AS scheme
FROM "User"
WHERE password LIKE 'scrypt$%'
LIMIT 5;

-- Every feedback card should have at least its creation history entry
SELECT c.id, count(h.id) AS history_rows
FROM "FeedbackCard" c
LEFT JOIN "FeedbackCardHistory" h ON h."cardId" = c.id
GROUP BY c.id
HAVING count(h.id) = 0;

-- Timeline ordering / count per case
SELECT "caseId", count(*) AS events, min("eventDate") AS first_event, max("eventDate") AS last_event
FROM "CaseTimeline"
GROUP BY "caseId"
ORDER BY "caseId";

-- Classes without a derived teacher (expected where no teacher scope covers them)
SELECT c.id, c.name
FROM "Class" c
LEFT JOIN "User" u ON u.id = c."teacherId"
WHERE c."teacherId" IS NULL;

-- Evidence unique ids after collapsing prototype duplicates
SELECT id, count(*)
FROM "Evidence"
GROUP BY id
HAVING count(*) > 1;

-- Submission uniqueness (also enforced by @@unique)
SELECT "assignmentId", "studentId", count(*)
FROM "Submission"
GROUP BY "assignmentId", "studentId"
HAVING count(*) > 1;

-- Assessments whose subject name could not be resolved to Subject.name
SELECT id, "subjectName", "refSkill"
FROM "Assessment"
WHERE "subjectId" IS NULL;

-- Learning-record status distributions
SELECT 'Attendance' AS model, status::text, count(*) FROM "Attendance" GROUP BY status
UNION ALL
SELECT 'Assignment', status::text, count(*) FROM "Assignment" GROUP BY status
UNION ALL
SELECT 'Submission', status::text, count(*) FROM "Submission" GROUP BY status
ORDER BY model, status;
```

Prisma FK constraints already reject orphan rows, so the important checks are
semantic: duplicate histories, plain-text passwords, unresolved assessment
subjects, and duplicate submissions.

To verify login with a legacy hash, use the API development server:

```bash
pnpm --filter api dev
# POST /api/auth/login with a migrated account and its prototype password
```

---

## 8. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `Prisma client is missing delegate(s): ...` | Run `pnpm --filter api prisma:generate` after the schema is complete |
| `No seed command configured` | `prisma db seed` needs the `prisma.seed` block; use `pnpm --filter api prisma:seed` instead |
| `P2002` unique constraint | Duplicate `User.email`, `Level.name`, `Subject.name`, an enrolment pair, or a `(assignmentId, studentId)` submission outside this seed |
| `P2003` foreign key | Source rows reference an id that was skipped; check the summary's `skipped` column and the validation notes |
| Legacy login fails | Confirm the stored value starts with `scrypt$`/`pbkdf2$` and that `apps/api/src/lib/password.ts` is the deployed verifier |
| Counts differ from `data.json` | Duplicate ids are collapsed by design; re-run and compare the `Read` vs `Written` columns |

## 9. Production checklist

- [ ] `prisma validate` passes (including all opposite relation fields) and `prisma generate` succeeds
- [ ] Database backup taken and restore tested
- [ ] `DATABASE_URL` points at the intended database
- [ ] Seed run in staging and summary reviewed
- [ ] Demo accounts (`1234`) disabled or passwords rotated
- [ ] Sessions intentionally invalidated; users re-authenticate
- [ ] Verification queries above return no plain-text passwords and no
      missing feedback history
- [ ] Retention policy configured outside the database or in its future table
