#!/usr/bin/env node
/**
 * Prototype smoke test.
 *
 * Boots the legacy JSON-backed server on an isolated port and verifies the
 * auth flow, role portals, portal separation, refresh rotation and the main
 * read endpoints used by the vanilla-JS prototype UI.
 *
 * Usage: node tests/prototype-smoke.js
 */
'use strict';

const { spawn } = require('node:child_process');
const http = require('node:http');
const path = require('node:path');

const PORT = Number(process.env.SMOKE_PORT || 3199);
const BACKEND_DIR = path.join(__dirname, '..', 'backend');

const server = spawn(process.execPath, ['server.js'], {
  cwd: BACKEND_DIR,
  env: { ...process.env, PORT: String(PORT) },
  stdio: ['ignore', 'pipe', 'pipe'],
});

let serverLog = '';
server.stdout.on('data', (d) => { serverLog += d.toString(); });
server.stderr.on('data', (d) => { serverLog += d.toString(); });

function request(method, pathname, token, body) {
  return new Promise((resolve) => {
    const payload = body ? JSON.stringify(body) : null;
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const req = http.request(
      { hostname: '127.0.0.1', port: PORT, path: pathname, method, headers },
      (res) => {
        let buf = '';
        res.on('data', (c) => { buf += c; });
        res.on('end', () => {
          try { resolve({ status: res.statusCode, data: JSON.parse(buf) }); }
          catch { resolve({ status: res.statusCode, data: buf }); }
        });
      },
    );
    req.on('error', (err) => resolve({ status: 0, data: err.message }));
    if (payload) req.write(payload);
    req.end();
  });
}

async function waitForServer(timeoutMs = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const res = await request('GET', '/');
    if (res.status > 0) return true;
    await new Promise((r) => setTimeout(r, 300));
  }
  return false;
}

async function main() {
  const ready = await waitForServer();
  if (!ready) {
    console.error('Server did not start in time.\n' + serverLog);
    server.kill();
    process.exit(1);
  }

  const checks = [];
  const check = async (name, fn) => {
    try { await fn(); checks.push({ name, ok: true }); }
    catch (err) { checks.push({ name, ok: false, error: err.message }); }
  };
  const expectStatus = (res, expected) => {
    if (res.status !== expected) {
      throw new Error(`expected ${expected}, got ${res.status} ${JSON.stringify(res.data).slice(0, 120)}`);
    }
  };

  const admin = await request('POST', '/api/auth/login', null, {
    login: 'director@ryad.ma', password: '1234', portal: 'admin_portal',
  });
  await check('login: director (admin portal)', () => expectStatus(admin, 200));

  const teacher = await request('POST', '/api/auth/login', null, {
    login: 'teacher@ryad.ma', password: '1234', portal: 'private',
  });
  const parent = await request('POST', '/api/auth/login', null, {
    login: 'parent@ryad.ma', password: '1234', portal: 'private',
  });
  const student = await request('POST', '/api/auth/login', null, {
    login: 'student@ryad.ma', password: '1234', portal: 'private',
  });
  await check('login: teacher / parent / student', () => {
    expectStatus(teacher, 200); expectStatus(parent, 200); expectStatus(student, 200);
  });

  const a = admin.data.token;
  const t = teacher.data.token;
  const p = parent.data.token;
  const s = student.data.token;

  const adminEndpoints = [
    '/api/admin/overview', '/api/admin/performance', '/api/admin/learning-analytics',
    '/api/admin/smart-assistant', '/api/admin/impact', '/api/admin/alerts',
    '/api/admin/competency-refs', '/api/admin/feedback-cards', '/api/admin/cases',
    '/api/admin/library', '/api/admin/system-stats', '/api/admin/impact-report',
    '/api/admin/analytics/anonymized', '/api/admin/integrations',
    '/api/admin/integrations/export?system=massar', '/api/admin/retention',
    '/api/admin/assessments', '/api/admin/communications',
  ];
  for (const endpoint of adminEndpoints) {
    await check(`admin ${endpoint}`, async () => expectStatus(await request('GET', endpoint, a), 200));
  }

  const teacherEndpoints = [
    '/api/teacher/classes', '/api/teacher/student-report?studentId=s_sara',
    '/api/teacher/student-insights?studentId=s_sara', '/api/teacher/drafts',
    '/api/teacher/feedback-cards', '/api/teacher/cases', '/api/teacher/competency-refs',
    '/api/teacher/assessments', '/api/teacher/communications', '/api/teacher/alerts',
    '/api/teacher/impact-report',
  ];
  for (const endpoint of teacherEndpoints) {
    await check(`teacher ${endpoint}`, async () => expectStatus(await request('GET', endpoint, t), 200));
  }

  const parentEndpoints = [
    '/api/parent/children', '/api/parent/child-report?studentId=s_sara',
    '/api/parent/child-insights?studentId=s_sara', '/api/parent/dashboard',
  ];
  for (const endpoint of parentEndpoints) {
    await check(`parent ${endpoint}`, async () => expectStatus(await request('GET', endpoint, p), 200));
  }

  const studentEndpoints = ['/api/student/profile', '/api/student/insights', '/api/student/curriculum'];
  for (const endpoint of studentEndpoints) {
    await check(`student ${endpoint}`, async () => expectStatus(await request('GET', endpoint, s), 200));
  }

  await check('portal separation: admin token on private API -> 403', async () => {
    expectStatus(await request('GET', '/api/teacher/classes', a), 403);
  });
  await check('portal separation: teacher token on admin API -> 403', async () => {
    expectStatus(await request('GET', '/api/admin/overview', t), 403);
  });
  await check('refresh token rotation', async () => {
    expectStatus(await request('POST', '/api/auth/refresh', null, { refreshToken: admin.data.refreshToken }), 200);
  });

  const failed = checks.filter((c) => !c.ok);
  console.log('\n=== PROTOTYPE SMOKE TEST ===');
  console.log(`Passed: ${checks.length - failed.length} / ${checks.length}`);
  if (failed.length) {
    for (const f of failed) console.log(`  FAIL ${f.name}: ${f.error}`);
  } else {
    console.log('ALL CHECKS PASSED');
  }

  server.kill();
  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  server.kill();
  process.exit(1);
});
