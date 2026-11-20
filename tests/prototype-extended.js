#!/usr/bin/env node
/**
 * Prototype extended end-to-end QA suite.
 *
 * Boots the legacy JSON-backed server on an isolated port (default 3198) and
 * exercises the wider prototype API: feedback-card lifecycle, cases,
 * communications governance, bulk imports/grades, digital showcase, wellbeing,
 * activities, mentoring, calendar, scoped search, ML advisory endpoints,
 * anonymized analytics, portal separation, refresh rotation and retention.
 *
 * Usage:
 *   node tests/prototype-extended.js
 *   EXTENDED_TEST_PORT=3198 node tests/prototype-extended.js
 *
 * Notes:
 * - All writes go through documented API routes. The suite never edits
 *   backend/data.json directly.
 * - The prototype has no delete endpoints for most entities, so the suite uses
 *   unique run markers and prints the exact mutations it made at the end.
 * - Results are reported as PASS / FAIL / SKIP. SKIP is reserved for checks
 *   that depend on optional seed data being absent; all documented prototype
 *   gaps (create routes, state machine, bulk rollback, retention dry-run and
 *   ML assignment API) now have real assertions, and every reason is printed.
 */
'use strict';

const { spawn } = require('node:child_process');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const PORT = Number(process.env.EXTENDED_TEST_PORT || 3198);
const BACKEND_DIR = path.join(__dirname, '..', 'backend');
const RUN = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
const DEMO_PASSWORD = '1234';

const LOGIN = {
  admin: { login: 'director@ryad.ma', password: DEMO_PASSWORD, portal: 'admin_portal' },
  teacher: { login: 'teacher@ryad.ma', password: DEMO_PASSWORD, portal: 'private' },
  parent: { login: 'parent@ryad.ma', password: DEMO_PASSWORD, portal: 'private' },
  student: { login: 'student@ryad.ma', password: DEMO_PASSWORD, portal: 'private' },
};

let server = null;
let serverLog = '';
let requestCount = 0;

const state = {
  adminToken: null,
  adminRefresh: null,
  teacherToken: null,
  parentToken: null,
  studentToken: null,
  teacherClasses: [],
  allowedClassIds: new Set(),
  allowedStudentIds: new Set(),
  teacherCards: [],
  adminCards: [],
  teacherCases: [],
  adminCases: [],
  communications: [],
  card: null,
  outCard: null,
  caseFile: null,
  outCase: null,
  inStudentA: null,
  inStudentB: null,
  outStudentId: null,
  lc: null,
  unapproved: null,
  consentComm: null,
  sendableComm: null,
  sentComm: null,
  insights: null,
  studentNames: [],
  pubA: null,
  pubB: null,
  adminWarnings: [],
  statsBefore: null,
  removed: null,
  createdCard: null,
  createdCase: null,
  createdComm: null,
  dryRunPreview: null,
  mutations: [],
};

const results = [];

class SkipError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SkipError';
  }
}

