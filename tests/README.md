# Prototype test suites

Two black-box end-to-end suites exercise the legacy JSON-backed prototype
(`backend/server.js`). Both start their own server on an isolated port, use the
demo password `1234`, and only write through documented API routes.

| File | Scope | Checks |
| --- | --- | --- |
| `prototype-smoke.js` | Auth, portals, RBAC, reports, refresh rotation | 41 |
| `prototype-extended.js` | Wider product surface listed below | 136 |

## Running the extended suite

Requirements: Node.js >= 20, no extra dependencies, and a free port (default
`3198`). The suite starts its own server on port 3198 and never touches a
server already running on port 3001.

```bash
node tests/prototype-extended.js
```

Use another port if `3198` is taken:

```bash
EXTENDED_TEST_PORT=3199 node tests/prototype-extended.js        # bash
$env:EXTENDED_TEST_PORT=3199; node tests/prototype-extended.js  # PowerShell
```

The script prints numbered `PASS` / `FAIL` / `SKIP` lines, a summary, the
request count, and the mutations it made. It exits `1` if any check fails and
`0` when everything passes or is skipped. A typical run takes about 2 seconds
and sends 132 HTTP requests, well below 200 requests/minute.

`SKIP` is reserved for checks that depend on optional seed data being absent.
Assertions are never weakened to turn a failure into a skip; the reason is
always printed.

## Coverage

| Checks | Area |
| --- | --- |
| 01-08 | Admin/private login, portal mismatch, cross-portal token rejection, unauthenticated access, refresh-token rotation |
| 09-18 | Feedback cards: scoped create, scoped list, teacher propose, admin approve/start/complete, audit trail, 404s, cross-teacher scope, state-machine rejection with no mutation |
| 19-26 | Cases: scoped create, admin/teacher visibility, field updates, timeline append and ordering, scope enforcement |
| 27-34 | Communications: governed draft creation, draft/approval/consent gates, send, send audit |
| 35-39 | Bulk grades: atomic rollback of a mixed batch, valid batch shape, report visibility, out-of-scope rejection, empty batch, required-field/type/range validation |
| 40-43 | Bulk import: student creation, class/search visibility, empty batch, validation/rollback |
| 44-47 | Wellbeing check-in, student history, teacher scope |
| 48-50 | Activity enrollment and duplicate-enrollment uniqueness |
| 51-52 | Mentoring pair creation and listing |
| 53 | Calendar event shape |
| 54-58 | Admin/teacher scoped search, out-of-scope hiding, empty query |
| 59-66 | Showcase submit, approve, publish, reject, public feed, review audit |
| 67-75 | ML gap prediction and early warning shape/scope, advisory-only behavior, experiment metadata, deterministic assignment via `GET .../assignment` and `POST .../assign` |
| 76-77 | Anonymized analytics: k-anonymity >= 3 and no PII/student IDs |
| 78-81 | Retention policy, apply, audit, `dryRun:true` preview with no writes/audit |
| 82-83 | Attendance: teacher bulk record, scoped read, admin visibility, atomic rejection of invalid/out-of-scope rows |
| 84-91 | Term-aware curriculum and filters, parallel-learning engagement/report data, term report cards, parent child report card, student library/report card, community activity labels |
| 92-97 | Question bank scoping/validation/archive, formative assessment create/publish/item-analysis, student take/submit/retry, role and portal separation |
| 98-103 | Weekly timetable: role-scoped slots, enriched attendance/homework links, admin lesson management and validation, role/portal separation |
| 104-109 | Family approval/privacy center: scoped requests and decisions, linked consent governance, retention/preferences, weekly summary separation, role/portal separation |
| 110-115 | Intervention plans: advisory warnings, scoped plans, human-authored create, weekly review with required notes and progress recompute, closing with notes, admin global oversight, role/portal separation |
| 116-121 | Two-way messaging: child-scoped threads, parent create linked to case/card, parent reply, governance/consent-gated teacher reply, close stops replies, role/portal separation |
| 122-127 | Lesson editor: scoped lesson plans, structured authoring and validation, draft→review submission, admin publish/return with role gates, CSV/JSON package export |
| 128-136 | Grading engine (weighted averages, approval, bulletin export) + lesson content and timed assessments |

## Known findings in the prototype

None of the previously documented gaps remain:

- **Create routes are present.** `POST /api/teacher/feedback-cards`,
  `POST /api/teacher/cases` and `POST /api/teacher/communications` create scoped,
  audited records; the existing update routes are unchanged.
