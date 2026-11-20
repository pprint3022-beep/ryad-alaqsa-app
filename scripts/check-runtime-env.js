#!/usr/bin/env node
/**
 * Read-only runtime prerequisite report for Ryad Al Aqsa.
 *
 * Prints a table of local prerequisites with READY / BLOCKED / OPTIONAL status.
 * BLOCKED rows always carry an explicit next action. Missing commands, malformed
 * JSON and unavailable tools are reported, never thrown. This script always
 * exits 0 so it can run in an informational CI job.
 *
 * Usage: node scripts/check-runtime-env.js
 */
'use strict';

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const PY_EXE_CODE = 'import sys; print(sys.executable)';

function run(cmd, args, useShell) {
  try {
    const result = spawnSync(cmd, args || [], {
      cwd: ROOT,
      encoding: 'utf8',
      // Keep shell:false wherever possible; only Windows .cmd shims need a shell.
      shell: useShell === true,
      windowsHide: true,
      timeout: 15000,
    });
    if (result.error) return { ok: false, output: String(result.error.message || result.error) };
    const output = `${result.stdout || ''}${result.stderr || ''}`.trim();
    return { ok: result.status === 0, output };
  } catch (error) {
    return { ok: false, output: String(error && error.message ? error.message : error) };
  }
}