function skip(reason) {
  throw new SkipError(reason);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function brief(data) {
  if (data === undefined) return 'undefined';
  if (data === null) return 'null';
  try {
    const text = typeof data === 'string' ? data : JSON.stringify(data);
    return text.length > 260 ? `${text.slice(0, 260)}...` : text;
  } catch {
    return String(data);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertStatus(res, expected, label = 'request') {
  const allowed = Array.isArray(expected) ? expected : [expected];
  if (!allowed.includes(res.status)) {
    throw new Error(`${label}: expected HTTP ${allowed.join('/')} but got ${res.status} ${brief(res.data)}`);
  }
}

function assertNumber(value, name) {
  assert(typeof value === 'number' && Number.isFinite(value), `${name} must be a finite number (got ${brief(value)})`);
}

function addMutation(text) {
  state.mutations.push(text);
}

function request(method, pathname, token, body) {
  requestCount += 1;
  return new Promise((resolve) => {
    const payload = body === undefined ? null : JSON.stringify(body);
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    let settled = false;
    const done = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    const req = http.request(
      { hostname: '127.0.0.1', port: PORT, path: pathname, method, headers, timeout: 15000 },
      (res) => {
        let buf = '';
        res.on('data', (chunk) => { buf += chunk; });
        res.on('end', () => {
          if (!buf) return done({ status: res.statusCode, data: null });
          try { done({ status: res.statusCode, data: JSON.parse(buf) }); }
          catch { done({ status: res.statusCode, data: buf }); }
        });
      },
    );
    req.on('timeout', () => { req.destroy(new Error('request timeout')); });
    req.on('error', (err) => done({ status: 0, data: err.message }));
    if (payload !== null) req.write(payload);
    req.end();
  });
}

const get = (pathname, token) => request('GET', pathname, token);
const post = (pathname, token, body) => request('POST', pathname, token, body);

async function check(name, fn) {
  const id = results.length + 1;
  const label = String(id).padStart(2, '0');
  try {
    await fn();
    results.push({ id, name, status: 'PASS' });
    console.log(`PASS ${label} ${name}`);
  } catch (err) {
    if (err instanceof SkipError) {
      results.push({ id, name, status: 'SKIP', reason: err.message });
      console.log(`SKIP ${label} ${name} -- ${err.message}`);
    } else {
      results.push({ id, name, status: 'FAIL', reason: err.message });
      console.log(`FAIL ${label} ${name} -- ${err.message}`);
    }
  }
}

function portInUse() {
  return new Promise((resolve) => {
    const req = http.get({ hostname: '127.0.0.1', port: PORT, path: '/api/institution', timeout: 500 }, (res) => {
      res.resume();
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

function startServer() {
  server = spawn(process.execPath, ['server.js'], {
    cwd: BACKEND_DIR,
    env: { ...process.env, PORT: String(PORT), NODE_ENV: 'test' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const append = (chunk) => {
    serverLog = (serverLog + chunk.toString()).slice(-8000);
  };
  server.stdout.on('data', append);
  server.stderr.on('data', append);
}

async function waitForServer(timeoutMs = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (server && server.exitCode !== null) return false;
    const res = await request('GET', '/api/institution');
    if (res.status === 200) return true;
    await delay(200);
  }
  return false;
}

async function stopServer() {
  if (!server || server.exitCode !== null) return;
  server.kill();
  await Promise.race([
    new Promise((resolve) => server.once('exit', resolve)),
    delay(3000),
  ]);
  if (server.exitCode === null) {
    try { server.kill('SIGKILL'); } catch { /* already gone */ }
  }
}

function printSummary(startedAt) {
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL');
  const skipped = results.filter((r) => r.status === 'SKIP');

  console.log('\n=== PROTOTYPE EXTENDED QA ===');
  console.log(`Port: ${PORT} | Checks: ${results.length} | PASS: ${passed} | FAIL: ${failed.length} | SKIP: ${skipped.length}`);
  if (skipped.length) {
    console.log('\nSkipped (capability absent from the prototype API):');
    for (const item of skipped) console.log(`  SKIP ${String(item.id).padStart(2, '0')} ${item.name}: ${item.reason}`);
  }
  if (failed.length) {
    console.log('\nFailures:');
    for (const item of failed) console.log(`  FAIL ${String(item.id).padStart(2, '0')} ${item.name}: ${item.reason}`);
  }
  console.log(`\nRequests: ${requestCount} | Duration: ${((Date.now() - startedAt) / 1000).toFixed(1)}s`);
  console.log('\nMutations written through the API (persist in backend/data.json; no delete routes exist):');
  if (!state.mutations.length) console.log('  (none)');
  for (const text of state.mutations) console.log(`  - ${text}`);
  console.log('Reruns are safe: every created entity carries a unique run marker, and checks that use seeded rows restore terminal state where possible.');
}

async function loadFixtures() {
  const classesRes = await get('/api/teacher/classes', state.teacherToken);
  if (classesRes.status !== 200) throw new Error(`fixture teacher classes: HTTP ${classesRes.status} ${brief(classesRes.data)}`);
  state.teacherClasses = classesRes.data.classes || [];
  state.allowedClassIds = new Set(state.teacherClasses.map((c) => c.id));
  state.allowedStudentIds = new Set(
    state.teacherClasses.flatMap((c) => (c.students || []).map((s) => s.id)),
  );

  const teacherCardsRes = await get('/api/teacher/feedback-cards', state.teacherToken);
  if (teacherCardsRes.status !== 200) throw new Error(`fixture teacher cards: HTTP ${teacherCardsRes.status}`);
  state.teacherCards = teacherCardsRes.data.feedbackCards || [];

  const adminCardsRes = await get('/api/admin/feedback-cards', state.adminToken);
  if (adminCardsRes.status !== 200) throw new Error(`fixture admin cards: HTTP ${adminCardsRes.status}`);
  state.adminCards = adminCardsRes.data.feedbackCards || [];

  const teacherCasesRes = await get('/api/teacher/cases', state.teacherToken);
  if (teacherCasesRes.status !== 200) throw new Error(`fixture teacher cases: HTTP ${teacherCasesRes.status}`);
  state.teacherCases = teacherCasesRes.data.cases || [];

  const adminCasesRes = await get('/api/admin/cases', state.adminToken);
  if (adminCasesRes.status !== 200) throw new Error(`fixture admin cases: HTTP ${adminCasesRes.status}`);
  state.adminCases = adminCasesRes.data.cases || [];

  const commsRes = await get('/api/admin/communications', state.adminToken);
  if (commsRes.status !== 200) throw new Error(`fixture communications: HTTP ${commsRes.status}`);
  state.communications = commsRes.data.communications || [];

  const preferred = ['s_sara', 's_adam', 's_stu4', 's_stu5'];
  const inScope = preferred.filter((id) => state.allowedStudentIds.has(id));
  const allInScope = [...state.allowedStudentIds];
  state.inStudentA = inScope[0] || allInScope[0] || null;
  state.inStudentB = inScope[1] || allInScope.find((id) => id !== state.inStudentA) || null;

  state.card = state.teacherCards.find((c) => c.id === 'fc3')
    || state.teacherCards.find((c) => c.status === 'proposed')
    || state.teacherCards[0]
    || null;
  state.outCard = state.adminCards.find((c) => c.studentId && !state.allowedStudentIds.has(c.studentId)) || null;

  state.caseFile = state.teacherCases.find((c) => c.id === 'case_sara') || state.teacherCases[0] || null;
  state.outCase = state.adminCases.find((c) => c.studentId && !state.allowedStudentIds.has(c.studentId)) || null;
  state.outStudentId = (state.outCard && state.outCard.studentId)
    || (state.outCase && state.outCase.studentId)
    || 's_stu6';

  state.lc = state.communications.find((c) => c.id === 'com1')
    || state.communications.find((c) => c.type === 'parent_message')
    || null;
  state.unapproved = state.communications.find(
    (c) => c.id !== (state.lc && state.lc.id)
      && c.governance && c.governance.requiresApproval && !c.governance.approvedBy,
  ) || (
    state.lc && state.lc.governance && state.lc.governance.requiresApproval && !state.lc.governance.approvedBy
      ? state.lc
      : null
  );
  state.consentComm = state.communications.find(
    (c) => c.id !== (state.lc && state.lc.id)
      && c.type === 'parent_message'
      && c.governance && c.governance.approvedBy && c.governance.consent === 'pending',
  ) || null;
  state.sendableComm = state.communications.find(
    (c) => c.id !== (state.lc && state.lc.id)
      && c.id !== (state.consentComm && state.consentComm.id)
      && c.governance && c.governance.approvedBy && c.governance.consent !== 'pending',
  ) || null;

  if (!state.inStudentA || !state.inStudentB) throw new Error('fixture: teacher has fewer than two scoped students');
  if (!state.card) throw new Error('fixture: no teacher-scoped feedback card');
  if (!state.caseFile) throw new Error('fixture: no teacher-scoped case');
  if (!state.lc) throw new Error('fixture: no communication available for lifecycle checks');

  console.log(`SETUP teacher=${state.allowedStudentIds.size} students / ${state.teacherClasses.length} classes; card=${state.card.id}; case=${state.caseFile.id}; comm=${state.lc.id}`);
}

async function ensureInsights() {
  if (state.insights) return state.insights;
  const res = await get('/api/admin/learning-analytics', state.adminToken);
  assertStatus(res, 200, 'admin learning-analytics');
  state.insights = res.data.insights || [];
  state.studentNames = [...new Set(state.insights.map((i) => i.student && i.student.name).filter(Boolean))];
  return state.insights;
}

function collectKeys(value, out = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) collectKeys(item, out);
  } else if (value && typeof value === 'object') {
    for (const [key, nested] of Object.entries(value)) {
      out.add(key);
      collectKeys(nested, out);
    }
  }
  return out;
}

async function runChecks() {
  const adminLogin = await post('/api/auth/login', null, LOGIN.admin);
  const teacherLogin = await post('/api/auth/login', null, LOGIN.teacher);
  const parentLogin = await post('/api/auth/login', null, LOGIN.parent);
  const studentLogin = await post('/api/auth/login', null, LOGIN.student);

  state.adminToken = (adminLogin.data && adminLogin.data.token) || null;
  state.adminRefresh = (adminLogin.data && adminLogin.data.refreshToken) || null;
  state.teacherToken = (teacherLogin.data && teacherLogin.data.token) || null;
  state.parentToken = (parentLogin.data && parentLogin.data.token) || null;
  state.studentToken = (studentLogin.data && studentLogin.data.token) || null;

  await check('auth: director login on admin portal', () => {
    assertStatus(adminLogin, 200);
    assert(state.adminToken && state.adminRefresh, 'login did not return access + refresh tokens');
    assert(adminLogin.data.user.role === 'director', `expected role director, got ${brief(adminLogin.data.user.role)}`);
    assert(adminLogin.data.user.portal === 'admin_portal', 'director not on admin portal');
  });

  await check('auth: teacher, parent and student login on private portal', () => {
    for (const [label, res, role] of [
      ['teacher', teacherLogin, 'teacher'],
      ['parent', parentLogin, 'parent'],
      ['student', studentLogin, 'student'],
    ]) {
      assertStatus(res, 200, `${label} login`);
      assert(res.data.user.role === role, `${label} role mismatch: ${brief(res.data.user.role)}`);
      assert(res.data.user.portal === 'private', `${label} not on private portal`);
    }
  });

  if (!state.adminToken || !state.teacherToken || !state.parentToken || !state.studentToken) {
    console.error('FATAL: one or more logins failed; cannot run the suite.');
    if (serverLog) console.error(serverLog);
    return;
  }

  await check('auth: portal mismatch is rejected', async () => {
    const res = await post('/api/auth/login', null, {
      login: LOGIN.teacher.login,
      password: DEMO_PASSWORD,
      portal: 'admin_portal',
    });
    assertStatus(res, 403);
    assert(res.data.error === 'portal_mismatch', `expected portal_mismatch, got ${brief(res.data.error)}`);
  });

  await check('portal separation: admin token cannot call private API', async () => {
    const res = await get('/api/teacher/classes', state.adminToken);
    assertStatus(res, 403);
  });

  await check('portal separation: teacher token cannot call admin API', async () => {
    const res = await get('/api/admin/overview', state.teacherToken);
    assertStatus(res, 403);
  });

  await check('portal separation: parent token cannot call student API', async () => {
    const res = await get('/api/student/profile', state.parentToken);
    assertStatus(res, 403);
  });

  await check('auth: protected endpoint without token returns 401', async () => {
    const res = await get('/api/admin/overview');
    assertStatus(res, 401);
  });

  await check('auth: refresh token rotates and old token is rejected', async () => {
    const first = await post('/api/auth/refresh', null, { refreshToken: state.adminRefresh });
    assertStatus(first, 200);
    assert(first.data.token && first.data.refreshToken, 'refresh did not return new tokens');
    assert(first.data.refreshToken !== state.adminRefresh, 'refresh token was not rotated');
    const me = await get('/api/auth/me', first.data.token);
    assertStatus(me, 200);
    assert(me.data.user && me.data.user.id === 'u_dir', 'rotated access token does not resolve the director');
    const reuse = await post('/api/auth/refresh', null, { refreshToken: state.adminRefresh });
    assertStatus(reuse, 401);
    assert(reuse.data.error === 'invalid_refresh', `expected invalid_refresh, got ${brief(reuse.data.error)}`);
    addMutation(`login sessions for 4 accounts; refresh token rotated for ${LOGIN.admin.login}`);
  });

  await loadFixtures();

  const { caseFile, lc } = state;
  const admin = state.adminToken;
  const teacher = state.teacherToken;
  const student = state.studentToken;

  // ---------------------------------------------------------------- feedback
  await check('feedback cards: create endpoint', async () => {
    const res = await post('/api/teacher/feedback-cards', teacher, {
      studentId: state.inStudentA,
      summary: `QA card ${RUN}`,
      priority: 'medium',
      nextReview: '2026-12-20',
    });
    assertStatus(res, 201);
    assert(res.data.ok === true, 'create did not return ok=true');
    const created = res.data.card;
    assert(created && created.id, 'create did not return a card');
    assert(created.studentId === state.inStudentA, `wrong studentId ${brief(created.studentId)}`);
    assert(created.status === 'proposed', `new card status is ${brief(created.status)}`);
    assert(created.createdBy === 'u_t1', `createdBy is ${brief(created.createdBy)}`);
    assert(Array.isArray(created.history) && created.history.some((h) => h.action === 'created'), 'creation history is missing');
    const denied = await post('/api/teacher/feedback-cards', teacher, {
      studentId: state.outStudentId,
      summary: `QA out-of-scope card ${RUN}`,
    });
    assertStatus(denied, 403);
    state.createdCard = created;
    state.card = created;
    addMutation(`feedback card ${created.id}: created for ${state.inStudentA} (QA card ${RUN})`);
  });

  await check('feedback cards: teacher list is scoped', async () => {
    const res = await get('/api/teacher/feedback-cards', teacher);
    assertStatus(res, 200);
    const cards = res.data.feedbackCards || [];
    assert(Array.isArray(cards) && cards.length > 0, 'teacher received no feedback cards');
    assert(cards.some((c) => c.id === state.card.id), `teacher list is missing created card ${state.card.id}`);
    for (const item of cards) {
      assert(state.allowedStudentIds.has(item.studentId), `teacher sees out-of-scope card ${item.id} for ${item.studentId}`);
    }
    if (state.outCard) {
      assert(!cards.some((c) => c.id === state.outCard.id), `teacher list leaks out-of-scope card ${state.outCard.id}`);
    }
  });

  await check('feedback cards: teacher proposes card', async () => {
    const res = await post('/api/teacher/feedback-cards/update', teacher, {
      id: state.card.id,
      status: 'proposed',
      note: `QA ${RUN} propose`,
      nextReview: '2026-12-20',
    });
    assertStatus(res, 200);
    assert(res.data.card && res.data.card.status === 'proposed', `status is ${brief(res.data.card && res.data.card.status)}`);
    assert(Array.isArray(res.data.card.history), 'card history is missing');
    assert(
      res.data.card.history.some((h) => String(h.action).includes('proposed')),
      `history has no proposed action: ${brief(res.data.card.history.map((h) => h.action))}`,
    );
    state.card = res.data.card;
  });

  await check('feedback cards: admin approves proposed card', async () => {
    const res = await post('/api/admin/feedback-cards/update', admin, {
      id: state.card.id,
      status: 'approved',
      reviewNotes: `QA ${RUN} approved`,
      nextReview: '2026-12-22',
    });
    assertStatus(res, 200);
    assert(res.data.card.status === 'approved', `status is ${brief(res.data.card.status)}`);
    assert(
      res.data.card.history.some((h) => h.action === 'status:proposed->approved'),
      `history is missing proposed->approved: ${brief(res.data.card.history.map((h) => h.action))}`,
    );
    state.card = res.data.card;
  });

  await check('feedback cards: admin moves card to in_progress', async () => {
    const res = await post('/api/admin/feedback-cards/update', admin, {
      id: state.card.id,
      status: 'in_progress',
      assignee: 'u_t1',
      reviewNotes: `QA ${RUN} in progress`,
    });
    assertStatus(res, 200);
    assert(res.data.card.status === 'in_progress', `status is ${brief(res.data.card.status)}`);
    assert(res.data.card.assignee === 'u_t1', `assignee is ${brief(res.data.card.assignee)}`);
    state.card = res.data.card;
  });

  await check('feedback cards: admin completes card', async () => {
    const res = await post('/api/admin/feedback-cards/update', admin, {
      id: state.card.id,
      status: 'completed',
      reviewNotes: `QA ${RUN} completed`,
    });
    assertStatus(res, 200);
    assert(res.data.card.status === 'completed', `status is ${brief(res.data.card.status)}`);
    assert(
      res.data.card.history.some((h) => h.action === 'status:in_progress->completed'),
      `history is missing in_progress->completed: ${brief(res.data.card.history.map((h) => h.action))}`,
    );
    state.card = res.data.card;
    addMutation(`feedback card ${state.card.id}: proposed -> approved -> in_progress -> completed (+history entries)`);
  });

  await check('feedback cards: lifecycle audit entries recorded', async () => {
    const res = await get('/api/admin/audit-logs', admin);
    assertStatus(res, 200);
    const logs = (res.data.logs || []).filter((l) => l.entityType === 'feedback_card' && l.entityId === state.card.id);
    assert(logs.length >= 4, `expected at least 4 feedback-card audit entries, got ${logs.length}`);
    assert(logs.some((l) => l.actorId === 'u_t1'), 'no teacher audit entry');
    assert(logs.some((l) => l.actorId === 'u_dir'), 'no director audit entry');
    const statuses = new Set(logs.map((l) => l.details && l.details.status));
    for (const expected of ['approved', 'in_progress', 'completed']) {
      assert(statuses.has(expected), `audit log is missing status ${expected}: ${brief([...statuses])}`);
    }
    assert(logs[0].details && logs[0].details.status === 'completed', 'most recent audit entry is not the completed transition');
  });

  await check('feedback cards: unknown id is rejected with 404', async () => {
    const res = await post('/api/teacher/feedback-cards/update', teacher, {
      id: `fc_missing_${RUN}`,
      status: 'approved',
    });
    assertStatus(res, 404);
  });

  await check('feedback cards: teacher cannot update an out-of-scope card', async () => {
    if (!state.outCard) skip('No out-of-scope feedback card is present in the seed data.');
    const res = await post('/api/teacher/feedback-cards/update', teacher, {
      id: state.outCard.id,
      status: 'approved',
    });
    assertStatus(res, 403);
    assert(res.data.error === 'forbidden', `expected forbidden, got ${brief(res.data.error)}`);
  });

  await check('feedback cards: invalid transition is rejected', async () => {
    const before = await get('/api/teacher/feedback-cards', teacher);
    assertStatus(before, 200);
    const cardBefore = (before.data.feedbackCards || []).find((c) => c.id === state.card.id);
    assert(cardBefore && cardBefore.status === 'completed', 'card was not completed by the lifecycle checks');
    const logsBefore = await get('/api/admin/audit-logs', admin);
    assertStatus(logsBefore, 200);
    const updateCount = (payload) => (payload.data.logs || []).filter(
      (l) => l.action === 'update' && l.entityType === 'feedback_card' && l.entityId === state.card.id,
    ).length;
    const updatesBefore = updateCount(logsBefore);

    const res = await post('/api/teacher/feedback-cards/update', teacher, {
      id: state.card.id,
      status: 'proposed',
      note: `QA ${RUN} invalid transition probe`,
    });
    assertStatus(res, 400);
    assert(res.data.error === 'invalid_transition', `expected invalid_transition, got ${brief(res.data)}`);

    const adminProbe = await post('/api/admin/feedback-cards/update', admin, {
      id: state.card.id,
      status: 'in_progress',
    });
    assertStatus(adminProbe, 400);
    assert(adminProbe.data.error === 'invalid_transition', `expected invalid_transition, got ${brief(adminProbe.data)}`);

    const after = await get('/api/teacher/feedback-cards', teacher);
    assertStatus(after, 200);
    const cardAfter = (after.data.feedbackCards || []).find((c) => c.id === state.card.id);
    assert(cardAfter && cardAfter.status === 'completed', `card was mutated by a rejected transition: ${brief(cardAfter && cardAfter.status)}`);
    assert(cardAfter.history.length === cardBefore.history.length, 'history changed on a rejected transition');
    const logsAfter = await get('/api/admin/audit-logs', admin);
    assertStatus(logsAfter, 200);
    assert(updateCount(logsAfter) === updatesBefore, 'an audit entry was written for a rejected transition');
  });

  // ------------------------------------------------------------------- cases
  await check('cases: create endpoint', async () => {
    const focus = `QA case focus ${RUN}`;
    const res = await post('/api/teacher/cases', teacher, {
      studentId: state.inStudentA,
      focus,
      nextReview: '2026-12-24',
    });
    assertStatus(res, 201);
    assert(res.data.ok === true, 'create did not return ok=true');
    const created = res.data.case;
    assert(created && created.id, 'create did not return a case');
    assert(created.studentId === state.inStudentA, `wrong studentId ${brief(created.studentId)}`);
    assert(created.focus === focus, `focus is ${brief(created.focus)}`);
    assert(created.status === 'active', `status is ${brief(created.status)}`);
    assert(created.ownerId === 'u_t1', `ownerId is ${brief(created.ownerId)}`);
    assert(Array.isArray(created.timeline) && created.timeline.length === 0, 'new case timeline is not empty');
    const denied = await post('/api/teacher/cases', teacher, { studentId: state.outStudentId, focus });
    assertStatus(denied, 403);
    const adminView = await get('/api/admin/cases', admin);
    assertStatus(adminView, 200);
    assert((adminView.data.cases || []).some((c) => c.id === created.id), 'admin cannot see the created case');
    state.createdCase = created;
    addMutation(`case ${created.id}: created for ${state.inStudentA} (focus=${focus})`);
  });

  await check('cases: admin sees all, teacher is scoped', () => {
    assert(state.teacherCases.length > 0, 'teacher received no cases');
    for (const item of state.teacherCases) {
      assert(state.allowedStudentIds.has(item.studentId), `teacher sees out-of-scope case ${item.id} for ${item.studentId}`);
    }
    assert(state.adminCases.some((c) => c.id === caseFile.id), `admin case list missing ${caseFile.id}`);
    if (state.outCase) {
      assert(!state.teacherCases.some((c) => c.id === state.outCase.id), `teacher list leaks out-of-scope case ${state.outCase.id}`);
      assert(state.adminCases.some((c) => c.id === state.outCase.id), 'admin case list is missing the out-of-scope case');
    }
  });

  await check('cases: admin updates case fields', async () => {
    const focus = `QA focus ${RUN}`;
    const res = await post('/api/admin/cases/update', admin, {
      id: caseFile.id,
      status: 'active',
      focus,
      ownerRole: 'teacher_social',
      nextReview: '2026-12-24',
    });
    assertStatus(res, 200);
    assert(res.data.case.focus === focus, `focus is ${brief(res.data.case.focus)}`);
    assert(res.data.case.status === 'active', `status is ${brief(res.data.case.status)}`);
    assert(res.data.case.nextReview === '2026-12-24', `nextReview is ${brief(res.data.case.nextReview)}`);
    addMutation(`case ${caseFile.id}: focus/status/nextReview updated (focus=${focus})`);
  });

  const eventA = `QA timeline A ${RUN}`;
  const eventB = `QA timeline B ${RUN}`;

  await check('cases: admin appends timeline event', async () => {
    const res = await post('/api/admin/cases/timeline', admin, {
      id: caseFile.id,
      term: 'QA',
      date: '2026-11-15',
      event: eventA,
      type: 'note',
    });
    assertStatus(res, 200);
    const timeline = res.data.case.timeline || [];
    const entry = timeline.find((e) => e.event === eventA);
    assert(entry, 'appended event is missing from the returned timeline');
    assert(entry.date === '2026-11-15', `timeline date is ${brief(entry.date)}`);
    assert(entry.type === 'note', `timeline type is ${brief(entry.type)}`);
  });

  await check('cases: teacher appends second timeline event and ordering is preserved', async () => {
    const res = await post('/api/teacher/cases/timeline', teacher, {
      id: caseFile.id,
      term: 'QA',
      date: '2026-11-16',
      event: eventB,
      type: 'meeting',
    });
    assertStatus(res, 200);
    const timeline = res.data.case.timeline || [];
    const indexA = timeline.findIndex((e) => e.event === eventA);
    const indexB = timeline.findIndex((e) => e.event === eventB);
    assert(indexA >= 0 && indexB >= 0, `timeline is missing one of the QA events (A=${indexA}, B=${indexB})`);
    assert(indexA < indexB, `timeline order is wrong: A index ${indexA}, B index ${indexB}`);
    addMutation(`case ${caseFile.id}: two timeline entries appended (${eventA}; ${eventB})`);
  });

  await check('cases: teacher read preserves timeline order', async () => {
    const res = await get('/api/teacher/cases', teacher);
    assertStatus(res, 200);
    const found = (res.data.cases || []).find((c) => c.id === caseFile.id);
    assert(found, `teacher case list is missing ${caseFile.id}`);
    const timeline = found.timeline || [];
    const indexA = timeline.findIndex((e) => e.event === eventA);
    const indexB = timeline.findIndex((e) => e.event === eventB);
    assert(indexA >= 0 && indexB >= 0 && indexA < indexB, `teacher timeline order is wrong (A=${indexA}, B=${indexB})`);
  });

  await check('cases: teacher cannot append to an out-of-scope case', async () => {
    if (!state.outCase) skip('No out-of-scope case is present in the seed data.');
    const res = await post('/api/teacher/cases/timeline', teacher, {
      id: state.outCase.id,
      event: `QA unauthorized ${RUN}`,
      date: '2026-11-17',
    });
    assertStatus(res, 403);
  });

  await check('cases: unknown id is rejected with 404', async () => {
    const res = await post('/api/admin/cases/timeline', admin, {
      id: `case_missing_${RUN}`,
      event: `QA missing ${RUN}`,
      date: '2026-11-17',
    });
    assertStatus(res, 404);
  });

  // ---------------------------------------------------------- communications
  await check('communications: draft creation endpoint', async () => {
    const subject = `QA draft subject ${RUN}`;
    const bodyText = `QA draft body ${RUN}`;
    const res = await post('/api/teacher/communications', teacher, {
      studentId: state.inStudentA,
      type: 'parent_message',
      channel: 'in_app',
      subject,
      body: bodyText,
      notes: `QA ${RUN} created draft`,
    });
    assertStatus(res, 201);
    assert(res.data.ok === true, 'create did not return ok=true');
    const created = res.data.communication;
    assert(created && created.id, 'create did not return a communication');
    assert(created.status === 'draft', `status is ${brief(created.status)}`);
    assert(created.governance && created.governance.requiresApproval === true, 'requiresApproval default is missing');
    assert(created.governance.consent === 'pending', `parent-message consent is ${brief(created.governance.consent)}`);
    assert(created.by === 'u_t1', `created by ${brief(created.by)}`);
    assert(res.data.draft && res.data.draft.body === bodyText, 'draft body was not stored');
    assert(created.draftId === res.data.draft.id, 'communication is not linked to its draft');
    const denied = await post('/api/teacher/communications', teacher, {
      studentId: state.outStudentId, type: 'parent_message', channel: 'in_app', subject,
    });
    assertStatus(denied, 403);
    const listed = await get(`/api/teacher/communications?studentId=${encodeURIComponent(state.inStudentA)}`, teacher);
    assertStatus(listed, 200);
    assert((listed.data.communications || []).some((c) => c.id === created.id), 'created draft is missing from the teacher list');
    state.createdComm = created;
    addMutation(`communication ${created.id}: draft created for ${state.inStudentA} (QA draft ${RUN})`);
  });

  await check('communications: unapproved message is rejected by governance', async () => {
    if (!state.unapproved) skip('No communication with requiresApproval and no approvedBy is available.');
    assert(
      state.unapproved.governance && state.unapproved.governance.requiresApproval === true,
      'selected communication does not have requiresApproval=true',
    );
    const res = await post('/api/admin/communications/send', admin, { id: state.unapproved.id });
    assertStatus(res, 400);
    assert(res.data.error === 'governance', `expected governance error, got ${brief(res.data.error)}`);
    assert(res.data.reason === 'requires_approval', `expected requires_approval, got ${brief(res.data.reason)}`);
  });

  await check('communications: lifecycle message is reset to draft', async () => {
    const res = await post('/api/admin/communications/update', admin, {
      id: lc.id,
      status: 'draft',
      consent: 'pending',
      notes: `QA ${RUN} draft reset`,
    });
    assertStatus(res, 200);
    assert(res.data.communication.status === 'draft', `status is ${brief(res.data.communication.status)}`);
    assert(res.data.communication.governance.consent === 'pending', 'consent was not set to pending');
  });

  await check('communications: sending a draft before approval is rejected', async () => {
    const res = await post('/api/admin/communications/send', admin, { id: lc.id });
    assertStatus(res, 400);
    assert(res.data.error === 'governance', `expected governance error, got ${brief(res.data.error)}`);
    assert(
      ['requires_approval', 'consent_pending'].includes(res.data.reason),
      `expected a governance reason, got ${brief(res.data.reason)}`,
    );
  });

  await check('communications: approve -> send lifecycle', async () => {
    const approval = await post('/api/admin/communications/update', admin, {
      id: lc.id,
      status: 'approved',
      consent: 'granted',
      notes: `QA ${RUN} approved`,
    });
    assertStatus(approval, 200);
    assert(approval.data.communication.status === 'approved', `approval status is ${brief(approval.data.communication.status)}`);
    const governance = approval.data.communication.governance || {};
    assert(typeof governance.approvedAt === 'string', 'approval did not record approvedAt');
    assert(governance.approvedBy === 'u_dir', `approver id is ${brief(governance.approvedBy)}`);
    const send = await post('/api/admin/communications/send', admin, {
      id: lc.id,
      recipientAddress: 'qa-extended@example.test',
      body: `QA ${RUN} approved send`,
    });
    if (send.status !== 200) {
      throw new Error(
        `approval did not enable sending: HTTP ${send.status} ${brief(send.data)}; `
        + `governance.approvedBy=${brief(governance.approvedBy)}`,
      );
    }
    assert(send.data.communication.status === 'sent', `status after send is ${brief(send.data.communication.status)}`);
  });

  await check('communications: consent-pending parent message is rejected', async () => {
    if (!state.consentComm) skip('No approved communication with consent=pending and type=parent_message is available.');
    const res = await post('/api/admin/communications/send', admin, { id: state.consentComm.id });
    assertStatus(res, 400);
    assert(res.data.error === 'governance', `expected governance error, got ${brief(res.data.error)}`);
    assert(res.data.reason === 'consent_pending', `expected consent_pending, got ${brief(res.data.reason)}`);
  });

  await check('communications: pre-approved message sends successfully', async () => {
    if (!state.sendableComm) skip('No pre-approved communication with settled consent is available.');
    const res = await post('/api/admin/communications/send', admin, {
      id: state.sendableComm.id,
      recipientAddress: 'qa-extended@example.test',
      body: `QA ${RUN} delivery`,
    });
    assertStatus(res, 200);
    assert(res.data.ok === true, 'send did not return ok=true');
    assert(res.data.communication.status === 'sent', `status is ${brief(res.data.communication.status)}`);
    assert(res.data.communication.sentAt, 'sentAt is missing');
    assert(res.data.delivery && res.data.delivery.simulated === true, 'expected simulated delivery from the mock provider');
    assert(typeof res.data.delivery.messageId === 'string' && res.data.delivery.messageId.length > 0, 'delivery messageId is missing');
    state.sentComm = res.data.communication;
    addMutation(`communication ${state.sendableComm.id}: approved seeded message sent (simulated ${res.data.delivery.provider}; status=sent)`);
    addMutation(`communication ${lc.id}: reset to draft, approved (consent granted) and sent`);
  });

  await check('communications: send audit entry recorded', async () => {
    if (!state.sentComm) skip('No successful send was performed.');
    const res = await get('/api/admin/audit-logs', admin);
    assertStatus(res, 200);
    const entry = (res.data.logs || []).find(
      (l) => l.action === 'send' && l.entityType === 'communication' && l.entityId === state.sentComm.id,
    );
    assert(entry, `no send audit entry for ${state.sentComm.id}`);
    assert(entry.actorId === 'u_dir', `send audit actor is ${brief(entry.actorId)}`);
  });

  // -------------------------------------------------------------- bulk grades
  const gradeTerm = `QA-GRADE-${RUN}`;
  const subjectMath = 'الرياضيات';

  await check('bulk grades: mixed batch rolls back; valid batch succeeds', async () => {
    const badTerm = `QA-GRADE-MIXED-${RUN}`;
    const mixed = await post('/api/teacher/grades/bulk', teacher, {
      entries: [
        { studentId: state.inStudentA, subjectId: 'sub_math', score: 15.5, scale: 20, term: badTerm },
        { studentId: state.outStudentId, subjectId: 'sub_math', score: 10, scale: 20, term: badTerm },
        { subjectId: 'sub_math', score: 10, scale: 20, term: badTerm },
      ],
    });
    assertStatus(mixed, 400);
    assert(mixed.data.error === 'validation_failed', `expected validation_failed, got ${brief(mixed.data)}`);
    assert(mixed.data.total === 3, `expected total 3, got ${brief(mixed.data.total)}`);
    assert(Array.isArray(mixed.data.results) && mixed.data.results.length === 3, 'per-row results are missing');
    assert(mixed.data.results[0].ok === true, 'valid row was not marked valid');
    assert(mixed.data.results[1].error === 'forbidden', `expected forbidden, got ${brief(mixed.data.results[1].error)}`);
    assert(mixed.data.results[2].error === 'invalid_studentId', `expected invalid_studentId, got ${brief(mixed.data.results[2].error)}`);
    const probe = await get(`/api/teacher/student-report?studentId=${encodeURIComponent(state.inStudentA)}`, teacher);
    assertStatus(probe, 200);
    const leaked = ((probe.data.report && probe.data.report.grades) || []).filter((g) => g.term === badTerm);
    assert(leaked.length === 0, `atomic rollback failed: ${leaked.length} grade(s) were written`);

    // A fully valid batch still succeeds with the documented response shape.
    const res = await post('/api/teacher/grades/bulk', teacher, {
      entries: [
        { studentId: state.inStudentA, subjectId: 'sub_math', score: 15.5, scale: 20, term: gradeTerm },
        { studentId: state.inStudentB, subjectId: 'sub_fr', score: 12.25, scale: 20, term: gradeTerm },
      ],
    });
    assertStatus(res, 200);
    assert(res.data.total === 2 && res.data.success === 2, `expected 2/2, got ${brief({ total: res.data.total, success: res.data.success })}`);
    assert(res.data.results[0].ok === true && res.data.results[1].ok === true, 'a valid row failed');
    addMutation(`bulk grades: 2 rows created with term ${gradeTerm} for ${state.inStudentA}, ${state.inStudentB}`);
  });

  await check('bulk grades: in-scope grade is visible in student report', async () => {
    const res = await get(`/api/teacher/student-report?studentId=${encodeURIComponent(state.inStudentA)}`, teacher);
    assertStatus(res, 200);
    const grades = (res.data.report && res.data.report.grades) || [];
    const found = grades.find((g) => g.term === gradeTerm && g.score === 15.5 && g.subject === subjectMath);
    assert(found, `grade ${gradeTerm}/15.5/${subjectMath} not found in report; got ${brief(grades.filter((g) => g.term === gradeTerm))}`);
  });

  await check('bulk grades: out-of-scope row was not persisted', async () => {
    const insights = await ensureInsights();
    const out = insights.find((i) => i.student && i.student.id === state.outStudentId);
    assert(out, `no admin insight for out-of-scope student ${state.outStudentId}`);
    const leaked = (out.grades || []).filter((g) => g.term === gradeTerm);
    assert(leaked.length === 0, `out-of-scope student ${state.outStudentId} received ${leaked.length} grade(s)`);
  });

  await check('bulk grades: empty batch is a no-op', async () => {
    const res = await post('/api/teacher/grades/bulk', teacher, { entries: [] });
    assertStatus(res, 200);
    assert(res.data.total === 0 && res.data.success === 0, `expected 0/0, got ${brief({ total: res.data.total, success: res.data.success })}`);
  });

  await check('bulk grades: required-field and score validation', async () => {
    const badTerm = `QA-GRADE-INVALID-${RUN}`;
    const res = await post('/api/teacher/grades/bulk', teacher, {
      entries: [
        { studentId: state.inStudentA, subjectId: 'sub_math', score: 10, scale: 20, term: badTerm },
        { studentId: state.inStudentA, subjectId: 'sub_math', score: 25, scale: 20, term: badTerm },
        { studentId: state.inStudentA, subjectId: '', score: 10, scale: 20, term: badTerm },
        { studentId: state.inStudentA, subjectId: 'sub_math', score: 'high', scale: 20, term: badTerm },
        { studentId: state.inStudentA, subjectId: 'sub_math', score: 10, scale: 0, term: badTerm },
      ],
    });
    assertStatus(res, 400);
    assert(res.data.error === 'validation_failed', `expected validation_failed, got ${brief(res.data)}`);
    assert(res.data.total === 5, `expected total 5, got ${brief(res.data.total)}`);
    const errors = (res.data.results || []).filter((r) => !r.ok).map((r) => r.error);
    for (const expected of ['score_out_of_range', 'invalid_subjectId', 'invalid_score', 'invalid_scale']) {
      assert(errors.includes(expected), `missing per-row error ${expected}: ${brief(errors)}`);
    }
    const report = await get(`/api/teacher/student-report?studentId=${encodeURIComponent(state.inStudentA)}`, teacher);
    assertStatus(report, 200);
    const leaked = ((report.data.report && report.data.report.grades) || []).filter((g) => g.term === badTerm);
    assert(leaked.length === 0, `invalid batch wrote ${leaked.length} grade(s)`);
  });

  // ----------------------------------------------------------- bulk import
  const targetClass = state.teacherClasses.find((c) => (c.students || []).some((s) => s.id === state.inStudentA))
    || state.teacherClasses[0];
  const importNameA = `QA Import ${RUN} A`;
  const importNameB = `QA Import ${RUN} B`;

  await check('bulk import: valid students are created', async () => {
    assert(targetClass, 'no teacher class available for import');
    const res = await post('/api/admin/students/bulk-import', admin, {
      students: [
        { name: importNameA, levelId: targetClass.levelId, classId: targetClass.id, profile: { strengths: [], interests: [] } },
        { name: importNameB, levelId: targetClass.levelId, classId: targetClass.id, profile: { strengths: [], interests: [] } },
      ],
    });
    assertStatus(res, 201);
    assert(res.data.total === 2 && res.data.success === 2, `expected 2/2, got ${brief({ total: res.data.total, success: res.data.success })}`);
    assert(Array.isArray(res.data.results) && res.data.results.length === 2, 'import results are missing');
    for (const item of res.data.results) {
      assert(item.ok === true, `row failed: ${brief(item)}`);
      assert(String(item.id).startsWith('s_imp_'), `unexpected imported id ${brief(item.id)}`);
    }
    state.importedA = res.data.results[0];
    state.importedB = res.data.results[1];
    state.allowedStudentIds.add(state.importedA.id);
    state.allowedStudentIds.add(state.importedB.id);
    addMutation(`bulk import: students ${state.importedA.id} "${importNameA}", ${state.importedB.id} "${importNameB}" in class ${targetClass.id}`);
  });

  await check('bulk import: imported students appear in teacher class and admin search', async () => {
    assert(state.importedA, 'no imported student from previous check');
    const classes = await get('/api/teacher/classes', teacher);
    assertStatus(classes, 200);
    const cls = (classes.data.classes || []).find((c) => c.id === targetClass.id);
    assert(cls, `teacher class ${targetClass.id} is missing`);
    const ids = new Set((cls.students || []).map((s) => s.id));
    assert(ids.has(state.importedA.id) && ids.has(state.importedB.id), 'imported students are not in the teacher class roster');
    const search = await get(`/api/admin/search?q=${encodeURIComponent(importNameA)}`, admin);
    assertStatus(search, 200);
    assert(
      (search.data.results || []).some((r) => r.type === 'student' && r.id === state.importedA.id),
      'admin search cannot find the imported student',
    );
  });

  await check('bulk import: empty batch is a no-op', async () => {
    const res = await post('/api/admin/students/bulk-import', admin, { students: [] });
    assertStatus(res, 201);
    assert(res.data.total === 0 && res.data.success === 0, `expected 0/0, got ${brief({ total: res.data.total, success: res.data.success })}`);
  });

  await check('bulk import: required-field validation and rollback', async () => {
    const badName = `QA Bad Import ${RUN}`;
    const goodName = `QA Rollback ${RUN}`;
    const res = await post('/api/admin/students/bulk-import', admin, {
      students: [
        { name: goodName, levelId: targetClass.levelId, classId: targetClass.id },
        { name: badName, levelId: targetClass.levelId, classId: 'class_missing' },
        { levelId: targetClass.levelId, classId: targetClass.id },
      ],
    });
    assertStatus(res, 400);
    assert(res.data.error === 'validation_failed', `expected validation_failed, got ${brief(res.data)}`);
    assert(res.data.total === 3, `expected total 3, got ${brief(res.data.total)}`);
    const errors = (res.data.results || []).filter((r) => !r.ok).map((r) => r.error);
    assert(errors.includes('invalid_classId'), `missing invalid_classId: ${brief(errors)}`);
    assert(errors.includes('invalid_name'), `missing invalid_name: ${brief(errors)}`);
    for (const name of [badName, goodName]) {
      const search = await get(`/api/admin/search?q=${encodeURIComponent(name)}`, admin);
      assertStatus(search, 200);
      assert(!(search.data.results || []).some((r) => r.type === 'student' && r.title === name), `atomic rollback failed: "${name}" was persisted`);
    }
  });

  // -------------------------------------------------------------- wellbeing
  let wellbeingId = null;

  await check('wellbeing: student check-in is created', async () => {
    const res = await post('/api/wellbeing/checkin', student, {
      mood: 4,
      energy: 3,
      stress: 2,
      notes: `QA-WB-${RUN}`,
    });
    assertStatus(res, 201);
    assert(res.data.checkin.studentId === 's_sara', `studentId is ${brief(res.data.checkin.studentId)}`);
    assert(res.data.checkin.mood === 4 && res.data.checkin.energy === 3 && res.data.checkin.stress === 2, 'check-in values were not persisted');
    wellbeingId = res.data.checkin.id;
    addMutation(`wellbeing: check-in ${wellbeingId} for s_sara (notes QA-WB-${RUN})`);
  });

  await check('wellbeing: student history contains the new check-in', async () => {
    assert(wellbeingId, 'no check-in id from previous check');
    const res = await get('/api/wellbeing/history', student);
    assertStatus(res, 200);
    const history = res.data.history || [];
    assert(res.data.total === history.length, `total ${brief(res.data.total)} does not match history length ${history.length}`);
    assert(history.length <= 30, `history is not capped at 30 (got ${history.length})`);
    assert(history.some((c) => c.id === wellbeingId), 'new check-in is missing from student history');
  });

  await check('wellbeing: teacher can read an in-scope history', async () => {
    assert(wellbeingId, 'no check-in id from previous check');
    const res = await get('/api/wellbeing/history?studentId=s_sara', teacher);
    assertStatus(res, 200);
    assert((res.data.history || []).some((c) => c.id === wellbeingId), 'teacher history is missing the student check-in');
  });

  await check('wellbeing: teacher cannot check in an out-of-scope student', async () => {
    const res = await post('/api/wellbeing/checkin', teacher, {
      studentId: state.outStudentId,
      mood: 3,
      energy: 3,
      stress: 2,
    });
    assertStatus(res, 403);
  });

  // --------------------------------------------------------------- activities
  await check('activities: student enrollment is created or already unique', async () => {
    const res = await post('/api/activities/enroll', student, { studentId: 's_sara', activityId: 'act1' });
    if (res.status === 201) {
      assert(res.data.enrollment.studentId === 's_sara', 'enrollment studentId mismatch');
      assert(res.data.enrollment.activityId === 'act1', 'enrollment activityId mismatch');
      assert(res.data.enrollment.status === 'active', `enrollment status is ${brief(res.data.enrollment.status)}`);
      addMutation(`activity: enrollment ${res.data.enrollment.id} (s_sara -> act1)`);
      return;
    }
    assertStatus(res, 400);
    assert(res.data.error === 'already_enrolled', `expected already_enrolled, got ${brief(res.data.error)}`);
  });

  await check('activities: duplicate enrollment is rejected and only one row exists', async () => {
    const duplicate = await post('/api/activities/enroll', student, { studentId: 's_sara', activityId: 'act1' });
    assertStatus(duplicate, 400);
    assert(duplicate.data.error === 'already_enrolled', `expected already_enrolled, got ${brief(duplicate.data.error)}`);
    const members = await get('/api/activities/members?activityId=act1', student);
    assertStatus(members, 200);
    const rows = (members.data.members || []).filter((m) => m.studentId === 's_sara' && m.activityId === 'act1');
    assert(rows.length === 1, `expected exactly 1 enrollment row, got ${rows.length}`);
  });

  await check('activities: teacher cannot enroll an out-of-scope student', async () => {
    const res = await post('/api/activities/enroll', teacher, { studentId: state.outStudentId, activityId: 'act2' });
    assertStatus(res, 403);
  });

  // --------------------------------------------------------------- mentoring
  const pairSubject = `QA-${RUN}`;
  let pairId = null;

  await check('mentoring: admin creates a pair', async () => {
    const res = await post('/api/mentoring/pairs', admin, {
      mentorId: state.inStudentA,
      menteeId: state.inStudentB,
      subject: pairSubject,
    });
    assertStatus(res, 201);
    const pair = res.data.pair;
    assert(pair.mentorId === state.inStudentA && pair.menteeId === state.inStudentB, 'pair members mismatch');
    assert(pair.subject === pairSubject, `pair subject is ${brief(pair.subject)}`);
    assert(pair.status === 'active', `pair status is ${brief(pair.status)}`);
    pairId = pair.id;
    addMutation(`mentoring: pair ${pairId} (${state.inStudentA} -> ${state.inStudentB}, subject ${pairSubject})`);
  });

  await check('mentoring: pair is listed', async () => {
    assert(pairId, 'no pair id from previous check');
    const res = await get('/api/mentoring/pairs', admin);
    assertStatus(res, 200);
    assert((res.data.pairs || []).some((p) => p.id === pairId), `pair ${pairId} is not in the list`);
  });

  // ----------------------------------------------------------------- calendar
  await check('calendar: events endpoint returns well-formed events', async () => {
    const res = await get('/api/calendar/events', student);
    assertStatus(res, 200);
    const events = res.data.events || [];
    assert(Array.isArray(events) && events.length > 0, 'calendar returned no events');
    assert(events.length >= 5, `expected at least the 5 default events, got ${events.length}`);
    for (const event of events) {
      assert(typeof event.id === 'string' && event.id, 'event is missing id');
      assert(typeof event.title === 'string' && event.title, `event ${event.id} is missing title`);
      assert(typeof event.date === 'string' && !Number.isNaN(Date.parse(event.date)), `event ${event.id} has invalid date ${brief(event.date)}`);
    }
  });

  // ------------------------------------------------------------------- search
  await check('search: admin finds a student by id', async () => {
    const res = await get('/api/admin/search?q=s_sara', admin);
    assertStatus(res, 200);
    assert(
      (res.data.results || []).some((r) => r.type === 'student' && r.id === 's_sara'),
      `admin search did not return s_sara: ${brief(res.data.results)}`,
    );
  });

  await check('search: admin sees a student outside the teacher classes', async () => {
    const res = await get(`/api/admin/search?q=${encodeURIComponent(state.outStudentId)}&type=students`, admin);
    assertStatus(res, 200);
    assert((res.data.results || []).length > 0, 'admin type-filtered search returned no results');
    for (const item of res.data.results) assert(item.type === 'student', `type filter leaked ${brief(item.type)}`);
    assert(
      res.data.results.some((r) => r.id === state.outStudentId),
      `admin search did not return out-of-scope student ${state.outStudentId}`,
    );
  });

  await check('search: teacher cannot see an out-of-scope student', async () => {
    const res = await get(`/api/teacher/search?q=${encodeURIComponent(state.outStudentId)}`, teacher);
    assertStatus(res, 200);
    assert(res.data.total === 0, `teacher search total is ${brief(res.data.total)} for out-of-scope ${state.outStudentId}`);
    assert((res.data.results || []).length === 0, `teacher search leaked ${brief(res.data.results)}`);
  });

  await check('search: teacher results stay inside class scope', async () => {
    const res = await get('/api/teacher/search?q=s_sara', teacher);
    assertStatus(res, 200);
    const students = (res.data.results || []).filter((r) => r.type === 'student');
    assert(students.some((s) => s.id === 's_sara'), 'teacher search did not return in-scope s_sara');
    for (const item of students) {
      assert(state.allowedStudentIds.has(item.id), `teacher search returned out-of-scope student ${item.id}`);
    }
  });

  await check('search: empty query returns an empty result set for both portals', async () => {
    const adminRes = await get('/api/admin/search?q=', admin);
    const teacherRes = await get('/api/teacher/search?q=', teacher);
    assertStatus(adminRes, 200);
    assertStatus(teacherRes, 200);
    assert(adminRes.data.total === 0 && (adminRes.data.results || []).length === 0, 'admin empty query is not empty');
    assert(teacherRes.data.total === 0 && (teacherRes.data.results || []).length === 0, 'teacher empty query is not empty');
  });

  // ---------------------------------------------------------------- showcase
  await check('showcase: student submits work for review', async () => {
    const res = await post('/api/showcase/submit', student, {
      title: `QA Showcase ${RUN} A`,
      type: 'علوم',
      impact: 'QA extended suite',
      studentId: 's_sara',
    });
    assertStatus(res, 201);
    const pub = res.data.publication;
    assert(pub.status === 'pending_review', `status is ${brief(pub.status)}`);
    assert(pub.studentId === 's_sara', `studentId is ${brief(pub.studentId)}`);
    state.pubA = pub;
    addMutation(`showcase: publication ${pub.id} "${pub.title}" submitted (approved + published by QA)`);
  });

  await check('showcase: pending work is hidden from the public feed', async () => {
    if (!state.pubA) skip('Submission was not created.');
    const res = await get('/api/showcase');
    assertStatus(res, 200);
    const found = (res.data.publications || []).find((p) => p.id === state.pubA.id);
    assert(!found, `pending publication ${state.pubA.id} is visible on the public feed`);
  });

  await check('showcase: reviewer approves submission', async () => {
    assert(state.pubA, 'no submission id');
    const res = await post('/api/showcase/review', admin, { id: state.pubA.id, status: 'approved' });
    assertStatus(res, 200);
    assert(res.data.publication.status === 'approved', `status is ${brief(res.data.publication.status)}`);
    assert(res.data.publication.reviewedAt, 'reviewedAt is missing');
    state.pubA = res.data.publication;
  });

  await check('showcase: reviewer publishes submission', async () => {
    assert(state.pubA, 'no submission id');
    const res = await post('/api/showcase/review', admin, { id: state.pubA.id, status: 'published' });
    assertStatus(res, 200);
    assert(res.data.publication.status === 'published', `status is ${brief(res.data.publication.status)}`);
    assert(typeof res.data.publication.publishedAt === 'string', 'publishedAt is missing');
    state.pubA = res.data.publication;
  });

  await check('showcase: second submission is rejected', async () => {
    await delay(10);
    const submit = await post('/api/showcase/submit', student, {
      title: `QA Showcase ${RUN} B`,
      type: 'آداب',
      impact: 'QA extended suite reject path',
      studentId: 's_sara',
    });
    assertStatus(submit, 201);
    state.pubB = submit.data.publication;
    addMutation(`showcase: publication ${state.pubB.id} "${state.pubB.title}" submitted (rejected by QA)`);
    const review = await post('/api/showcase/review', admin, { id: state.pubB.id, status: 'rejected' });
    assertStatus(review, 200);
    assert(review.data.publication.status === 'rejected', `status is ${brief(review.data.publication.status)}`);
    state.pubB = review.data.publication;
  });

  await check('showcase: public feed contains the published work', async () => {
    assert(state.pubA, 'no published submission');
    const res = await get('/api/showcase');
    assertStatus(res, 200);
    const found = (res.data.publications || []).find((p) => p.id === state.pubA.id);
    assert(found, `published publication ${state.pubA.id} is missing from /api/showcase`);
    assert(found.status === 'published', `public status is ${brief(found.status)}`);
    assert(found.title === state.pubA.title, 'public title does not match');
  });

  await check('showcase: unauthorized review is safely rejected', async () => {
    const res = await post('/api/showcase/review', state.parentToken, { id: state.pubA?.id || 'pub1', status: 'approved' });
    assertStatus(res, 403, 'parent review');
    const alive = await get('/api/admin/audit-logs', state.adminToken);
    assertStatus(alive, 200, 'server alive after rejected review');
  });

  await check('showcase: review audit entries recorded', async () => {
    assert(state.pubA && state.pubB, 'missing publications');
    const res = await get('/api/admin/audit-logs', admin);
    assertStatus(res, 200);
    const logs = (res.data.logs || []).filter((l) => l.action === 'review' && l.entityType === 'showcase');
    assert(logs.some((l) => l.entityId === state.pubA.id && l.details && l.details.status === 'published'), 'missing publish audit entry');
    assert(logs.some((l) => l.entityId === state.pubB.id && l.details && l.details.status === 'rejected'), 'missing reject audit entry');
  });

  // ---------------------------------------------------------------------- ML
  const statsBeforeRes = await get('/api/admin/system-stats', admin);
  state.statsBefore = statsBeforeRes.status === 200 ? statsBeforeRes.data.stats : null;

  await check('ML: gap prediction returns advisory shape', async () => {
    const res = await get('/api/admin/ml/gap-prediction?studentId=s_sara', admin);
    assertStatus(res, 200);
    assert(typeof res.data.student === 'string' && res.data.student, 'student name is missing');
    const risk = res.data.risk;
    assert(risk && typeof risk === 'object', 'risk object is missing');
    assertNumber(risk.risk, 'risk.risk');
    assert(risk.risk >= 0 && risk.risk <= 1, `risk out of range: ${risk.risk}`);
    assert(['low', 'medium', 'high'].includes(risk.level), `unexpected risk level ${brief(risk.level)}`);
    assert(Array.isArray(risk.factors), 'risk.factors is not an array');
    assert(Array.isArray(res.data.anomalies), 'anomalies is not an array');
    assert(Array.isArray(res.data.recommendations), 'recommendations is not an array');
    for (const rec of res.data.recommendations) {
      assert(rec.type && rec.action, `recommendation is missing advisory fields: ${brief(rec)}`);
      assert(rec.applied === undefined && rec.executed === undefined, 'recommendation appears to have been auto-applied');
    }
  });

  await check('ML: gap prediction rejects an out-of-scope teacher request', async () => {
    const res = await get(`/api/teacher/ml/gap-prediction?studentId=${encodeURIComponent(state.outStudentId)}`, teacher);
    assertStatus(res, 403);
  });

  await check('ML: gap prediction returns 404 for an unknown student', async () => {
    const res = await get(`/api/admin/ml/gap-prediction?studentId=missing_${RUN}`, admin);
    assertStatus(res, 404);
  });

  await check('ML: teacher prediction list is scoped', async () => {
    const res = await get('/api/teacher/ml/gap-prediction', teacher);
    assertStatus(res, 200);
    const predictions = res.data.predictions || [];
    assert(Array.isArray(predictions) && predictions.length > 0, 'no predictions returned');
    for (const item of predictions) {
      assert(state.allowedStudentIds.has(item.id), `teacher prediction leaked out-of-scope student ${item.id}`);
      assertNumber(item.risk, `prediction risk for ${item.id}`);
    }
  });

  await check('ML: early warning is sorted and shaped for admin', async () => {
    const res = await get('/api/admin/ml/early-warning', admin);
    assertStatus(res, 200);
    const warnings = res.data.warnings || [];
    assert(res.data.total === warnings.length, `total ${brief(res.data.total)} does not match ${warnings.length}`);
    for (let i = 1; i < warnings.length; i += 1) {
      assert(warnings[i - 1].risk >= warnings[i].risk, 'warnings are not sorted by descending risk');
    }
    for (const item of warnings) {
      assert(item.studentId && item.studentName, 'warning is missing student identity');
      assertNumber(item.risk, `warning risk for ${item.studentId}`);
      assert(['medium', 'high'].includes(item.level), `unexpected warning level ${brief(item.level)}`);
      assert(Array.isArray(item.factors), 'warning factors is not an array');
      assert(item.recommendedAction && item.urgency, 'warning is missing advisory action/urgency');
    }
    state.adminWarnings = warnings;
  });

  await check('ML: teacher early warning is scoped', async () => {
    const res = await get('/api/teacher/ml/early-warning', teacher);
    assertStatus(res, 200);
    const warnings = res.data.warnings || [];
    assert(res.data.total === warnings.length, 'teacher warning total mismatch');
    for (const item of warnings) {
      assert(state.allowedStudentIds.has(item.studentId), `teacher warning leaked ${item.studentId}`);
    }
    assert(warnings.length <= state.adminWarnings.length, 'teacher warnings exceed admin warnings');
  });

  await check('ML: experiment metadata endpoint is available', async () => {
    const list = await get('/api/admin/ml/experiment', admin);
    assertStatus(list, 200);
    assert(Array.isArray(list.data.experiments), 'experiments is not an array');
    assert(list.data.experiments.includes('feedback_card_ui'), 'default experiment feedback_card_ui is missing');
    const detail = await get('/api/admin/ml/experiment?id=feedback_card_ui', admin);
    assertStatus(detail, 200);
    const result = detail.data.results;
    assert(result && result.id === 'feedback_card_ui', 'experiment detail is missing');
    assert(Array.isArray(result.variants) && result.variants.includes('A') && result.variants.includes('B'), 'variants are incomplete');
    assert(result.summary && typeof result.summary === 'object', 'results summary is missing');
    assertNumber(result.totalAssignments, 'totalAssignments');
  });

  await check('ML: advisory endpoints do not create cases or feedback cards', async () => {
    assert(state.statsBefore, 'system stats before ML were unavailable');
    const after = await get('/api/admin/system-stats', admin);
    assertStatus(after, 200);
    const before = state.statsBefore;
    const now = after.data.stats;
    assert(now.cases === before.cases, `cases changed during advisory ML calls (${before.cases} -> ${now.cases})`);
    assert(now.feedbackCards === before.feedbackCards, `feedback cards changed during advisory ML calls (${before.feedbackCards} -> ${now.feedbackCards})`);
    assert(now.auditLogs >= before.auditLogs, `audit log count decreased (${before.auditLogs} -> ${now.auditLogs})`);
    const logs = await get('/api/admin/audit-logs', admin);
    assertStatus(logs, 200);
    const reads = (logs.data.logs || []).filter(
      (l) => l.action === 'read' && ['ml_gap_prediction', 'ml_early_warning'].includes(l.entityType),
    );
    assert(reads.length >= 2, `expected read audit entries for ML gap/early-warning, found ${reads.length}`);
  });

  await check('ML: experiment assignment determinism', async () => {
    const userId = `qa-user-${RUN}`;
    const url = `/api/admin/ml/experiment/assignment?userId=${encodeURIComponent(userId)}`;
    const first = await get(url, admin);
    assertStatus(first, 200);
    assert(first.data.ok === true, 'assignment did not return ok=true');
    assert(first.data.experimentId === 'feedback_card_ui', `experimentId is ${brief(first.data.experimentId)}`);
    assert(first.data.userId === userId, `userId is ${brief(first.data.userId)}`);
    assert(['A', 'B'].includes(first.data.variant), `unexpected variant ${brief(first.data.variant)}`);
    assert(first.data.source === 'memory' && first.data.persisted === false, 'assignment persistence metadata is missing');
    const second = await get(url, admin);
    assertStatus(second, 200);
    assert(second.data.variant === first.data.variant, 'the same user received a different variant');
    const assigned = await post('/api/admin/ml/experiment/assign', admin, { userId });
    assertStatus(assigned, 200);
    assert(assigned.data.variant === first.data.variant, 'POST changed an existing assignment');
    const otherUser = await get(`/api/admin/ml/experiment/assignment?userId=${encodeURIComponent(`qa-other-${RUN}`)}`, admin);
    assertStatus(otherUser, 200);
    const missing = await get('/api/admin/ml/experiment/assignment', admin);
    assertStatus(missing, 400);
    assert(missing.data.error === 'missing_userId', `expected missing_userId, got ${brief(missing.data)}`);
    const forbidden = await get(url, teacher);
    assertStatus(forbidden, 403);
    const unknown = await get(`${url}&experimentId=no_such_experiment`, admin);
    assertStatus(unknown, 404);
    const results = await get('/api/admin/ml/experiment?id=feedback_card_ui', admin);
    assertStatus(results, 200);
    assert(results.data.results.totalAssignments >= 2, `expected >= 2 assignments, got ${brief(results.data.results.totalAssignments)}`);
  });

  // -------------------------------------------------------------- anonymized
  await check('analytics: anonymized aggregate respects k-anonymity >= 3', async () => {
    const res = await get('/api/admin/analytics/anonymized', admin);
    assertStatus(res, 200);
    const agg = res.data.anonymized;
    assert(agg && typeof agg === 'object', 'anonymized aggregate is null');
    assert(agg.anonymized === true, 'aggregate is not flagged as anonymized');
    assertNumber(agg.count, 'anonymized.count');
    assert(agg.count >= 3, `aggregate count ${agg.count} is below k=3`);
    assertNumber(agg.minGroupSize, 'anonymized.minGroupSize');
    assert(agg.minGroupSize >= 3, `minGroupSize ${agg.minGroupSize} is below 3`);
    assert(res.data.policy && res.data.policy.minGroupSize >= 3, 'policy minGroupSize is below 3');
  });

  await check('analytics: anonymized response contains no names, emails or student ids', async () => {
    const res = await get('/api/admin/analytics/anonymized', admin);
    assertStatus(res, 200);
    const insights = await ensureInsights();
    const names = [...new Set(insights.map((i) => i.student && i.student.name).filter(Boolean))];
    assert(names.length > 0, 'could not derive student names to test against');
    const raw = JSON.stringify(res.data);
    const emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
    assert(!emailPattern.test(raw), 'anonymized response contains an email address');
    for (const name of names) {
      assert(!raw.includes(name), `anonymized response leaks student name: ${name}`);
    }
    const ids = insights.map((i) => i.student && i.student.id).filter(Boolean);
    for (const id of ids) {
      assert(!raw.includes(id), `anonymized response leaks student id: ${id}`);
    }
    const keys = [...collectKeys(res.data)];
    const forbidden = keys.filter((key) => /^(name|studentName|student_name|email|studentId|student_id)$/i.test(key));
    assert(forbidden.length === 0, `anonymized response exposes identity keys: ${brief(forbidden)}`);
  });

  // --------------------------------------------------------------- retention
  await check('retention: policy endpoint returns a complete policy', async () => {
    const res = await get('/api/admin/retention', admin);
    assertStatus(res, 200);
    const policy = res.data.retentionPolicy || {};
    for (const key of ['auditDays', 'draftsDays', 'sessionsDays', 'communicationsDays', 'anonymizeAnalyticsAfterDays']) {
      assertNumber(policy[key], `retentionPolicy.${key}`);
      assert(policy[key] > 0, `retentionPolicy.${key} must be positive`);
    }
    assert(res.data.storageType === 'json_file', `unexpected storage type ${brief(res.data.storageType)}`);
  });

  await check('retention: apply enforces the policy', async () => {
    const res = await post('/api/admin/retention/apply', admin, {});
    assertStatus(res, 200);
    assert(res.data.ok === true, 'apply did not return ok=true');
    assert(res.data.policy && typeof res.data.policy === 'object', 'apply did not return the policy');
    assert(res.data.removed && typeof res.data.removed === 'object', 'apply did not return removed counts');
    assertNumber(res.data.removed.audit, 'removed.audit');
    assertNumber(res.data.removed.sessions, 'removed.sessions');
    assert(res.data.removed.audit >= 0 && res.data.removed.sessions >= 0, 'removed counts cannot be negative');
    state.removed = res.data.removed;
    addMutation(`retention: apply executed (removed audit=${res.data.removed.audit}, sessions=${res.data.removed.sessions})`);
  });

  await check('retention: apply is audited and access survives', async () => {
    const logs = await get('/api/admin/audit-logs', admin);
    assertStatus(logs, 200);
    const first = (logs.data.logs || [])[0];
    assert(first, 'audit log is empty after retention apply');
    assert(first.action === 'retention' && first.entityType === 'storage', `latest audit entry is ${brief({ action: first.action, entityType: first.entityType })}`);
    const after = await get('/api/admin/retention', admin);
    assertStatus(after, 200);
    assert(after.data.retentionPolicy, 'retention policy missing after apply');
  });

  await check('retention: dry-run mode', async () => {
    const logsBefore = await get('/api/admin/audit-logs', admin);
    assertStatus(logsBefore, 200);
    const latestBefore = (logsBefore.data.logs || [])[0] && (logsBefore.data.logs || [])[0].id;
    const res = await post('/api/admin/retention/apply', admin, { dryRun: true });
    assertStatus(res, 200);
    assert(res.data.ok === true, 'dry-run did not return ok=true');
    assert(res.data.dryRun === true, `dryRun flag is ${brief(res.data.dryRun)}`);
    assert(res.data.policy && typeof res.data.policy === 'object', 'dry-run did not return the policy');
    assert(res.data.removed && typeof res.data.removed === 'object', 'dry-run did not return removed counts');
    assertNumber(res.data.removed.audit, 'dry-run removed.audit');
    assertNumber(res.data.removed.sessions, 'dry-run removed.sessions');
    assert(res.data.preview && Array.isArray(res.data.preview.audit) && Array.isArray(res.data.preview.sessions), 'dry-run preview is missing');
    assert(res.data.preview.audit.length === Math.min(res.data.removed.audit, 50), 'preview.audit does not match removed.audit');
    assert(res.data.preview.sessions.length === Math.min(res.data.removed.sessions, 50), 'preview.sessions does not match removed.sessions');
    const logsAfter = await get('/api/admin/audit-logs', admin);
    assertStatus(logsAfter, 200);
    const latestAfter = (logsAfter.data.logs || [])[0] && (logsAfter.data.logs || [])[0].id;
    assert(latestAfter === latestBefore, 'dry-run wrote an audit entry');
    state.dryRunPreview = res.data.preview;
  });

  // -------------------------------------------------------------- attendance
  await check('attendance: teacher records and reads scoped attendance', async () => {
    assert(state.inStudentA, 'no in-scope student from setup');
    const date = new Date().toISOString().slice(0, 10);
    const save = await post('/api/teacher/attendance', teacher, {
      entries: [{ studentId: state.inStudentA, date, status: 'late', note: `QA-${RUN}` }],
    });
    assertStatus(save, 200);
    assert(save.data.success === 1, `bulk attendance saved ${brief(save.data.success)} rows`);
    const own = await get(`/api/teacher/attendance?studentId=${encodeURIComponent(state.inStudentA)}`, teacher);
    assertStatus(own, 200);
    const row = (own.data.attendance || []).find((a) => a.date === date && a.note === `QA-${RUN}`);
    assert(row, 'saved attendance row is missing from teacher view');
    assert(row.status === 'late', `status is ${brief(row.status)}`);
    assert(row.recordedBy === 'u_t1', `recordedBy is ${brief(row.recordedBy)}`);
    const adminView = await get(`/api/admin/attendance?studentId=${encodeURIComponent(state.inStudentA)}`, admin);
    assertStatus(adminView, 200);
    assert((adminView.data.attendance || []).some((a) => a.id === row.id), 'admin cannot see the attendance row');
    addMutation(`attendance: row ${row.id} recorded for ${state.inStudentA} (${date}, late)`);
  });

  await check('attendance: invalid status and out-of-scope rows are rejected', async () => {
    assert(state.outStudentId, 'no out-of-scope student from setup');
    const date = new Date().toISOString().slice(0, 10);
    const note = `QA-ATOMIC-${RUN}`;
    const res = await post('/api/teacher/attendance', teacher, {
      entries: [
        { studentId: state.inStudentA, date, status: 'present', note },
        { studentId: state.inStudentA, date, status: 'unknown' },
        { studentId: state.outStudentId, date, status: 'absent' },
      ],
    });
    assertStatus(res, 400);
    assert(res.data.error === 'validation_failed', `expected validation_failed, got ${brief(res.data)}`);
    assert(res.data.total === 3, `expected total 3, got ${brief(res.data.total)}`);
    const results = res.data.results || [];
    assert(results[0].ok === true, 'valid row was not marked valid');
    assert(results.some((r) => r.error === 'invalid_status'), 'invalid status was not rejected');
    assert(results.some((r) => r.error === 'forbidden'), 'out-of-scope student was not rejected');
    const own = await get(`/api/teacher/attendance?studentId=${encodeURIComponent(state.inStudentA)}`, teacher);
    assertStatus(own, 200);
    assert(!(own.data.attendance || []).some((a) => a.note === note), 'atomic rollback failed: a valid attendance row was written');
    const forbiddenRead = await get(`/api/teacher/attendance?studentId=${encodeURIComponent(state.outStudentId)}`, teacher);
    assertStatus(forbiddenRead, 403, 'out-of-scope attendance read');
  });

  // ------------------------------------------- parallel learning space (web)
  await check('parallel space: engagement time is tracked per student', async () => {
    const before = await get('/api/student/engagement', student);
    assertStatus(before, 200);
    const beat = await post('/api/student/engagement', student, {
      seconds: 45, activity: 'lesson', subjectId: 'sub_math', subject: 'الرياضيات', refId: `qa-${RUN}`,
    });
    assertStatus(beat, 200);
    assert(beat.data.ok === true, 'heartbeat did not return ok=true');
    const after = await get('/api/student/engagement', student);
    assertStatus(after, 200);
    assertNumber(after.data.summary.totalMinutes, 'engagement.totalMinutes');
    assert(after.data.summary.lastActive, 'engagement.lastActive is missing');
    assert(String(after.data.summary.note || '').includes('منفصل'), 'engagement note must state it is separate from classroom attendance');
    const adminView = await get('/api/admin/engagement?studentId=s_sara', admin);
    assertStatus(adminView, 200);
    assert(adminView.data.students?.[0]?.studentId === 's_sara', 'admin cannot see the student engagement row');
  });

  await check('parallel space: assignments are listed and submitted', async () => {
    const list = await get('/api/student/assignments', student);
    assertStatus(list, 200);
    const assignments = list.data.assignments || [];
    assert(assignments.length > 0, 'student has no assignments in scope');
    const target = assignments.find((item) => item.status === 'not_submitted') || assignments[0];
    const submit = await post(`/api/student/assignments/${target.id}/submit`, student, { note: `QA ${RUN}` });
    assertStatus(submit, 200);
    assert(submit.data.submission.status === 'submitted', 'submission status was not updated');
    const after = await get('/api/student/assignments', student);
    assertStatus(after, 200);
    assert((after.data.assignments || []).some((item) => item.id === target.id && item.status === 'submitted'), 'submission is not visible after save');
    addMutation(`assignment ${target.id}: submitted by QA run ${RUN}`);
  });

  await check('parallel space: interactive lesson progress is scoped and persisted', async () => {
    const lessonId = `qa-lesson-${RUN}`;
    const save = await post('/api/student/lessons/progress', student, {
      subjectId: 'sub_math', subject: 'الرياضيات', unitId: 'cur1', unit: 'الكسور',
      lessonId, lesson: `QA lesson ${RUN}`, score: 0.8, completed: true,
    });
    assertStatus(save, 200);
    assert(save.data.progress.completed === true, 'lesson was not marked completed');
    assert(save.data.progress.xp > 0, 'lesson XP was not awarded');
    assert(save.data.summary.totalXp > 0, 'progress summary has no XP');
    const read = await get('/api/student/lessons/progress', student);
    assertStatus(read, 200);
    assert((read.data.progress.rows || []).some((row) => row.lessonId === lessonId), 'saved lesson row is missing');
    const crossPortal = await post('/api/student/lessons/progress', admin, { lessonId: `qa-denied-${RUN}`, score: 1 });
    assertStatus(crossPortal, 403, 'admin cannot write student lesson progress');
  });

  // ------------------------------------------------ curriculum terms & libraries
  await check('curriculum: units carry terms and filter by level/term', async () => {
    const res = await get('/api/admin/curriculum?levelId=l_p4', admin);
    assertStatus(res, 200);
    assert(Array.isArray(res.data.terms) && res.data.terms.length === 3, 'curriculum must expose three terms');
    assert((res.data.items || []).length > 0, 'no curriculum units for l_p4');
    assert(res.data.items.every((item) => res.data.terms.includes(item.term)), 'a unit has no valid term');
    const term = res.data.terms[0];
    const filtered = await get(`/api/admin/curriculum?levelId=l_p4&term=${encodeURIComponent(term)}`, admin);
    assertStatus(filtered, 200);
    assert(filtered.data.items.length > 0, 'term filter returned no units');
    assert(filtered.data.items.every((item) => item.term === term), 'term filter leaked another term');
  });

  await check('curriculum: admin update is validated and audited; teacher is read-only', async () => {
    const before = await get('/api/admin/curriculum?levelId=l_p4', admin);
    const target = (before.data.items || [])[0];
    assert(target, 'no curriculum unit to update');
    const badTerm = await post('/api/admin/curriculum/update', admin, { id: target.id, term: 'الفصل 9' });
    assertStatus(badTerm, 400, 'invalid term must be rejected');
    const forbidden = await post('/api/admin/curriculum/update', teacher, { id: target.id, status: 'draft' });
    assertStatus(forbidden, 403, 'teacher cannot edit the curriculum');
    const teacherRead = await get('/api/teacher/curriculum?levelId=l_p4', teacher);
    assertStatus(teacherRead, 200);
    assert(teacherRead.data.items.length > 0, 'teacher cannot read own-level curriculum');
    const outOfScope = await get('/api/teacher/curriculum?levelId=l_p6', teacher);
    assertStatus(outOfScope, 403, 'teacher read outside own levels must be rejected');
    const moved = await post('/api/admin/curriculum/update', admin, { id: target.id, term: target.term });
    assertStatus(moved, 200);
    assert(moved.data.item.term === target.term, 'curriculum update did not return the saved term');
  });

  await check('libraries: student library is per level and per term', async () => {
    const res = await get(`/api/student/library?term=${encodeURIComponent('الفصل 1')}`, student);
    assertStatus(res, 200);
    assert(res.data.library && res.data.library.term === 'الفصل 1', 'library term mismatch');
    assert(Array.isArray(res.data.library.subjects) && res.data.library.subjects.length > 0, 'library has no subjects');
    assert(res.data.library.subjects.every((group) => group.items.every((item) => item.term === 'الفصل 1')), 'library leaked another term');
    assert(res.data.library.subjects.every((group) => group.items.every((item) => item.status === 'published')), 'library leaked unpublished units');
  });

  await check('report cards: term card is aggregated for admin, teacher, parent and student', async () => {
    const term = encodeURIComponent('الفصل 1');
    const adminCard = await get(`/api/admin/report-card?studentId=s_sara&term=${term}`, admin);
    assertStatus(adminCard, 200);
    const card = adminCard.data.reportCard;
    assert(card && card.student.id === 's_sara', 'admin report card missing student');
    assert(card.term === 'الفصل 1', 'report card term mismatch');
    assert(Array.isArray(card.subjects) && card.subjects.length > 0, 'report card has no subjects');
    assert(card.advisory === true && String(card.note).length > 0, 'report card must be advisory with a note');
    assertNumber(card.attendance.rate, 'report card attendance rate');
    const teacherCard = await get(`/api/teacher/report-card?studentId=s_sara&term=${term}`, teacher);
    assertStatus(teacherCard, 200);
    const outOfScope = await get(`/api/teacher/report-card?studentId=${encodeURIComponent(state.outStudentId)}&term=${term}`, teacher);
    assertStatus(outOfScope, 403, 'teacher report card outside scope must be rejected');
    const parentCard = await get(`/api/parent/child-report-card?studentId=s_sara&term=${term}`, state.parentToken);
    assertStatus(parentCard, 200);
    const parentDenied = await get('/api/parent/child-report-card?studentId=s_stu8&term=' + term, state.parentToken);
    assertStatus(parentDenied, 403, 'parent report card outside children must be rejected');
    const studentCard = await get(`/api/student/report-card?term=${term}`, student);
    assertStatus(studentCard, 200);
    assert(studentCard.data.reportCard.student.id === 's_sara', 'student card must be self-scoped');
  });

  await check('parallel space: parent and teacher engagement reads are scoped', async () => {
    const parentView = await get('/api/parent/child-engagement?studentId=s_sara', state.parentToken);
    assertStatus(parentView, 200);
    assertNumber(parentView.data.summary.totalMinutes, 'child engagement minutes');
    assert(Array.isArray(parentView.data.assignments) && Array.isArray(parentView.data.lessons.rows), 'child engagement payload is incomplete');
    const parentDenied = await get('/api/parent/child-engagement?studentId=s_stu8', state.parentToken);
    assertStatus(parentDenied, 403, 'parent engagement outside children must be rejected');
    const teacherView = await get('/api/teacher/engagement', teacher);
    assertStatus(teacherView, 200);
    assert(teacherView.data.students.length > 0, 'teacher engagement is empty');
    assert(teacherView.data.students.every((row) => row.engagement && row.lessons), 'teacher engagement rows are incomplete');
  });

  // ------------------------------------------------ question bank & formative assessment
  await check('question bank: teacher reads scoped questions with metadata; other portals denied', async () => {
    const res = await get('/api/teacher/question-bank', teacher);
    assertStatus(res, 200);
    assert(Array.isArray(res.data.questions) && res.data.questions.length > 0, 'question bank is empty');
    assert((res.data.levels || []).length === 3, 'teacher must see exactly their three levels');
    assert((res.data.terms || []).length === 3, 'three terms must be exposed');
    assert((res.data.subjects || []).length > 0, 'subject metadata is missing');
    assert(res.data.questions.every((q) => q.prompt && Array.isArray(q.options)), 'a question is incomplete');
    const wrongPortal = await get('/api/teacher/question-bank', admin);
    assertStatus(wrongPortal, 403, 'admin portal cannot read the private question bank');
    const filtered = await get('/api/teacher/question-bank?levelId=l_p6', teacher);
    assertStatus(filtered, 403, 'teacher filtered outside own levels must be rejected');
  });

  await check('question bank: validation, create and archive round-trip', async () => {
    const invalid = await post('/api/teacher/question-bank', teacher, {
      levelId: 'l_p4', subjectId: 'sub_math', prompt: 'incomplete', options: ['only one'], correctIndex: 0,
    });
    assertStatus(invalid, 400, 'question with fewer than two options must be rejected');
    const prompt = `QA question ${RUN}`;
    const created = await post('/api/teacher/question-bank', teacher, {
      levelId: 'l_p4', subjectId: 'sub_math', term: 'الفصل 1', difficulty: 'easy',
      prompt, options: ['أ', 'ب', 'ج'], correctIndex: 1, skill: 'QA', explanation: 'QA explanation',
    });
    assertStatus(created, 201);
    const id = created.data.question && created.data.question.id;
    assert(id && id.startsWith('qb_'), 'created question has no valid id');
    assert(created.data.question.correctIndex === 1, 'correct answer was not stored');
    const active = await get('/api/teacher/question-bank', teacher);
    assert(active.data.questions.some((q) => q.id === id), 'new question missing from active list');
    const archived = await post('/api/teacher/question-bank/update', teacher, { id, status: 'archived' });
    assertStatus(archived, 200);
    assert(archived.data.question.status === 'archived', 'archive did not apply');
    const after = await get('/api/teacher/question-bank', teacher);
    assert(!after.data.questions.some((q) => q.id === id), 'archived question leaked into active list');
    const withArchived = await get('/api/teacher/question-bank?includeArchived=true', teacher);
    assert(withArchived.data.questions.some((q) => q.id === id), 'includeArchived did not reveal the question');
    addMutation(`question ${id}: created (${prompt}) and archived by QA run ${RUN}`);
  });

  await check('formative assessment: teacher creates, validates, publishes and analyses', async () => {
    const outOfScope = await post('/api/teacher/formative-assessments', teacher, {
      title: `QA out of scope ${RUN}`, levelId: 'l_p6', subjectId: 'sub_math',
      questionIds: ['qb_demo1'], status: 'draft',
    });
    assertStatus(outOfScope, 400, 'assessment outside teacher levels must be rejected');
    const emptyQuestions = await post('/api/teacher/formative-assessments', teacher, {
      title: `QA empty ${RUN}`, levelId: 'l_p4', subjectId: 'sub_math', questionIds: [], status: 'draft',
    });
    assertStatus(emptyQuestions, 400, 'assessment without questions must be rejected');
    const created = await post('/api/teacher/formative-assessments', teacher, {
      title: `QA formative ${RUN}`, levelId: 'l_p4', subjectId: 'sub_math',
      questionIds: ['qb_demo1', 'qb_demo2', 'qb_demo3'], status: 'draft',
    });
    assertStatus(created, 201);
    const id = created.data.assessment && created.data.assessment.id;
    assert(id && id.startsWith('fa_'), 'created assessment has no valid id');
    assert(created.data.assessment.questionIds.length === 3, 'assessment did not keep its questions');
    const analysis = await get(`/api/teacher/formative-assessments/${id}/analysis`, teacher);
    assertStatus(analysis, 200);
    assert((analysis.data.items || []).length === 3, 'analysis must include every question');
    assert(analysis.data.items.every((item) => Number.isFinite(item.difficultyPct)), 'analysis has invalid difficulty');
    const published = await post('/api/teacher/formative-assessments/update', teacher, { id, status: 'published' });
    assertStatus(published, 200);
    assert(published.data.assessment.status === 'published', 'publish did not apply');
    state.qaFormativeId = id;
    addMutation(`formative assessment ${id}: created as draft, analysed and published (QA run ${RUN})`);
  });

  await check('formative assessment: student sees only published assessments for own level', async () => {
    const res = await get('/api/student/formative-assessments', student);
    assertStatus(res, 200);
    const items = res.data.assessments || [];
    assert(items.length >= 2, 'student should see seeded published assessments');
    assert(!items.some((a) => a.id === 'fa_demo3'), 'draft assessment leaked to student');
    assert(items.every((a) => a.questionCount > 0 && a.subject && a.term), 'assessment list entry is incomplete');
    assert(items.every((a) => a.bestScore === null || (a.bestScore >= 0 && a.bestScore <= 1)), 'bestScore out of range');
  });

  await check('formative assessment: take hides answers, submission grades, retries are allowed', async () => {
    const take = await get('/api/student/formative-assessments/fa_demo1', student);
    assertStatus(take, 200);
    const questions = take.data.questions || [];
    assert(questions.length === 3, 'take view must return three questions');
    assert(questions.every((q) => !('correctIndex' in q)), 'correct answer leaked to student');
    assert(questions.every((q) => Array.isArray(q.options) && q.options.length >= 2), 'question options are missing');
    const perfect = await post('/api/student/formative-assessments/fa_demo1/submit', student, {
      answers: { qb_demo1: 0, qb_demo2: 1, qb_demo3: 2 },
    });
    assertStatus(perfect, 200);
    assert(perfect.data.attempt.score === 1, 'perfect answers must score 1');
    assert(perfect.data.attempt.feedback.length === 3, 'feedback missing for a question');
    assert(perfect.data.attempt.feedback.every((f) => f.correct === true), 'perfect feedback has an incorrect item');
    assertNumber(perfect.data.bestScore, 'best score');
    const retry = await post('/api/student/formative-assessments/fa_demo1/submit', student, {
      answers: { qb_demo1: 1, qb_demo2: 1, qb_demo3: 0 },
    });
    assertStatus(retry, 200, 'a second attempt must be allowed');
    assert(retry.data.attempt.score < 1, 'wrong answers must not score full marks');
    assert(retry.data.bestScore >= perfect.data.bestScore, 'best score must not decrease');
    const locked = await get('/api/student/formative-assessments/fa_demo3', student);
    assertStatus(locked, 404, 'student cannot open a draft assessment');
    addMutation('formative attempts: two submissions for s_sara on fa_demo1 (advisory, audit recorded)');
  });

  await check('formative assessment: role and portal separation is enforced', async () => {
    const studentWrites = await post('/api/teacher/question-bank', student, {
      levelId: 'l_p4', subjectId: 'sub_math', prompt: 'denied', options: ['a', 'b'], correctIndex: 0,
    });
    assertStatus(studentWrites, 403, 'student cannot create questions');
    const teacherReads = await get('/api/student/formative-assessments', teacher);
    assertStatus(teacherReads, 403, 'teacher cannot use the student assessment endpoint');
    const adminReads = await get('/api/teacher/formative-assessments', admin);
    assertStatus(adminReads, 403, 'admin portal cannot use teacher assessment endpoints');
  });

  // ---------------------------------------------------------------- timetable
  await check('timetable: admin sees enriched slots, metadata and links', async () => {
    const res = await get('/api/admin/timetable', admin);
    assertStatus(res, 200);
    const slots = res.data.slots || [];
    assert(slots.length >= 20, 'expected the seeded timetable to include at least 20 lessons');
    const meta = res.data.meta || {};
    assert((meta.days || []).length === 5, 'timetable must expose the five Moroccan school days');
    assert((meta.periods || []).length === 6, 'timetable must expose six daily periods');
    assert(meta.scope === 'global', 'admin timetable scope must be global');
    assert((meta.classes || []).some((c) => c.id === 'c_p4a'), 'admin meta missing demo class');
    assert((meta.subjects || []).some((s) => s.id === 'sub_math' && s.name), 'admin meta must expose labelled subjects for the create form');
    for (const slot of slots) {
      for (const field of ['id', 'classId', 'className', 'levelName', 'day', 'period', 'time', 'subject', 'term']) {
        assert(slot[field], `slot ${brief(slot.id)} is missing ${field}`);
      }
      assert(slot.period >= 1 && slot.period <= 6, `slot period out of range: ${brief(slot.period)}`);
      assert(slot.links && slot.links.attendance && slot.links.attendance.view === 'class', 'admin attendance must be a class view');
      assertNumber(slot.links.attendance.total, 'class attendance total');
      assert(Array.isArray(slot.links.assignments), 'slot assignments must be an array');
      assert(slot.links.assignments.length <= 5, 'slot assignments must be capped at five');
    }
    const first = slots.find((s) => s.period === 1);
    assert(first && first.time === '08:30–09:15', 'period 1 has the wrong time');
  });

  await check('timetable: teacher view is scoped to own classes', async () => {
    const res = await get('/api/teacher/timetable', teacher);
    assertStatus(res, 200);
    const slots = res.data.slots || [];
    assert(slots.length > 0, 'teacher timetable is empty');
    assert(slots.every((s) => state.allowedClassIds.has(s.classId)), 'out-of-scope class leaked into teacher timetable');
    assert(res.data.meta.scope === 'teacher', 'teacher scope label is wrong');
    assert((res.data.meta.classes || []).every((c) => state.allowedClassIds.has(c.id)), 'teacher meta leaked classes');
    const blocked = await get('/api/teacher/timetable?classId=c_p6b', teacher);
    assertStatus(blocked, 403, 'teacher must be blocked from an out-of-scope class');
  });

  await check('timetable: student view uses own class and student-level attendance', async () => {
    const res = await get('/api/student/timetable', student);
    assertStatus(res, 200);
    const slots = res.data.slots || [];
    assert(slots.length > 0, 'student timetable is empty');
    assert(slots.every((s) => s.classId === 'c_p4a'), 'student sees another class');
    assert(res.data.meta.scope === 'student', 'student scope label is wrong');
    assert((res.data.meta.classes || []).length === 1 && res.data.meta.classes[0].id === 'c_p4a', 'student meta must contain only own class');
    assert(slots.every((s) => s.links.attendance.view === 'student'), 'student attendance must be an individual view');
    assert(slots.every((s) => typeof s.links.attendance.rate === 'number'), 'attendance rate must be numeric');
  });

  await check('timetable: parent view is child-scoped and rejects other children', async () => {
    const res = await get('/api/parent/timetable', state.parentToken);
    assertStatus(res, 200);
    const slots = res.data.slots || [];
    assert(slots.length > 0, 'parent timetable is empty');
    assert(res.data.meta.scope === 'parent', 'parent scope label is wrong');
    assert(slots.every((s) => s.links.attendance.view === 'student'), 'parent attendance must be per child');
    const scoped = await get('/api/parent/timetable?childId=s_yassine', state.parentToken);
    assertStatus(scoped, 200);
    assert((scoped.data.slots || []).length > 0, 'child filter returned no lessons');
    const blocked = await get('/api/parent/timetable?childId=s_stu4', state.parentToken);
    assertStatus(blocked, 403, 'parent must be blocked from another child');
  });

  await check('timetable: admin validates, creates, updates and removes a lesson', async () => {
    const invalid = await post('/api/admin/timetable', admin, {
      classId: 'c_missing', day: 'الأحد', period: 1, subjectId: 'sub_math',
    });
    assertStatus(invalid, 400, 'unknown class must be rejected');
    assert(invalid.data.field === 'classId', `expected field classId, got ${brief(invalid.data.field)}`);
    const created = await post('/api/admin/timetable', admin, {
      classId: 'c_p4a', day: 'الخميس', period: 6, subjectId: 'sub_sport', teacherId: 'u_t1', room: 'QA',
    });
    assertStatus(created, 201);
    const id = created.data.slot && created.data.slot.id;
    assert(id && id.startsWith('ts_'), 'created slot has no valid id');
    assert(created.data.slot.room === 'QA', 'room was not stored');
    assert(created.data.slot.links.attendance.view === 'class', 'create response must be enriched');
    const listed = await get('/api/admin/timetable?classId=c_p4a&day=%D8%A7%D9%84%D8%AE%D9%85%D9%8A%D8%B3', admin);
    assertStatus(listed, 200);
    assert((listed.data.slots || []).some((s) => s.id === id), 'new slot missing from filtered list');
    const updated = await post('/api/admin/timetable/update', admin, { id, room: 'QA2' });
    assertStatus(updated, 200);
    assert(updated.data.slot.room === 'QA2', 'update did not apply');
    const removed = await post('/api/admin/timetable/update', admin, { id, remove: true });
    assertStatus(removed, 200);
    assert(removed.data.removed === true, 'remove response is missing');
    const missing = await post('/api/admin/timetable/update', admin, { id, room: 'x' });
    assertStatus(missing, 404, 'updating a removed slot must return 404');
    addMutation(`timetable slot ${id}: created, updated and removed by QA run ${RUN}`);
  });

  await check('timetable: role and portal separation is enforced', async () => {
    const privateToAdmin = await post('/api/admin/timetable', student, {
      classId: 'c_p4a', day: 'الأحد', period: 1, subjectId: 'sub_math',
    });
    assertStatus(privateToAdmin, 403, 'student must not write to the admin timetable');
    const teacherToAdmin = await get('/api/admin/timetable', teacher);
    assertStatus(teacherToAdmin, 403, 'teacher must not read the admin timetable');
    const parentToAdmin = await post('/api/admin/timetable/update', state.parentToken, { id: 'ts_none', room: 'x' });
    assertStatus(parentToAdmin, 403, 'parent must not mutate the admin timetable');
    const adminToStudent = await get('/api/student/timetable', admin);
    assertStatus(adminToStudent, 403, 'admin portal must not use the private student API');
  });

  // ------------------------------------------------- family approval / privacy
  await check('family center: parent requests are child-scoped with metadata', async () => {
    const res = await get('/api/parent/requests', state.parentToken);
    assertStatus(res, 200);
    const requests = res.data.requests || [];
    assert(requests.length >= 6, 'expected the seeded parent requests');
    assert(requests.every((r) => ['s_sara', 's_yassine'].includes(r.studentId)), 'request leaked outside parent scope');
    assert(requests.every((r) => r.studentName && r.advisory === true), 'requests must be enriched and advisory');
    const meta = res.data.meta || {};
    assert((meta.statuses || []).length === 4, 'status metadata is incomplete');
    assert((meta.types || []).includes('consent') && (meta.types || []).includes('privacy'), 'type metadata is incomplete');
    const scoped = await get('/api/parent/requests?studentId=s_sara', state.parentToken);
    assertStatus(scoped, 200);
    assert((scoped.data.requests || []).length > 0 && (scoped.data.requests || []).every((r) => r.studentId === 's_sara'), 'student filter did not apply');
    const blocked = await get('/api/parent/requests?studentId=s_stu4', state.parentToken);
    assertStatus(blocked, 403, 'parent must be blocked from another child\'s requests');
  });

  await check('family center: parent decision is audited and updates linked consent', async () => {
    const list = await get('/api/parent/requests', state.parentToken);
    const pending = (list.data.requests || []).find((r) => r.status === 'pending' && r.type === 'consent' && r.entityType === 'communication');
    assert(pending, 'no pending consent request linked to a communication');
    const decided = await post('/api/parent/requests/decide', state.parentToken, {
      id: pending.id, decision: 'approved', note: `QA ${RUN} parent approval`,
    });
    assertStatus(decided, 200);
    assert(decided.data.request.status === 'approved', 'decision status was not stored');
    assert(decided.data.request.decidedBy === 'u_p1', 'decision actor was not recorded');
    assert(decided.data.request.decisionNote.includes(RUN), 'decision note was not stored');
    const again = await post('/api/parent/requests/decide', state.parentToken, { id: pending.id, decision: 'declined' });
    assertStatus(again, 400, 'deciding a terminal request must be rejected');
    assert(again.data.error === 'invalid_transition', `expected invalid_transition, got ${brief(again.data.error)}`);
    const missing = await post('/api/parent/requests/decide', state.parentToken, { id: 'pr_does_not_exist', decision: 'approved' });
    assertStatus(missing, 404, 'unknown request must return 404');
    const comms = await get('/api/admin/communications', admin);
    const linked = (comms.data.communications || []).find((c) => c.id === pending.entityId);
    assert(linked && linked.governance.consent === 'granted', 'parent approval did not update communication consent');
    assert(linked.governance.parentDecision === 'approved', 'parent decision was not stamped on the communication');
    addMutation(`parent request ${pending.id}: approved by u_p1 and linked communication consent granted`);
  });

  await check('family center: privacy policy, sources and preferences are accessible', async () => {
    const res = await get('/api/parent/privacy', state.parentToken);
    assertStatus(res, 200);
    const prefs = res.data.preferences || {};
    assert(typeof prefs.allowAnalytics === 'boolean' && typeof prefs.allowCommunications === 'boolean', 'preferences are missing');
    assert(['ar', 'fr', 'en', 'amz'].includes(prefs.language), 'preferred language is invalid');
    assert((res.data.policy || {}).auditDays > 0, 'retention policy is missing');
    const sources = res.data.sources || [];
    assert(sources.length >= 4, 'expected at least four data sources');
    const attendance = sources.find((s) => s.key === 'attendance');
    const platform = sources.find((s) => s.key === 'platform_time');
    assert(attendance && platform && attendance.separate && platform.separate, 'attendance and platform time must be marked separate');
    assert(Array.isArray(res.data.audit), 'audit list is missing');
    const blocked = await get('/api/parent/privacy?studentId=s_stu4', state.parentToken);
    assertStatus(blocked, 403, 'parent must be blocked from another child\'s privacy view');
    const updated = await post('/api/parent/privacy/preferences', state.parentToken, { allowAnalytics: false, language: 'fr' });
    assertStatus(updated, 200);
    assert(updated.data.preferences.allowAnalytics === false && updated.data.preferences.language === 'fr', 'preferences were not saved');
    const invalid = await post('/api/parent/privacy/preferences', state.parentToken, { language: 'zz' });
    assertStatus(invalid, 400, 'invalid language must be rejected');
    assert(invalid.data.field === 'language', `expected field language, got ${brief(invalid.data.field)}`);
    await post('/api/parent/privacy/preferences', state.parentToken, { allowAnalytics: true, language: 'ar' });
    addMutation(`parent preferences for u_p1: toggled and restored by QA run ${RUN}`);
  });

  await check('family center: weekly summary keeps data sources separate and advisory', async () => {
    const res = await get('/api/parent/weekly-summary?studentId=s_sara', state.parentToken);
    assertStatus(res, 200);
    const s = res.data.summary || {};
    assert(s.advisory === true, 'weekly summary must be flagged advisory');
    assert(s.student && s.student.id === 's_sara', 'weekly summary is for the wrong child');
    assert(s.week && s.week.start && s.week.end, 'week range is missing');
    const att = s.classroomAttendance || {};
    for (const key of ['present', 'late', 'absent', 'total', 'percent']) assertNumber(att[key], `attendance.${key}`);
    assert(att.percent >= 0 && att.percent <= 100, 'attendance percent must be 0-100');
    assert(/منفصل|مستقل/.test(att.note || ''), 'attendance note must stress separation from platform time');
    const pt = s.platformTime || {};
    assertNumber(pt.minutes, 'platformTime.minutes');
    assert(Array.isArray(pt.subjects), 'platform subjects must be an array');
    assert(/منفصل|مستقل|ليس/.test(pt.note || ''), 'platform note must stress separation from attendance');
    const hw = s.homework || {};
    for (const key of ['due', 'submitted', 'overdue']) assertNumber(hw[key], `homework.${key}`);
    assert(Array.isArray(hw.items), 'homework items must be an array');
    const practice = s.practice || {};
    assertNumber(practice.attempts, 'practice.attempts');
    assert(practice.averageScore >= 0 && practice.averageScore <= 100, 'practice score must be 0-100');
    assert(/تقويم|تدريب|استرشاد/.test(practice.note || ''), 'practice note must mark it advisory');
    assert(Array.isArray(s.highlights) && Array.isArray(s.conversationStarters), 'highlights and conversation starters are required');
    assert(typeof s.privacy === 'string' && s.privacy.length > 0, 'privacy note is required');
    const blocked = await get('/api/parent/weekly-summary?studentId=s_stu4', state.parentToken);
    assertStatus(blocked, 403, 'parent must be blocked from another child\'s weekly summary');
  });

  await check('governance: a declined parent consent blocks sending', async () => {
    const created = await post('/api/teacher/communications', teacher, {
      studentId: state.inStudentA, type: 'parent_message', channel: 'in_app',
      subject: `QA declined consent ${RUN}`, body: `QA ${RUN}`,
    });
    assertStatus(created, 201);
    const id = created.data.communication.id;
    const approved = await post('/api/admin/communications/update', admin, { id, status: 'approved', consent: 'declined' });
    assertStatus(approved, 200);
    const send = await post('/api/admin/communications/send', admin, { id, recipientAddress: 'qa-declined@example.test', body: `QA ${RUN}` });
    assertStatus(send, 400, 'sending with declined consent must be rejected');
    assert(send.data.reason === 'consent_declined', `expected consent_declined, got ${brief(send.data.reason)}`);
    addMutation(`communication ${id}: created and consent declined by QA run ${RUN}`);
  });

  await check('family center: role and portal separation is enforced', async () => {
    for (const endpoint of ['/api/parent/requests', '/api/parent/privacy', '/api/parent/weekly-summary']) {
      const asTeacher = await get(endpoint, teacher);
      assertStatus(asTeacher, 403, `teacher must not read ${endpoint}`);
      const asAdmin = await get(endpoint, admin);
      assertStatus(asAdmin, 403, `admin portal must not read ${endpoint}`);
    }
    const decideAsStudent = await post('/api/parent/requests/decide', student, { id: 'pr_demo_1', decision: 'approved' });
    assertStatus(decideAsStudent, 403, 'student must not decide parent requests');
    const prefsAsStudent = await post('/api/parent/privacy/preferences', student, { allowAnalytics: false });
    assertStatus(prefsAsStudent, 403, 'student must not change parent preferences');
  });

  // --------------------------- measurable intervention plans & weekly review
  let ipPlanId = null;

  await check('interventions: teacher sees advisory warnings and scoped plans', async () => {
    const warnings = await get('/api/teacher/intervention-plans/warnings', teacher);
    assertStatus(warnings, 200);
    const w = warnings.data.warnings || [];
    assert(w.length > 0, 'expected advisory warnings for the teacher');
    assert(w.every((x) => state.allowedStudentIds.has(x.studentId)), 'warning leaked outside teacher scope');
    for (const key of ['risk', 'level', 'factors', 'recommendedAction', 'urgency', 'existingPlanId']) {
      assert(key in w[0], `warning missing ${key}`);
    }
    const plans = await get('/api/teacher/intervention-plans', teacher);
    assertStatus(plans, 200);
    const seeded = plans.data.plans || [];
    assert(seeded.length >= 1, 'expected seeded intervention plans');
    assert(seeded.every((p) => state.allowedStudentIds.has(p.studentId)), 'plan leaked outside teacher scope');
    const meta = plans.data.meta || {};
    assert((meta.statuses || []).length === 3, 'status metadata is incomplete');
    assert((meta.indicators || []).length === 5, 'indicator metadata is incomplete');
    const scoped = await get(`/api/teacher/intervention-plans?studentId=${encodeURIComponent(state.inStudentA)}`, teacher);
    assertStatus(scoped, 200);
    assert((scoped.data.plans || []).every((p) => p.studentId === state.inStudentA), 'student filter did not apply');
    const blocked = await get(`/api/teacher/intervention-plans?studentId=${encodeURIComponent(state.outStudentId)}`, teacher);
    assertStatus(blocked, 403, 'teacher must be blocked from out-of-scope plans');
  });

  await check('interventions: create plan is human-authored with advisory source', async () => {
    const bad = await post('/api/teacher/intervention-plans', teacher, {
      studentId: state.inStudentA, goal: '   ', indicator: 'attendance', baseline: 40, target: 80,
      unit: '%', nextReview: '2026-12-31', actions: ['x'],
    });
    assertStatus(bad, 400, 'empty goal must be rejected');
    assert(bad.data.field === 'goal', `expected field goal, got ${brief(bad.data.field)}`);
    const out = await post('/api/teacher/intervention-plans', teacher, {
      studentId: state.outStudentId, goal: `QA ${RUN}`, indicator: 'attendance', baseline: 40, target: 80,
      unit: '%', nextReview: '2026-12-31', actions: ['x'],
    });
    assertStatus(out, 403, 'out-of-scope create must be rejected');
    const created = await post('/api/teacher/intervention-plans', teacher, {
      studentId: state.inStudentA, goal: `QA goal ${RUN}`, indicator: 'homework', baseline: 50, target: 90,
      unit: '%', nextReview: '2026-12-31', actions: [`QA action ${RUN}`], sourceWarningId: 'qa-advisory-context',
    });
    assertStatus(created, 201);
    const p = created.data.plan;
    assert(p.status === 'active' && p.current === 50 && p.weeks.length === 0, 'new plan defaults are wrong');
    assert(p.ownerId && p.ownerRole === 'teacher', 'plan owner was not recorded');
    assert(p.goal.includes(RUN), 'human-authored goal was not stored verbatim');
    assert(p.history.some((h) => h.action === 'created'), 'creation history missing');
    if (p.source) assert(p.source.advisory === true, 'source context must be flagged advisory');
    ipPlanId = p.id;
    addMutation(`intervention plan ${p.id}: created by teacher for QA run ${RUN}`);
  });

  await check('interventions: weekly review requires notes and recomputes progress', async () => {
    const noNotes = await post('/api/teacher/intervention-plans/week', teacher, {
      id: ipPlanId, actions: ['a'], reviewNotes: '   ', progress: 50,
    });
    assertStatus(noNotes, 400, 'empty review notes must be rejected');
    assert(noNotes.data.field === 'reviewNotes', `expected field reviewNotes, got ${brief(noNotes.data.field)}`);
    const badProgress = await post('/api/teacher/intervention-plans/week', teacher, {
      id: ipPlanId, actions: ['a'], reviewNotes: `QA ${RUN}`, progress: 150,
    });
    assertStatus(badProgress, 400, 'progress above 100 must be rejected');
    assert(badProgress.data.field === 'progress', `expected field progress, got ${brief(badProgress.data.field)}`);
    const reviewed = await post('/api/teacher/intervention-plans/week', teacher, {
      id: ipPlanId, actions: [`QA weekly action ${RUN}`], reviewNotes: `QA review ${RUN}`,
      progress: 50, nextReview: '2027-01-15',
    });
    assertStatus(reviewed, 200);
    const p = reviewed.data.plan;
    assert(p.status === 'reviewed' && p.weeks.length === 1, 'weekly review was not recorded');
    assertNumber(p.current, 'plan.current');
    assert(p.current === 70, `expected current=70 for 50->90 at 50%, got ${brief(p.current)}`);
    assert(p.weeks[0].reviewedBy && p.weeks[0].reviewNotes.includes(RUN), 'week reviewer/notes missing');
    assert(p.history.some((h) => h.action === 'weekly_review'), 'weekly_review history missing');
  });

  await check('interventions: closing a plan requires notes and is audited', async () => {
    const noNotes = await post('/api/teacher/intervention-plans/update', teacher, { id: ipPlanId, status: 'closed' });
    assertStatus(noNotes, 400, 'closing without notes must be rejected');
    assert(noNotes.data.field === 'reviewNotes', `expected field reviewNotes, got ${brief(noNotes.data.field)}`);
    const badStatus = await post('/api/teacher/intervention-plans/update', teacher, { id: ipPlanId, status: 'unknown' });
    assertStatus(badStatus, 400, 'invalid status must be rejected');
    const closed = await post('/api/teacher/intervention-plans/update', teacher, {
      id: ipPlanId, status: 'closed', reviewNotes: `QA closing ${RUN}`,
    });
    assertStatus(closed, 200);
    const p = closed.data.plan;
    assert(p.status === 'closed' && p.closedAt, 'plan was not closed');
    assert(p.history.some((h) => h.action === 'closed'), 'close history missing');
    const week = await post('/api/teacher/intervention-plans/week', teacher, {
      id: ipPlanId, actions: [], reviewNotes: `QA ${RUN}`, progress: 100,
    });
    assertStatus(week, 400, 'weekly review on a closed plan must be rejected');
    assert(week.data.error === 'invalid_transition', `expected invalid_transition, got ${brief(week.data.error)}`);
    const missing = await post('/api/teacher/intervention-plans/week', teacher, {
      id: 'ip_missing', actions: [], reviewNotes: 'x', progress: 10,
    });
    assertStatus(missing, 404, 'unknown plan must return 404');
  });

  await check('interventions: admin oversight is global with summary and filters', async () => {
    const res = await get('/api/admin/intervention-plans', admin);
    assertStatus(res, 200);
    const plans = res.data.plans || [];
    assert(plans.length > 0, 'expected plans in admin view');
    assert(plans.some((p) => !state.allowedStudentIds.has(p.studentId)), 'admin view should include out-of-scope students');
    const s = res.data.summary || {};
    for (const key of ['total', 'active', 'reviewed', 'closed', 'dueReviews']) assertNumber(s[key], `summary.${key}`);
    assert(s.total === plans.length, 'summary total must match plan count');
    assertNumber((s.byLevel || {}).high, 'summary.byLevel.high');
    const filtered = await get('/api/admin/intervention-plans?status=closed', admin);
    assertStatus(filtered, 200);
    const closedOnly = filtered.data.plans || [];
    assert(closedOnly.length > 0 && closedOnly.every((p) => p.status === 'closed'), 'status filter did not apply');
  });

  await check('interventions: role and portal separation is enforced', async () => {
    for (const endpoint of ['/api/teacher/intervention-plans', '/api/teacher/intervention-plans/warnings']) {
      const asAdmin = await get(endpoint, admin);
      assertStatus(asAdmin, 403, `admin portal must not read ${endpoint}`);
      const asParent = await get(endpoint, state.parentToken);
      assertStatus(asParent, 403, `parent must not read ${endpoint}`);
      const asStudent = await get(endpoint, student);
      assertStatus(asStudent, 403, `student must not read ${endpoint}`);
    }
    const adminCreate = await post('/api/teacher/intervention-plans', admin, {
      studentId: state.inStudentA, goal: 'x', indicator: 'mood', baseline: 1, target: 2,
      unit: '%', nextReview: '2026-12-31', actions: ['x'],
    });
    assertStatus(adminCreate, 403, 'admin portal must not create teacher plans');
    const teacherAdmin = await get('/api/admin/intervention-plans', teacher);
    assertStatus(teacherAdmin, 403, 'teacher must not read admin oversight');
    const parentAdmin = await get('/api/admin/intervention-plans', state.parentToken);
    assertStatus(parentAdmin, 403, 'parent must not read admin oversight');
  });

  // ------------------------------- two-way messaging linked to case / card
  let ipThreadId = null;
  let ipThreadCommId = null;

  await check('messaging: threads are child-scoped for parents and teachers', async () => {
    const parentThreads = await get('/api/parent/threads', state.parentToken);
    assertStatus(parentThreads, 200);
    const pt = parentThreads.data.threads || [];
    assert(pt.length > 0, 'expected seeded threads for the parent');
    assert(pt.every((t) => ['s_sara', 's_yassine'].includes(t.studentId)), 'thread leaked outside parent scope');
    for (const key of ['studentName', 'className', 'caseFocus', 'cardSummary', 'messages', 'governance']) {
      assert(key in pt[0], `thread missing ${key}`);
    }
    const blocked = await get(`/api/parent/threads?studentId=${encodeURIComponent(state.outStudentId)}`, state.parentToken);
    assertStatus(blocked, 403, 'parent must be blocked from another child\'s threads');
    const teacherThreads = await get('/api/teacher/threads', teacher);
    assertStatus(teacherThreads, 200);
    const tt = teacherThreads.data.threads || [];
    assert(tt.length > 0 && tt.every((t) => state.allowedStudentIds.has(t.studentId)), 'teacher saw out-of-scope threads');
    const adminThreads = await get('/api/admin/threads', admin);
    assertStatus(adminThreads, 200);
    assertNumber((adminThreads.data.summary || {}).total, 'admin thread summary.total');
  });

  await check('messaging: parent creates a thread linked to a case and card', async () => {
    const bad = await post('/api/parent/threads', state.parentToken, {
      studentId: 's_sara', subject: '   ', body: 'x',
    });
    assertStatus(bad, 400, 'empty subject must be rejected');
    assert(bad.data.field === 'subject', `expected field subject, got ${brief(bad.data.field)}`);
    const badRef = await post('/api/parent/threads', state.parentToken, {
      studentId: 's_sara', caseId: 'case_adam', subject: `QA ${RUN}`, body: 'x',
    });
    assertStatus(badRef, 400, 'case from another child must be rejected');
    assert(badRef.data.error === 'invalid_reference', `expected invalid_reference, got ${brief(badRef.data.error)}`);
    const out = await post('/api/parent/threads', state.parentToken, {
      studentId: state.outStudentId, subject: `QA ${RUN}`, body: 'x',
    });
    assertStatus(out, 403, 'out-of-scope thread creation must be rejected');
    const created = await post('/api/parent/threads', state.parentToken, {
      studentId: 's_sara', caseId: 'case_sara', cardId: 'fc2',
      subject: `QA thread ${RUN}`, body: `QA body ${RUN}`,
    });
    assertStatus(created, 201);
    const t = created.data.thread;
    assert(t.status === 'open' && t.messages.length === 1 && t.messages[0].fromRole === 'parent', 'new thread defaults are wrong');
    assert(t.governance && t.governance.consent === 'granted' && t.governance.initiator === 'parent', 'parent initiation consent is missing');
    assert(t.communicationId, 'thread must link a communication');
    const comms = await get('/api/admin/communications', admin);
    const linked = (comms.data.communications || []).find((c) => c.id === t.communicationId);
    assert(linked && linked.channel === 'in_app' && linked.governance.consent === 'granted', 'linked in-app communication is wrong');
    ipThreadId = t.id;
    ipThreadCommId = t.communicationId;
    addMutation(`message thread ${t.id}: created by parent for QA run ${RUN}`);
  });

  await check('messaging: parent replies to a thread', async () => {
    const empty = await post('/api/parent/threads/reply', state.parentToken, { id: ipThreadId, body: '   ' });
    assertStatus(empty, 400, 'empty reply must be rejected');
    assert(empty.data.field === 'body', `expected field body, got ${brief(empty.data.field)}`);
    const replied = await post('/api/parent/threads/reply', state.parentToken, {
      id: ipThreadId, body: `QA parent reply ${RUN}`,
    });
    assertStatus(replied, 200);
    const t = replied.data.thread;
    assert(t.messages.length === 2 && t.messages[1].fromRole === 'parent', 'parent reply was not appended');
    assert(t.lastActivityAt, 'lastActivityAt was not updated');
    const cross = await post('/api/parent/threads/reply', teacher, { id: ipThreadId, body: 'x' });
    assertStatus(cross, 403, 'teacher must not use the parent reply route');
  });

  await check('messaging: teacher reply is governance and consent gated', async () => {
    const upd = await post('/api/admin/communications/update', admin, { id: ipThreadCommId, consent: 'declined' });
    assertStatus(upd, 200);
    const blocked = await post('/api/teacher/threads/reply', teacher, { id: ipThreadId, body: 'QA blocked' });
    assertStatus(blocked, 400, 'declined consent must block the teacher reply');
    assert(blocked.data.error === 'governance' && blocked.data.reason === 'consent_declined',
      `expected consent_declined, got ${brief(blocked.data.reason)}`);
    await post('/api/admin/communications/update', admin, { id: ipThreadCommId, consent: 'granted' });

    await post('/api/parent/privacy/preferences', state.parentToken, { allowCommunications: false });
    const blocked2 = await post('/api/teacher/threads/reply', teacher, { id: ipThreadId, body: 'QA blocked' });
    assertStatus(blocked2, 400, 'disabled communications must block the teacher reply');
    assert(blocked2.data.reason === 'communications_disabled', `expected communications_disabled, got ${brief(blocked2.data.reason)}`);
    await post('/api/parent/privacy/preferences', state.parentToken, { allowCommunications: true });

    const ok = await post('/api/teacher/threads/reply', teacher, { id: ipThreadId, body: `QA teacher reply ${RUN}` });
    assertStatus(ok, 200, 'teacher reply should succeed after consent is restored');
    const t = ok.data.thread;
    const last = t.messages[t.messages.length - 1];
    assert(last.fromRole === 'teacher' && last.body.includes(RUN), 'teacher reply was not appended');
    addMutation(`message thread ${ipThreadId}: teacher reply governance gates verified`);
  });

  await check('messaging: closing a thread stops further replies', async () => {
    const closed = await post('/api/teacher/threads/close', teacher, { id: ipThreadId });
    assertStatus(closed, 200);
    assert(closed.data.thread.status === 'closed', 'thread was not closed');
    const again = await post('/api/parent/threads/reply', state.parentToken, { id: ipThreadId, body: 'x' });
    assertStatus(again, 400, 'reply on a closed thread must be rejected');
    assert(again.data.error === 'invalid_transition', `expected invalid_transition, got ${brief(again.data.error)}`);
    const missing = await post('/api/parent/threads/close', state.parentToken, { id: 'mt_missing' });
    assertStatus(missing, 404, 'unknown thread must return 404');
  });

  await check('messaging: role and portal separation is enforced', async () => {
    const routes = ['/api/parent/threads', '/api/teacher/threads', '/api/admin/threads'];
    for (const endpoint of routes) {
      const asStudent = await get(endpoint, student);
      assertStatus(asStudent, 403, `student must not read ${endpoint}`);
    }
    const adminToParent = await get('/api/parent/threads', admin);
    assertStatus(adminToParent, 403, 'admin portal must not use parent thread routes');
    const parentToTeacher = await get('/api/teacher/threads', state.parentToken);
    assertStatus(parentToTeacher, 403, 'parent must not use teacher thread routes');
    const teacherToAdmin = await get('/api/admin/threads', teacher);
    assertStatus(teacherToAdmin, 403, 'teacher must not use admin thread routes');
    const studentCreate = await post('/api/parent/threads', student, { studentId: 's_sara', subject: 'x', body: 'x' });
    assertStatus(studentCreate, 403, 'student must not create threads');
  });

  // ---------------------------- lesson editor (objectives/activities/export)
  let lePlanId = null;

  await check('lessons: teacher sees scoped lesson plans with metadata', async () => {
    const res = await get('/api/teacher/lesson-plans', teacher);
    assertStatus(res, 200);
    const plans = res.data.plans || [];
    assert(plans.length > 0, 'expected seeded lesson plans');
    const levelIds = new Set(state.teacherClasses.map((c) => c.levelId));
    assert(plans.every((p) => levelIds.size === 0 || levelIds.has(p.levelId)), 'lesson plan leaked outside teacher level scope');
    const meta = res.data.meta || {};
    assert((meta.statuses || []).length === 3, 'status metadata is incomplete');
    assert((meta.terms || []).length === 3, 'term metadata is incomplete');
    for (const key of ['objectives', 'activities', 'differentiation', 'resources', 'status', 'history']) {
      assert(key in plans[0], `lesson plan missing ${key}`);
    }
    const view = await get(`/api/teacher/lesson-plans/view?id=${encodeURIComponent(plans[0].id)}`, teacher);
    assertStatus(view, 200);
    assert(view.data.plan && view.data.plan.id === plans[0].id, 'lesson view returned wrong plan');
    const missing = await get('/api/teacher/lesson-plans/view?id=lp_missing', teacher);
    assertStatus(missing, 404, 'unknown lesson plan must return 404');
  });

  await check('lessons: teacher creates a structured plan and validates fields', async () => {
    const curriculum = await get('/api/teacher/curriculum', teacher);
    assertStatus(curriculum, 200);
    const unit = (curriculum.data.items || []).find((c) => c.levelId && c.subjectId);
    assert(unit && unit.id, 'expected a curriculum unit to author against');
    const payload = {
      curriculumId: unit.id,
      lessonTitle: `QA lesson ${RUN}`,
      term: unit.term || 'الفصل 1',
      objectives: [`QA objective ${RUN}`],
      activities: [{ title: 'QA activity', type: 'practice', description: 'QA desc', durationMinutes: 15 }],
      differentiation: [{ group: 'support', need: 'QA need', strategy: 'QA strategy' }],
      resources: [{ title: 'QA resource', type: 'link', reference: 'https://example.test' }],
    };
    const bad = await post('/api/teacher/lesson-plans', teacher, { ...payload, objectives: [] });
    assertStatus(bad, 400, 'empty objectives must be rejected');
    assert(bad.data.field === 'objectives', `expected field objectives, got ${brief(bad.data.field)}`);
    const badAct = await post('/api/teacher/lesson-plans', teacher, {
      ...payload, activities: [{ title: 'x', type: 'invalid', description: 'x', durationMinutes: 10 }],
    });
    assertStatus(badAct, 400, 'invalid activity type must be rejected');
    assert(badAct.data.field === 'activities', `expected field activities, got ${brief(badAct.data.field)}`);
    const created = await post('/api/teacher/lesson-plans', teacher, payload);
    assertStatus(created, 201);
    const p = created.data.plan;
    assert(p.status === 'draft' && p.publishedAt === null, 'new plan must be a draft');
    assert(p.ownerRole === 'teacher' && p.objectives.length === 1, 'plan authoring fields are wrong');
    assert(p.activities[0].id && p.differentiation[0].id && p.resources[0].id, 'sub-item ids missing');
    assert(p.history.some((h) => h.action === 'created'), 'creation history missing');
    lePlanId = p.id;
    addMutation(`lesson plan ${p.id}: created by teacher for QA run ${RUN}`);
  });

  await check('lessons: teacher updates only drafts and submits for review', async () => {
    const updated = await post('/api/teacher/lesson-plans/update', teacher, {
      id: lePlanId, objectives: [`QA updated objective ${RUN}`],
    });
    assertStatus(updated, 200);
    assert(updated.data.plan.objectives[0].includes(RUN), 'update did not persist');
    assert(updated.data.plan.history.some((h) => h.action === 'updated'), 'update history missing');
    const submitted = await post('/api/teacher/lesson-plans/submit', teacher, { id: lePlanId });
    assertStatus(submitted, 200);
    assert(submitted.data.plan.status === 'in_review', 'submit did not set in_review');
    const again = await post('/api/teacher/lesson-plans/submit', teacher, { id: lePlanId });
    assertStatus(again, 400, 'submitting twice must be rejected');
    assert(again.data.error === 'invalid_transition', `expected invalid_transition, got ${brief(again.data.error)}`);
  });

  await check('lessons: admin reviews, publishes and enforces role gates', async () => {
    const listed = await get('/api/admin/lesson-plans', admin);
    assertStatus(listed, 200);
    const s = listed.data.summary || {};
    for (const key of ['total', 'draft', 'in_review', 'published']) assertNumber(s[key], `summary.${key}`);
    assert(s.total === (listed.data.plans || []).length, 'summary total mismatch');
    const bad = await post('/api/admin/lesson-plans/review', admin, { id: lePlanId, decision: 'nope' });
    assertStatus(bad, 400, 'invalid decision must be rejected');
    const published = await post('/api/admin/lesson-plans/review', admin, { id: lePlanId, decision: 'published', note: `QA ${RUN}` });
    assertStatus(published, 200);
    const p = published.data.plan;
    assert(p.status === 'published' && p.publishedAt && p.reviewedBy, 'publication was not stamped');
    const returned = await post('/api/admin/lesson-plans/review', admin, { id: lePlanId, decision: 'draft' });
    assertStatus(returned, 400, 'published plan should not be directly returnable');
    const editPublished = await post('/api/teacher/lesson-plans/update', teacher, { id: lePlanId, lessonTitle: 'x' });
    assertStatus(editPublished, 400, 'teacher must not edit a published plan');
    assert(editPublished.data.error === 'invalid_transition', `expected invalid_transition, got ${brief(editPublished.data.error)}`);
    const teacherReview = await post('/api/admin/lesson-plans/review', teacher, { id: lePlanId, decision: 'published' });
    assertStatus(teacherReview, 403, 'teacher must not use the admin review route');
    const studentList = await get('/api/admin/lesson-plans', student);
    assertStatus(studentList, 403, 'student must not read admin lesson plans');
    addMutation(`lesson plan ${lePlanId}: submitted and published by QA run ${RUN}`);
  });

  await check('lessons: package export supports csv and json downloads', async () => {
    const csv = await request('GET', '/api/admin/lesson-plans/export?format=csv', admin);
    assertStatus(csv, 200, 'csv export');
    assert(typeof csv.data === 'string' && csv.data.length > 20, 'csv body is empty');
    assert(csv.data.includes(','), 'csv body must be comma-separated');
    const json = await request('GET', '/api/admin/lesson-plans/export?format=json', admin);
    assertStatus(json, 200, 'json export');
    const arr = Array.isArray(json.data) ? json.data : null;
    assert(arr && arr.length > 0, 'json export must be a non-empty array');
    const teacherExport = await get('/api/admin/lesson-plans/export', teacher);
    assertStatus(teacherExport, 403, 'teacher must not export the package');
  });

  await check('lessons: role and portal separation is enforced', async () => {
    const endpoints = ['/api/teacher/lesson-plans', '/api/admin/lesson-plans'];
    for (const endpoint of endpoints) {
      const asStudent = await get(endpoint, student);
      assertStatus(asStudent, 403, `student must not read ${endpoint}`);
    }
    const adminToTeacher = await get('/api/teacher/lesson-plans', admin);
    assertStatus(adminToTeacher, 403, 'admin portal must not use teacher lesson routes');
    const teacherToAdmin = await get('/api/admin/lesson-plans', teacher);
    assertStatus(teacherToAdmin, 403, 'teacher must not use admin lesson routes');
    const parentToTeacher = await get('/api/teacher/lesson-plans', state.parentToken);
    assertStatus(parentToTeacher, 403, 'parent must not read teacher lesson plans');
  });

  // --------------------- Moroccan primary grading (weighted average engine)
  let grEntryId = null;

  await check('grading: policy and entries are scoped and validated', async () => {
    const cfg = await get('/api/teacher/grades/config', teacher);
    assertStatus(cfg, 200);
    const policy = cfg.data.policy || {};
    assert(policy.scale === 20 && policy.successThreshold === 10, 'default scale/threshold are wrong');
    assert(Object.keys(policy.subjectCoefficients || {}).length > 0, 'subject coefficients missing');
    assert((cfg.data.subjects || []).length > 0, 'subjects missing from config');
    const entries = await get('/api/teacher/grades/entries', teacher);
    assertStatus(entries, 200);
    assert((entries.data.entries || []).length >= 10, 'expected seeded grade entries');
    assert((entries.data.meta || {}).cycles?.length === 2, 'cycle metadata missing');
    const blocked = await get(`/api/teacher/grades/entries?studentId=${encodeURIComponent(state.outStudentId)}`, teacher);
    assertStatus(blocked, 403, 'teacher must be blocked from out-of-scope grades');
  });

  await check('grading: entry creation validates scores and computes average', async () => {
    const bad = await post('/api/teacher/grades/entries', teacher, {
      studentId: state.inStudentA, cycle: 'cycle1', subjectId: 'sub_math',
      tests: [{ label: 't1', score: 25, coefficient: 1 }], participationScore: 16, subjectCoefficient: 4,
    });
    assertStatus(bad, 400, 'score above scale must be rejected');
    assert(bad.data.field === 'score', `expected field score, got ${brief(bad.data.field)}`);
    const badCoef = await post('/api/teacher/grades/entries', teacher, {
      studentId: state.inStudentA, cycle: 'cycle1', subjectId: 'sub_math',
      tests: [{ label: 't1', score: 10, coefficient: 0 }], participationScore: 16, subjectCoefficient: 4,
    });
    assertStatus(badCoef, 400, 'zero coefficient must be rejected');
    const created = await post('/api/teacher/grades/entries', teacher, {
      studentId: state.inStudentA, cycle: 'cycle1', subjectId: 'sub_math',
      tests: [{ label: `QA ${RUN}`, score: 14, coefficient: 1 }, { label: 't2', score: 12, coefficient: 1 }],
      participationScore: 16, subjectCoefficient: 4,
    });
    assertStatus(created, 201);
    const e = created.data.entry;
    assert(e.status === 'draft' && e.enteredBy, 'entry defaults are wrong');
    assertNumber(created.data.derived.subjectAverage, 'derived.subjectAverage');
    assert(created.data.derived.subjectAverage > 12 && created.data.derived.subjectAverage < 15,
      `weighted subject average is off: ${brief(created.data.derived.subjectAverage)}`);
    grEntryId = e.id;
    addMutation(`grade entry ${e.id}: created by teacher for QA run ${RUN}`);
  });

  await check('grading: submit is immutable and admin approval is audited', async () => {
    const upd = await post('/api/teacher/grades/entries/update', teacher, {
      id: grEntryId, participationScore: 18,
    });
    assertStatus(upd, 200, 'draft update should succeed');
    const submitted = await post('/api/teacher/grades/entries/submit', teacher, { id: grEntryId });
    assertStatus(submitted, 200);
    assert(submitted.data.entry.status === 'submitted', 'submit did not set status');
    const again = await post('/api/teacher/grades/entries/submit', teacher, { id: grEntryId });
    assertStatus(again, 400, 'double submit must be rejected');
    assert(again.data.error === 'invalid_transition', `expected invalid_transition, got ${brief(again.data.error)}`);
    const editSubmitted = await post('/api/teacher/grades/entries/update', teacher, { id: grEntryId, participationScore: 10 });
    assertStatus(editSubmitted, 400, 'submitted entry must be immutable to teacher');
    const approved = await post('/api/admin/grades/approve', admin, { id: grEntryId });
    assertStatus(approved, 200);
    assert(approved.data.entry.status === 'approved' && approved.data.entry.approvedBy, 'approval was not stamped');
    const double = await post('/api/admin/grades/approve', admin, { id: grEntryId });
    assertStatus(double, 400, 'double approval must be rejected');
    addMutation(`grade entry ${grEntryId}: submitted and approved by QA run ${RUN}`);
  });

  await check('grading: compute yields advisory result with decision and mention', async () => {
    const res = await post('/api/teacher/grades/compute', teacher, {
      studentId: state.inStudentA, cycle: 'cycle1',
    });
    assertStatus(res, 200);
    const r = res.data.result || {};
    assert(r.advisory === true, 'grading result must be advisory');
    assert(['success', 'fail'].includes(r.decision), `invalid decision ${brief(r.decision)}`);
    assert(typeof r.mention === 'string' && r.mention.length > 0, 'mention is required');
    assertNumber(r.cycle1, 'cycle1 average');
    assert(r.cycles && r.cycles.cycle1 && Array.isArray(r.cycles.cycle1.subjects), 'cycle detail missing');
    assert(Array.isArray(r.failingSubjects), 'failingSubjects must be an array');
    const blocked = await post('/api/teacher/grades/compute', teacher, { studentId: state.outStudentId });
    assertStatus(blocked, 403, 'teacher must not compute out-of-scope results');
  });

  await check('grading: admin results and pdf-data export are global', async () => {
    const res = await get('/api/admin/grades/results', admin);
    assertStatus(res, 200);
    const results = res.data.results || [];
    assert(results.length > 0, 'expected computed results');
    for (const key of ['studentId', 'studentName', 'className', 'mention', 'decision']) {
      assert(key in results[0], `result missing ${key}`);
    }
    const s = res.data.summary || {};
    for (const key of ['total', 'success', 'fail']) assertNumber(s[key], `summary.${key}`);
    const exportRes = await request('GET', '/api/admin/grades/export?format=pdf-data', admin);
    assertStatus(exportRes, 200, 'pdf-data export');
    const report = exportRes.data || {};
    assert(report.institution && report.institution.name, 'report institution missing');
    assert(Array.isArray(report.classes) && report.classes.length > 0, 'report classes missing');
    assert(report.advisory === true, 'report must be advisory');
    const teacherExport = await get('/api/admin/grades/export', teacher);
    assertStatus(teacherExport, 403, 'teacher must not export grade reports');
  });

  await check('grading: role and portal separation is enforced', async () => {
    const teacherRoutes = ['/api/teacher/grades/config', '/api/teacher/grades/entries'];
    for (const endpoint of teacherRoutes) {
      const asAdmin = await get(endpoint, admin);
      assertStatus(asAdmin, 403, `admin portal must not read ${endpoint}`);
      const asStudent = await get(endpoint, student);
      assertStatus(asStudent, 403, `student must not read ${endpoint}`);
    }
    const adminRoutes = ['/api/admin/grades/config', '/api/admin/grades/results'];
    for (const endpoint of adminRoutes) {
      const asTeacher = await get(endpoint, teacher);
      assertStatus(asTeacher, 403, `teacher must not read ${endpoint}`);
      const asParent = await get(endpoint, state.parentToken);
      assertStatus(asParent, 403, `parent must not read ${endpoint}`);
    }
    const badConfig = await post('/api/admin/grades/config', admin, { policy: { scale: 0 } });
    assertStatus(badConfig, 400, 'invalid grading policy must be rejected');
  });

  // ------------------- lesson content, reader & timed assessments
  await check('learning: published lesson contents are student-level scoped', async () => {
    const list = await get('/api/student/lesson-contents', student);
    assertStatus(list, 200);
    const contents = list.data.contents || [];
    assert(contents.length > 0, 'expected published lesson contents');
    for (const key of ['lessonId', 'title', 'subject', 'duration', 'hasQuiz']) {
      assert(key in contents[0], `lesson content missing ${key}`);
    }
    const view = await get('/api/student/lesson-contents/view?id=cur1:0', student);
    assertStatus(view, 200, 'student should read a published l_p4 lesson');
    const c = view.data.content || {};
    assert(Array.isArray(c.sections) && c.sections.length > 0, 'lesson sections missing');
    assert(Array.isArray(c.keyTerms) && Array.isArray(c.workedExamples), 'lesson terms/examples missing');
    const questions = await get('/api/student/lesson-contents/questions?lessonId=cur1:0', student);
    assertStatus(questions, 200);
    assert((questions.data.questions || []).length > 0, 'expected lesson quiz questions');
    for (const q of questions.data.questions) {
      assert(!('correctIndex' in q) && !('explanation' in q), 'correct answer leaked to student');
    }
    const marked = await post('/api/student/lesson-contents/view', student, { lessonId: 'cur1:0' });
    assertStatus(marked, 200, 'marking a lesson read must be idempotent');
    const progress = await get('/api/student/lesson-contents/progress', student);
    assertStatus(progress, 200);
    assert((progress.data.progress || []).some((p) => p.lessonId === 'cur1:0'), 'read progress not recorded');
  });

  await check('learning: timed assessment returns metadata without leaking answers', async () => {
    const take = await get('/api/student/formative-assessments/fa_demo1', student);
    assertStatus(take, 200);
    assertNumber(take.data.timeLimitSeconds, 'timeLimitSeconds');
    assert(take.data.startedAt && take.data.serverNow, 'timing metadata missing');
    for (const q of take.data.questions || []) {
      assert(!('correctIndex' in q), 'correctIndex leaked in take response');
    }
    const submit = await post('/api/student/formative-assessments/fa_demo1/submit', student, {
      answers: {}, durationSeconds: take.data.timeLimitSeconds + 60,
    });
    assertStatus(submit, 200);
    const a = submit.data.attempt || {};
    assert(a.advisory === true, 'attempt must be advisory');
    assertNumber(a.attemptNumber, 'attemptNumber');
    assertNumber(a.durationSeconds, 'durationSeconds');
    assert(a.late === true, 'over-time attempt must be flagged late');
    addMutation(`timed assessment attempt ${a.id}: submitted late by QA run ${RUN}`);
  });

  await check('learning: lesson content and timed exams enforce scope and roles', async () => {
    const teacherList = await get('/api/teacher/lesson-contents', teacher);
    assertStatus(teacherList, 200);
    const adminPublish = await post('/api/admin/lesson-contents/publish', admin, { id: 'lc_missing' });
    assertStatus(adminPublish, 404, 'publishing an unknown content must 404');
    const teacherPublish = await post('/api/admin/lesson-contents/publish', teacher, { id: 'lc_demo_1' });
    assertStatus(teacherPublish, 403, 'teacher must not publish content');
    const parentList = await get('/api/student/lesson-contents', state.parentToken);
    assertStatus(parentList, 403, 'parent must not read student lesson contents');
    const adminList = await get('/api/student/lesson-contents', admin);
    assertStatus(adminList, 403, 'admin portal must not read student lesson contents');
  });

  await check('learning: multilingual audio, mascot and enriched kid-friendly content are present', async () => {
    const root = path.join(__dirname, '..');
    const audioDir = path.join(root, 'apps', 'web', 'public', 'audio', 'amz');
    const wavs = fs.readdirSync(audioDir).filter((f) => f.endsWith('.wav'));
    if (wavs.length < 30) throw new Error(`expected >=30 Amazigh WAV clips, found ${wavs.length}`);
    for (const f of wavs) {
      if (fs.statSync(path.join(audioDir, f)).size < 1000) throw new Error(`empty/undersized clip: ${f}`);
    }
    const manifest = JSON.parse(fs.readFileSync(path.join(audioDir, 'manifest.json'), 'utf8'));
    if (!manifest || typeof manifest !== 'object') throw new Error('invalid audio manifest');
    const clipIds = Object.keys(manifest.items || {});
    if (clipIds.length !== wavs.length) throw new Error(`manifest has ${clipIds.length} clips but ${wavs.length} WAV files exist`);
    for (const [id, item] of Object.entries(manifest.items || {})) {
      if (!wavs.includes(item.file)) throw new Error(`manifest clip ${id} has no WAV ${item.file}`);
      if (fs.statSync(path.join(audioDir, item.file)).size !== item.bytes) {
        throw new Error(`manifest byte size drift for ${id}`);
      }
    }
    const speechSource = fs.readFileSync(path.join(root, 'apps', 'web', 'src', 'lib', 'speech.ts'), 'utf8');
    for (const id of clipIds) {
      if (!speechSource.includes(`'${id}'`)) throw new Error(`speech helper is missing clip ${id}`);
    }

    const mascot = path.join(root, 'apps', 'web', 'public', 'mascot-sun.svg');
    if (!fs.existsSync(mascot)) throw new Error('mascot-sun.svg missing');
    if (!/viewBox/.test(fs.readFileSync(mascot, 'utf8'))) throw new Error('mascot SVG is not a valid scalable asset');

    const speech = fs.readFileSync(path.join(root, 'apps', 'web', 'src', 'lib', 'speech.ts'), 'utf8');
    for (const locale of ['ar-MA', 'fr-FR', 'en-GB', 'zgh']) {
      if (!speech.includes(locale)) throw new Error(`speech helper missing locale ${locale}`);
    }
    if (!speech.includes('/audio/amz/')) throw new Error('speech helper does not reference recorded Amazigh clips');
    for (const guard of ['needsArabic', 'needsTifinagh', 'voiceschanged']) {
      if (!speech.includes(guard)) throw new Error(`speech helper is missing safety guard ${guard}`);
    }
    const button = fs.readFileSync(path.join(root, 'apps', 'web', 'src', 'components', 'SpeakButton.tsx'), 'utf8');
    if (!/aria-label/.test(button) || !/Volume2/.test(button)) throw new Error('SpeakButton is not accessible/visual');
    if (!button.includes('inFlight')) throw new Error('SpeakButton is missing the double-click guard');
    if (!button.includes('contentLocale')) throw new Error('SpeakButton cannot honour a content language');

    const db = JSON.parse(fs.readFileSync(path.join(root, 'backend', 'data.json'), 'utf8'));
    if (db.demoLessonContentSeed !== 'v6') throw new Error(`lesson content seed guard is ${db.demoLessonContentSeed}, expected v6`);
    if ((db.lessonContents || []).length < 52) throw new Error(`expected >=52 lesson contents, found ${(db.lessonContents || []).length}`);
    const sections = (db.lessonContents || []).reduce((n, c) => n + (c.sections?.length || 0), 0);
    if (sections < 190) throw new Error(`expected >=190 enriched sections, found ${sections}`);
    const withoutIcon = (db.lessonContents || []).flatMap((c) => c.sections || []).filter((s) => !s.icon);
    if (withoutIcon.length) throw new Error(`${withoutIcon.length} sections have no playful icon`);

    const locales = ['ar', 'fr', 'en', 'amz'];
    for (const code of locales) {
      const text = fs.readFileSync(path.join(root, 'apps', 'web', 'src', 'i18n', 'locales', `${code}.ts`), 'utf8');
      for (const key of ['speakLabel', 'speakSection', 'speakQuestion', 'lpSections']) {
        if (!new RegExp(`^\\s{2}(?:'${key}'|${key}):`, 'm').test(text)) {
          throw new Error(`${code}.ts missing audio key ${key}`);
        }
      }
    }
  });

  await check('learning: scientific lessons are trilingual with aligned variants and language badge', async () => {
    const root = path.join(__dirname, '..');
    const db = JSON.parse(fs.readFileSync(path.join(root, 'backend', 'data.json'), 'utf8'));
    const trilingual = (db.lessonContents || []).filter(
      (c) => c.translations && c.translations.fr && c.translations.en,
    );
    if (trilingual.length < 25) throw new Error(`expected >=25 trilingual lessons, found ${trilingual.length}`);
    for (const content of trilingual) {
      for (const lang of ['fr', 'en']) {
        const variant = content.translations[lang];
        if (!variant.title || !variant.intro) throw new Error(`${content.id}/${lang} missing title or intro`);
        if (!Array.isArray(variant.sections) || variant.sections.length !== content.sections.length) {
          throw new Error(`${content.id}/${lang} section count differs from Arabic base`);
        }
        if (!Array.isArray(variant.keyTerms) || variant.keyTerms.length !== (content.keyTerms || []).length) {
          throw new Error(`${content.id}/${lang} keyTerms are not aligned`);
        }
        if (!Array.isArray(variant.workedExamples) || variant.workedExamples.length !== (content.workedExamples || []).length) {
          throw new Error(`${content.id}/${lang} workedExamples are not aligned`);
        }
        content.sections.forEach((base, i) => {
          const translated = variant.sections[i];
          if (translated.id !== base.id) throw new Error(`${content.id}/${lang} section ${i} id drifted`);
          if (translated.icon !== base.icon) throw new Error(`${content.id}/${lang} section ${i} icon drifted`);
          if (translated.mediaType !== base.mediaType) throw new Error(`${content.id}/${lang} section ${i} mediaType drifted`);
          if (translated.heading === base.heading && translated.body === base.body) {
            throw new Error(`${content.id}/${lang} section ${i} is not translated`);
          }
        });
      }
    }

    const speech = fs.readFileSync(path.join(root, 'apps', 'web', 'src', 'lib', 'speech.ts'), 'utf8');
    if (!/detectLocale/.test(speech)) throw new Error('speech helper is missing script-aware detectLocale');
    if (!/byPrefix\('ar'\)/.test(speech)) throw new Error('speech helper is missing Arabic voice fallback');

    const player = fs.readFileSync(
      path.join(root, 'apps', 'web', 'src', 'pages', 'family', 'LearningPath.tsx'), 'utf8',
    );
    for (const token of ['localizeContent', 'contentLang', 'lpContentLanguage']) {
      if (!player.includes(token)) throw new Error(`LearningPath is missing ${token}`);
    }

    const locales = ['ar', 'fr', 'en', 'amz'];
    for (const code of locales) {
      const text = fs.readFileSync(path.join(root, 'apps', 'web', 'src', 'i18n', 'locales', `${code}.ts`), 'utf8');
      for (const key of ['lpContentLanguage', 'langArabic', 'langFrench', 'langEnglish']) {
        if (!new RegExp(`^\\s{2}(?:'${key}'|${key}):`, 'm').test(text)) {
          throw new Error(`${code}.ts missing language badge key ${key}`);
        }
      }
    }
  });

  await check('learning: v4 curriculum adds French lessons with worked examples and illustrative diagrams', async () => {
    const root = path.join(__dirname, '..');
    const db = JSON.parse(fs.readFileSync(path.join(root, 'backend', 'data.json'), 'utf8'));
    const contents = db.lessonContents || [];

    // French-language lessons across the primary cycle (lower + upper).
    const french = contents.filter((c) => c.subjectId === 'sub_fr');
    if (french.length < 16) throw new Error(`expected >=16 French lessons, found ${french.length}`);
    const levels = new Set(french.map((c) => c.levelId));
    for (const level of ['l_pre', 'l_p1', 'l_p2', 'l_p3', 'l_p4', 'l_p5', 'l_p6']) {
      if (!levels.has(level)) throw new Error(`no French lesson for level ${level}`);
    }

    // Every v4 lesson must include at least one worked explanation example.
    const v4 = contents.filter((c) => String(c.id).startsWith('lc_v4_'));
    if (v4.length < 25) throw new Error(`expected >=25 v4 lessons, found ${v4.length}`);
    for (const content of v4) {
      if (!Array.isArray(content.workedExamples) || !content.workedExamples.length) {
        throw new Error(`${content.id} has no worked explanation example`);
      }
      for (const example of content.workedExamples) {
        if (!example.prompt || !Array.isArray(example.steps) || example.steps.length < 2 || !example.answer) {
          throw new Error(`${content.id} has an incomplete worked example`);
        }
      }
    }

    // Illustrative diagrams must be referenced and actually exist on disk.
    const diagramDir = path.join(root, 'apps', 'web', 'public', 'illustrations', 'diagrams');
    if (!fs.existsSync(diagramDir)) throw new Error('illustrative diagram directory missing');
    const illustrated = contents.filter((c) => (c.sections || []).some((s) => s.mediaType === 'image' && s.mediaUrl));
    if (illustrated.length < 12) throw new Error(`expected >=12 illustrated lessons, found ${illustrated.length}`);
    const publicDir = path.join(root, 'apps', 'web', 'public');
    const referenced = new Set(
      contents.flatMap((c) => (c.sections || []).filter((s) => s.mediaType === 'image' && s.mediaUrl).map((s) => s.mediaUrl)),
    );
    for (const url of referenced) {
      if (!/^\/illustrations\/(?:diagrams\/)?[\w-]+\.svg$/.test(url)) {
        throw new Error(`unexpected illustration reference ${url}`);
      }
      const file = path.join(publicDir, url.replace(/^\//, ''));
      if (!fs.existsSync(file)) throw new Error(`referenced illustration missing: ${url}`);
      const svg = fs.readFileSync(file, 'utf8');
      if (!/viewBox/.test(svg) || !/role="img"/.test(svg) || !/<title[\s>]/.test(svg)) {
        throw new Error(`illustration ${url} is not a valid accessible SVG`);
      }
    }

    // Curated French lower/upper modules must be present as source modules.
    for (const mod of ['fr-lessons-lower.js', 'fr-lessons-upper.js', 'ar-subjects-lessons.js']) {
      if (!fs.existsSync(path.join(root, 'scripts', 'curriculum-content', mod))) {
        throw new Error(`missing v4 content module ${mod}`);
      }
    }
  });

  await check('learning: Morocco map uses the official contiguous-territory convention', async () => {
    const file = path.join(__dirname, '..', 'apps', 'web', 'public', 'illustrations', 'diagrams', 'diagram-morocco-map.svg');
    if (!fs.existsSync(file)) throw new Error('Morocco map illustration is missing');
    const svg = fs.readFileSync(file, 'utf8');

    // Accessible, scalable teaching asset.
    if (!/viewBox="0 0 640 360"/.test(svg)) throw new Error('Morocco map lost its viewBox');
    if (!/role="img"/.test(svg) || !/<title[\s>]/.test(svg) || !/<desc[\s>]/.test(svg)) {
      throw new Error('Morocco map is not accessible');
    }
    if (!/المملكة المغربية/.test(svg) || !/Royaume du Maroc/.test(svg)) {
      throw new Error('Morocco map title is missing the official kingdom wording');
    }

    // The sensitive part: no dashed dividing line and no "not cartographic"
    // disclaimer may reappear; the territory must read as one continuous whole.
    if (/stroke-dasharray/.test(svg)) throw new Error('Morocco map contains a dashed partition line');
    if (/non cartographique|schéma simplifié|non-cartographic/i.test(svg)) {
      throw new Error('Morocco map caption undermines the official outline');
    }
    const territory = svg.match(/<path\s+d="([^"]+)"/);
    if (!territory) throw new Error('Morocco map has no territory outline');
    if ((territory[1].match(/ Z/g) || []).length < 2) {
      throw new Error('Morocco map territory is not drawn as one continuous two-part outline');
    }

    // Correctly placed cities and an accurate flag star, with RTL labels that
    // stay inside the viewBox (text-anchor="end" would overflow for RTL).
    for (const city of ['الرباط', 'الدار البيضاء', 'مراكش', 'Rabat', 'Casablanca', 'Marrakech']) {
      if (!svg.includes(city)) throw new Error(`Morocco map is missing city label ${city}`);
    }
    if (!/fill="#c1272d"/.test(svg) || !/stroke="#006233"/.test(svg)) {
      throw new Error('Morocco map flag colours are wrong');
    }
    if (!/m45000 17308/.test(svg)) {
      throw new Error('Morocco map does not use the authentic interlaced pentagram');
    }
    if (/text-anchor="end" direction="rtl"/.test(svg)) {
      throw new Error('Morocco map RTL labels overflow the viewBox');
    }
  });

  await check('learning: interactive practice widgets and institutional illustrations are present', async () => {
    const root = path.join(__dirname, '..');
    const web = path.join(root, 'apps', 'web');
    const interactive = path.join(web, 'src', 'components', 'interactive');
    for (const name of ['MatchPairsGame.tsx', 'QuickQuiz.tsx', 'StarProgress.tsx', 'index.ts']) {
      if (!fs.existsSync(path.join(interactive, name))) throw new Error(`missing interactive component ${name}`);
    }
    const player = fs.readFileSync(path.join(web, 'src', 'pages', 'family', 'LearningPath.tsx'), 'utf8');
    for (const token of ['MatchPairsGame', 'QuickQuiz', 'StarProgress']) {
      if (!player.includes(token)) throw new Error(`LearningPath does not use ${token}`);
    }
    const artDir = path.join(web, 'public', 'illustrations');
    const expected = [
      'sun-garden.svg', 'mascot-celebrate.svg', 'mascot-thinking.svg', 'icon-math.svg',
      'icon-science.svg', 'icon-reading.svg', 'sticker-star.svg', 'sticker-trophy.svg',
    ];
    for (const name of expected) {
      const file = path.join(artDir, name);
      if (!fs.existsSync(file)) throw new Error(`missing illustration ${name}`);
      const svg = fs.readFileSync(file, 'utf8');
      if (!/viewBox/.test(svg) || !/role="img"/.test(svg) || !/<title[\s>]/.test(svg)) {
        throw new Error(`illustration ${name} is not an accessible scalable SVG`);
      }
    }
    for (const code of ['ar', 'fr', 'en', 'amz']) {
      const text = fs.readFileSync(path.join(web, 'src', 'i18n', 'locales', `${code}.ts`), 'utf8');
      for (const key of ['lpInteractiveTitle', 'lpMatchTitle', 'lpQuickPractice', 'lpProgressReward', 'lpTerm', 'lpMoves']) {
        if (!new RegExp(`^\\s{2}(?:'${key}'|${key}):`, 'm').test(text)) {
          throw new Error(`${code}.ts missing interactive key ${key}`);
        }
      }
    }
  });

  await check('curriculum: v5 outcome-linked lessons and trilingual outcome catalogue are seeded', async () => {
    const root = path.join(__dirname, '..');
    for (const mod of ['v5-outcomes-lessons.js', 'v5-outcome-catalog.js']) {
      const file = path.join(root, 'scripts', 'curriculum-content', mod);
      if (!fs.existsSync(file)) throw new Error(`missing v5 content module ${mod}`);
    }
    const db = JSON.parse(fs.readFileSync(path.join(root, 'backend', 'data.json'), 'utf8'));
    const contents = db.lessonContents || [];
    const v5 = contents.filter((c) => String(c.id).startsWith('lc_v5_'));
    if (v5.length < 12) throw new Error(`expected >=12 v5 lessons, found ${v5.length}`);

    const catalogue = db.learningOutcomes || [];
    if (catalogue.length < 24) throw new Error(`expected >=24 learning outcomes, found ${catalogue.length}`);
    const byCode = new Map(catalogue.map((o) => [o.code, o]));
    if (byCode.size !== catalogue.length) throw new Error('duplicate learning-outcome codes');
    for (const outcome of catalogue) {
      if (!/^LO-l_(?:pre|p[1-6])-sub_(?:math|ar|fr|sci|isl|histgeo|amz)-\d+$/.test(outcome.code)) {
        throw new Error(`malformed outcome code ${outcome.code}`);
      }
      for (const field of ['levelId', 'subjectId', 'textAr', 'textFr', 'textEn']) {
        if (!outcome[field]) throw new Error(`outcome ${outcome.code} missing ${field}`);
      }
    }
    for (const level of ['l_pre', 'l_p1', 'l_p2', 'l_p3', 'l_p4', 'l_p5', 'l_p6']) {
      if (!catalogue.some((o) => o.levelId === level)) throw new Error(`no learning outcome for ${level}`);
    }
    for (const subject of ['sub_math', 'sub_ar', 'sub_fr', 'sub_sci', 'sub_isl', 'sub_histgeo', 'sub_amz']) {
      if (!catalogue.some((o) => o.subjectId === subject)) throw new Error(`no learning outcome for ${subject}`);
    }

    const linked = new Set();
    for (const content of v5) {
      if (!Array.isArray(content.learningOutcomes) || content.learningOutcomes.length < 2) {
        throw new Error(`${content.id} has fewer than two learning outcomes`);
      }
      for (const lo of content.learningOutcomes) {
        for (const field of ['code', 'textAr', 'textFr', 'textEn']) {
          if (!lo[field]) throw new Error(`${content.id} learning outcome missing ${field}`);
        }
        if (!byCode.has(lo.code)) throw new Error(`${content.id} references unknown outcome ${lo.code}`);
        linked.add(lo.code);
      }
      if (!Array.isArray(content.workedExamples) || !content.workedExamples.length) {
        throw new Error(`${content.id} has no worked example`);
      }
      for (const example of content.workedExamples) {
        if (!example.prompt || !Array.isArray(example.steps) || example.steps.length < 2 || !example.answer) {
          throw new Error(`${content.id} has an incomplete worked example`);
        }
      }
      if (!content.sections?.length) throw new Error(`${content.id} has no sections`);
      for (const section of content.sections) {
        if (!section.icon) throw new Error(`${content.id} section ${section.id} has no icon`);
      }
      for (const lang of ['fr', 'en']) {
        const variant = content.translations?.[lang];
        if (!variant?.sections || variant.sections.length !== content.sections.length) {
          throw new Error(`${content.id}/${lang} sections are not aligned`);
        }
      }
    }
    if (linked.size < 24) throw new Error(`v5 lessons only cover ${linked.size} distinct outcomes`);

    const qIds = new Set((db.questionBank || []).map((q) => q.id));
    for (let n = 1; n <= 24; n++) {
      if (!qIds.has(`q_v5_${n}`)) throw new Error(`missing v5 question q_v5_${n}`);
    }
  });

  await check('curriculum: v6 gives every declared lesson real content and varied practice', async () => {
    const root = path.join(__dirname, '..');
    const { execFileSync } = require('child_process');
    if (!fs.existsSync(path.join(root, 'scripts', 'curriculum-content', 'v6-coverage.js'))) {
      throw new Error('missing v6-coverage.js');
    }
    if (!fs.existsSync(path.join(root, 'scripts', 'validate-v6-content.js'))) {
      throw new Error('missing validate-v6-content.js');
    }
    for (const letter of 'ABCDEFGH') {
      for (const prefix of ['v6-manifest-', 'v6-content-']) {
        const name = `${prefix}${letter}.${prefix === 'v6-manifest-' ? 'json' : 'js'}`;
        if (!fs.existsSync(path.join(root, 'scripts', 'curriculum-content', name))) {
          throw new Error(`missing ${name}`);
        }
      }
    }
    const staticCheck = execFileSync(process.execPath, ['scripts/validate-v6-content.js'], {
      cwd: root, encoding: 'utf8',
    });
    if (!/0 problems/.test(staticCheck)) throw new Error(`v6 static validation failed: ${staticCheck.slice(0, 400)}`);

    const db = JSON.parse(fs.readFileSync(path.join(root, 'backend', 'data.json'), 'utf8'));
    if (db.demoLessonContentSeed !== 'v6') throw new Error(`seed guard is ${db.demoLessonContentSeed}, expected v6`);
    const declared = [];
    for (const unit of db.curriculum || []) {
      (unit.lessons || []).forEach((_, index) => declared.push(`${unit.id}:${index}`));
    }
    const contents = db.lessonContents || [];
    const byLessonId = new Map();
    for (const content of contents) {
      if (byLessonId.has(content.lessonId)) throw new Error(`duplicate content for lesson ${content.lessonId}`);
      byLessonId.set(content.lessonId, content);
    }
    for (const lessonId of declared) {
      if (!byLessonId.has(lessonId)) throw new Error(`curriculum slot ${lessonId} has no lesson content`);
    }
    for (const unit of db.curriculum || []) {
      for (const title of unit.lessons || []) {
        if (/^(درس|Leçon|Lesson|Lektion|الوحدة)\s*\d+$/i.test(String(title).trim())) {
          throw new Error(`generic curriculum title remains: ${unit.id} — ${title}`);
        }
      }
    }

    const v6 = contents.filter((c) => String(c.id).startsWith('lc_v6_'));
    if (v6.length < 320) throw new Error(`expected >=320 v6 lessons, found ${v6.length}`);
    const questionIds = new Set((db.questionBank || []).map((q) => q.id));
    const prompts = new Set();
    for (const content of v6) {
      if ((content.sections || []).length !== 6) throw new Error(`${content.id} does not have six sections`);
      if ((content.workedExamples || []).length !== 2) throw new Error(`${content.id} does not have two worked examples`);
      if ((content.quizQuestionIds || []).length !== 4) throw new Error(`${content.id} does not have four practice questions`);
      if ((content.sections || []).some((s) => !s.icon)) throw new Error(`${content.id} has a section without an icon`);
      for (const id of content.quizQuestionIds || []) {
        if (!questionIds.has(id)) throw new Error(`${content.id} references missing question ${id}`);
      }
    }
    for (const question of db.questionBank || []) {
      if (String(question.id).startsWith('q_v6_')) {
        if (prompts.has(question.prompt)) throw new Error(`duplicated practice prompt ${question.prompt}`);
        prompts.add(question.prompt);
      }
    }
    const trilingual = contents.filter((c) => c.translations?.fr && c.translations?.en).length;
    if (trilingual < 80) throw new Error(`expected >=80 trilingual lessons, found ${trilingual}`);
  });

  await check('teachers: authoring studio and training program are wired with i18n', async () => {
    const root = path.join(__dirname, '..');
    const web = path.join(root, 'apps', 'web');
    const studio = path.join(web, 'src', 'pages', 'teacher', 'LessonStudio.tsx');
    const training = path.join(web, 'src', 'pages', 'teacher', 'TeacherTraining.tsx');
    if (!fs.existsSync(studio)) throw new Error('LessonStudio.tsx is missing');
    if (!fs.existsSync(training)) throw new Error('TeacherTraining.tsx is missing');
    const studioSource = fs.readFileSync(studio, 'utf8');
    const trainingSource = fs.readFileSync(training, 'utf8');
    for (const token of ['ryad-lesson-studio-draft', 'studioExamples', 'studioOutcomes', 'diagram-morocco-map.svg', 'studioSubmit', 'clipboard']) {
      if (!studioSource.includes(token)) throw new Error(`LessonStudio is missing ${token}`);
    }
    for (const token of ['ryad-teacher-training', 'localStorage', 'k-anonymity', 'progressbar', 'fieldset', 'trainingM5Title']) {
      if (!trainingSource.toLowerCase().includes(token.toLowerCase())) {
        throw new Error(`TeacherTraining is missing ${token}`);
      }
    }
    const app = fs.readFileSync(path.join(web, 'src', 'App.tsx'), 'utf8');
    for (const token of ["pages/teacher/LessonStudio", "pages/teacher/TeacherTraining", "/teacher/lesson-studio", "/teacher/training"]) {
      if (!app.includes(token)) throw new Error(`App.tsx is missing ${token}`);
    }
    const layout = fs.readFileSync(path.join(web, 'src', 'components', 'Layout.tsx'), 'utf8');
    for (const token of ['navLessonStudio', 'navTeacherTraining']) {
      if (!layout.includes(token)) throw new Error(`Layout.tsx is missing ${token}`);
    }
    for (const code of ['ar', 'fr', 'en', 'amz']) {
      const text = fs.readFileSync(path.join(web, 'src', 'i18n', 'locales', `${code}.ts`), 'utf8');
      for (const key of ['navLessonStudio', 'navTeacherTraining', 'studioTitle', 'trainingTitle']) {
        if (!new RegExp(`^\\s{2}(?:'${key}'|${key}):`, 'm').test(text)) {
          throw new Error(`${code}.ts missing teacher tool key ${key}`);
        }
      }
    }
  });
}

async function main() {
  const startedAt = Date.now();
  if (await portInUse()) {
    console.error(`Port ${PORT} is already in use. Stop the other server or set EXTENDED_TEST_PORT to a free port.`);
    return 1;
  }
  startServer();
  const ready = await waitForServer();
  if (!ready) {
    console.error(`Server did not become ready on port ${PORT}.`);
    if (serverLog) console.error(serverLog);
    return 1;
  }
  console.log(`Server ready on port ${PORT} (run ${RUN}).`);
  try {
    await runChecks();
  } catch (err) {
    console.error(`\nFATAL: ${err && err.stack ? err.stack : err}`);
    if (serverLog) console.error(`\n--- server log ---\n${serverLog}`);
  }
  printSummary(startedAt);
  return results.some((item) => item.status === 'FAIL') ? 1 : 0;
}

main()
  .then(async (code) => {
    await stopServer();
    process.exit(code);
  })
  .catch(async (err) => {
    console.error(err);
    await stopServer();
    process.exit(1);
  });