- **Feedback-card state machine is enforced.** Teacher may only propose;
  approve/reject and `approved -> in_progress -> completed` are admin-only;
  terminal states cannot be reopened. Invalid transitions return HTTP 400
  `{error:'invalid_transition'}` without mutating the card.
- **Bulk writes are atomic.** Grades, student import and attendance validate
  required fields, types, ranges and scope for every row before any write.
  Invalid batches return HTTP 400 with per-row `results`/`errors` and change
  nothing; success keeps `{results,total,success}`.
- **Retention dry-run is supported.** `POST /api/admin/retention/apply` with
  `{"dryRun":true}` returns `{ok:true,dryRun:true,policy,removed,preview}`
  without deleting rows or writing an audit entry.
- **ML assignment API is exposed.** Assignment uses `ml.assignVariant`'s
  existing stable per-user logic via `GET /api/admin/ml/experiment/assignment`
  and `POST /api/admin/ml/experiment/assign` (optional `experimentId`, default
  `feedback_card_ui`). The JSON schema has no assignment collection, so
  assignments remain **in memory for the lifetime of the server process**
  (`source:'memory'`, `persisted:false`); they are lost on restart. This is the
  only remaining limitation, and it is asserted by check 75 rather than skipped.

## Data mutations

The extended suite mutates the live `backend/data.json` through the API. The
prototype has no delete routes, so created rows remain after the run. Each
entity carries a unique `QA ... <run-id>` marker, and seeded rows are restored
to a safe state where possible.

Back up before running and restore afterwards if you need a pristine demo:

```powershell
Copy-Item backend/data.json "$env:TEMP\ryad-data-backup-extended.json"
node tests/prototype-extended.js
# stop the test server, then:
Copy-Item "$env:TEMP\ryad-data-backup-extended.json" backend/data.json
```

Notable writes:

- login sessions for four accounts and a rotated admin refresh token
- a new feedback card created and moved `proposed -> approved -> in_progress -> completed`
- a new case created; seeded case `case_sara` fields updated and two timeline entries appended
- a new governed communication draft created; seeded communication sent; one draft reset/approved/granted and then sent
- two grades, two imported students, one wellbeing check-in, one activity
  enrollment, one mentoring pair, two showcase publications
- retention apply runs once (dry-run beforehand performs no writes)
- attendance: one valid row recorded; the invalid/out-of-scope batch writes nothing
- ML assignments stay in memory and do not touch `backend/data.json`
- one question created and archived; one formative assessment created as draft,
  analysed and published; two advisory submissions for `s_sara` on `fa_demo1`.

The demo question bank, formatives and attempts are reproducible with
`node scripts/seed-assessment-demo.js` (idempotent, guarded by
`demoAssessmentSeed`).

The suite never edits `backend/data.json` directly and does not modify
`backend/server.js`, `app.js`, or `prototype-smoke.js`. Invalid bulk batches
(which would otherwise corrupt the seed) are exercised without writes.

## Fixed defects (18 Nov 2026)

- `backend/server.js` resolves the actor id from the JWT `sub` claim via
  `actorId(auth)` everywhere, so approvals, audit entries and sent messages
  carry the real user id. Check 31 is green.
- `/api/showcase/review` has a single authorization response and checks portal
  + role + teacher scope explicitly; the previous double-403 crashed the
  server. Check 65 now exercises the unauthorized path safely.
- The public `/api/showcase` feed hides `pending_review` and `rejected` work.
  Check 60 is green.
- The eight documented prototype gaps (checks 09, 18, 19, 27, 39, 43, 75, 81)
  are closed and converted into real PASS/FAIL assertions. All 136 checks are
  now active; no SKIPs remain. Eight further checks (84–91) cover term-aware
  curriculum, parallel-learning engagement, report cards and scoped views; six
  more (92–97) cover the question bank and formative assessment flow; six
  more (98–103) cover the weekly timetable; six more (104–109) cover the
  family approval/privacy center and weekly summary; six more (110–115) cover
  intervention plans and weekly review; six more (116–121) cover two-way messaging
  linked to cases and cards; six more (122–127) cover the lesson editor and package export; nine more (128-136) cover the Moroccan grading engine, printable bulletin, real lesson content and timed exams.

## Current baseline

Actual run results on 19 Nov 2026:

- `node tests/prototype-smoke.js`: **41 checks - 41 PASS, 0 FAIL** ("ALL CHECKS PASSED").
- `node tests/prototype-extended.js`: **136 checks - 136 PASS, 0 FAIL, 0 SKIP**.
  Reruns are safe: every created entity carries a unique run marker, and checks
  that use seeded rows restore terminal state where possible.