function short(text, max) {
  const value = String(text || '').replace(/\s+/g, ' ').trim();
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

function lastLine(text) {
  const lines = String(text || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return lines.length ? lines[lines.length - 1] : '';
}

const rows = [];
function add(status, item, detail, action) {
  rows.push({ status, item, detail: short(detail, 66), action: short(action || '', 78) });
}

function checkNode() {
  const major = Number(String(process.versions.node).split('.')[0]);
  if (Number.isFinite(major) && major >= 20) {
    add('READY', 'node', `v${process.versions.node} (package.json requires >=20)`);
  } else {
    add('BLOCKED', 'node', `v${process.versions.node} (requires >=20)`,
      'Install Node.js 20 LTS or newer from nodejs.org, then re-open the terminal.');
  }
}

function checkNpm() {
  const onWindows = process.platform === 'win32';
  const cmd = onWindows ? 'npm.cmd' : 'npm';
  const result = run(cmd, ['--version'], onWindows);
  if (result.ok && lastLine(result.output)) {
    add('READY', 'npm', `${lastLine(result.output)} (via ${cmd})`);
  } else {
    add('BLOCKED', 'npm', result.output ? short(result.output, 66) : 'command not found',
      'Install Node.js 20 LTS (npm is bundled) and ensure its bin directory is on PATH.');
  }
}

function checkGit() {
  const result = run('git', ['--version']);
  if (result.ok) {
    add('READY', 'git', lastLine(result.output) || 'git available');
    return;
  }

  // GitHub Copilot CLI ships a private Git on Windows that is not added to PATH.
  // Detect it so the report reflects a usable toolchain without mutating PATH.
  if (process.platform === 'win32' && process.env.LOCALAPPDATA) {
    try {
      const bundled = fs.readdirSync(process.env.LOCALAPPDATA, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && /^github-copilot-git-/i.test(entry.name))
        .map((entry) => path.join(process.env.LOCALAPPDATA, entry.name, 'cmd', 'git.exe'))
        .filter((exe) => fs.existsSync(exe))
        .sort((a, b) => b.localeCompare(a));

      for (const exe of bundled) {
        const probe = run(exe, ['--version']);
        if (probe.ok) {
          const relative = path.relative(process.env.LOCALAPPDATA, exe).replace(/\\/g, '/');
          add('READY', 'git', `${lastLine(probe.output)} (bundled: ${relative})`);
          return;
        }
      }
    } catch (error) {
      // A locked/unreadable AppData directory is not a reason to fail the report.
    }
  }

  add('BLOCKED', 'git', result.output ? short(result.output, 66) : 'command not found',
    'Install Git 2.x and add its cmd directory to PATH; CI checkout and commits require it.');
}

function checkPython() {
  const candidates = process.platform === 'win32'
    ? [{ cmd: 'python', args: ['-c', PY_EXE_CODE] }, { cmd: 'py', args: ['-3', '-c', PY_EXE_CODE] }]
    : [{ cmd: 'python3', args: ['-c', PY_EXE_CODE] }, { cmd: 'python', args: ['-c', PY_EXE_CODE] }];

  let reason = 'no real interpreter found';
  for (const candidate of candidates) {
    const result = run(candidate.cmd, candidate.args);
    if (result.ok) {
      const exe = lastLine(result.output);
      const storeStub = /WindowsApps|Microsoft\.Store/i.test(exe);
      if (exe && fs.existsSync(exe) && !storeStub) {
        add('READY', 'python', `${exe} (via ${candidate.cmd})`);
        return;
      }
      reason = storeStub
        ? `Microsoft Store stub reported: ${short(exe, 40)}`
        : `interpreter path does not exist: ${short(exe || result.output, 40)}`;
    } else if (result.output) {
      reason = /Microsoft Store|WindowsApps/i.test(result.output)
        ? `Microsoft Store stub (${candidate.cmd}): ${short(result.output, 40)}`
        : short(result.output, 66);
    } else {
      reason = `${candidate.cmd} command not found`;
    }
  }
  add('BLOCKED', 'python', reason,
    'Install Python 3.10+ from python.org (or WSL). On Windows also disable the python/python3 Store execution aliases in Settings > Apps > Advanced app settings > App execution aliases.');
}

function checkPsql() {
  const cmd = process.platform === 'win32' ? 'psql.exe' : 'psql';
  const result = run(cmd, ['--version']);
  if (result.ok) {
    add('READY', 'psql', lastLine(result.output) || 'PostgreSQL client available');
  } else {
    add('OPTIONAL', 'psql', result.output ? short(result.output, 66) : 'client not installed',
      'Optional: install PostgreSQL client tools for manual DB inspection; Prisma migrate does not need psql.');
  }
}

function checkPrototypeSeed() {
  const file = path.join(ROOT, 'backend', 'data.json');
  if (!fs.existsSync(file)) {
    add('BLOCKED', 'backend/data.json', 'file is missing',
      'Restore backend/data.json from the repository; the prototype server and tests parse it at startup.');
    return;
  }
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const seed = data && data.demoLessonContentSeed;
    if (typeof seed === 'string' && seed.trim()) {
      add('READY', 'backend/data.json', `exists; demoLessonContentSeed = "${seed}"`);
    } else {
      add('BLOCKED', 'backend/data.json', 'exists but demoLessonContentSeed is missing or empty',
        'Re-run node scripts/seed-lesson-content-demo.js to restore the demoLessonContentSeed guard.');
    }
  } catch (error) {
    add('BLOCKED', 'backend/data.json', `unreadable JSON: ${short(error && error.message ? error.message : error, 44)}`,
      'Repair or restore backend/data.json before running the prototype tests.');
  }
}

function printTable() {
  const headers = ['STATUS', 'ITEM', 'DETAIL', 'NEXT ACTION'];
  const lines = rows.map((row) => [row.status, row.item, row.detail, row.action]);
  const widths = headers.map((header, index) =>
    Math.max(header.length, ...lines.map((line) => line[index].length)));
  const format = (cells) => cells.map((cell, index) => cell.padEnd(widths[index])).join(' | ');

  console.log('Runtime prerequisites — Institut Ryad Al Aqsa');
  console.log(format(headers));
  console.log(widths.map((width) => '-'.repeat(width)).join('-+-'));
  lines.forEach((line) => console.log(format(line)));

  const blocked = rows.filter((row) => row.status === 'BLOCKED');
  console.log('');
  console.log(`Summary: ${rows.length} checks, ${blocked.length} blocked. Exit code is always 0.`);
  if (blocked.length) {
    console.log('Next actions for BLOCKED items:');
    blocked.forEach((row) => console.log(`  - ${row.item}: ${row.action}`));
  } else {
    console.log('All required prototype prerequisites are ready.');
  }
}

try {
  checkNode();
  checkNpm();
  checkGit();
  checkPython();
  checkPsql();
  checkPrototypeSeed();
  printTable();
} catch (error) {
  console.error(`Runtime check could not complete: ${short(error && error.message ? error.message : error, 200)}`);
} finally {
  process.exitCode = 0;
}
