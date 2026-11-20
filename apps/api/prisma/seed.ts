/**
 * Production seed for Ryad Al Aqsa.
 *
 * Source of truth for the data shape is the working prototype at
 * `backend/data.json`; the source of truth for persisted fields is
 * `apps/api/prisma/schema.prisma`.
 *
 * Design rules:
 * - Upserts only (idempotent, safe to re-run).
 * - Never invent a database column. Fields that have no Prisma column are
 *   either mapped into an existing JSON column or skipped with a logged note.
 * - Legacy password hashes are copied verbatim. Plain-text prototype
 *   passwords are converted to the prototype scrypt format so the existing
 *   legacy verifier keeps working.
 * - No external dependencies besides `@prisma/client`.
 *
 * NOTE: core learning records (assessments, grades, attendance, assignments and
 * submissions) are first-class models in schema.prisma and are migrated here.
 * Collections that still have no matching model are reported as skipped at the
 * end of the run rather than being written into invented tables.
 */
import { createHash, randomBytes, scryptSync } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_DATA_FILE = resolve(__dirname, '../../../backend/data.json');

type JsonRecord = Record<string, any>;
type SeedData = Record<string, any>;

interface SummaryRow {
  collection: string;
  model: string;
  read: number;
  written: number;
  skipped: number;
  note?: string;
}

interface BuiltRow {
  id: string;
  data: JsonRecord;
  update?: JsonRecord;
}

interface Delegate {
  upsert(args: {
    where: JsonRecord;
    create: JsonRecord;
    update: JsonRecord;
  }): Promise<unknown>;
  findFirst(args: JsonRecord): Promise<JsonRecord | null>;
  create(args: JsonRecord): Promise<unknown>;
}

const summary: SummaryRow[] = [];
const notes: string[] = [];

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toRows(raw: unknown): JsonRecord[] {
  if (Array.isArray(raw)) {
    return raw.filter(isRecord);
  }

  return isRecord(raw) ? [raw] : [];
}

function rawCount(raw: unknown): number {
  if (Array.isArray(raw)) {
    return raw.length;
  }

  return isRecord(raw) ? 1 : 0;
}

function str(value: unknown, fallback = ''): string {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return fallback;
}

function nullableStr(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  return value.trim().length > 0 ? value : null;
}

function num(value: unknown, fallback = 0): number {
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function nullableNum(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function int(value: unknown, fallback = 0): number {
  return Math.trunc(num(value, fallback));
}

function bool(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function strArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
}

function jsonArray(value: unknown): any[] {
  return Array.isArray(value) ? value : [];
}

function jsonObject(value: unknown): JsonRecord {
  return isRecord(value) ? { ...value } : {};
}

function toDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    const milliseconds = Math.abs(value) < 1_000_000_000_000 ? value * 1000 : value;
    const fromNumber = new Date(milliseconds);
    return Number.isNaN(fromNumber.getTime()) ? null : fromNumber;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const fromString = new Date(value);
    return Number.isNaN(fromString.getTime()) ? null : fromString;
  }

  return null;
}

function dateOrNow(value: unknown): Date {
  return toDate(value) ?? new Date();
}

function refOrNull(value: unknown, ids: Set<string>): string | null {
  const id = nullableStr(value);
  return id && ids.has(id) ? id : null;
}

function stableSuffix(parts: unknown[]): string {
  return createHash('sha1')
    .update(JSON.stringify(parts) ?? '')
    .digest('hex')
    .slice(0, 12);
}

function isHashedPassword(value: string): boolean {
  return (
    value.startsWith('scrypt$') ||
    value.startsWith('pbkdf2$') ||
    value.startsWith('$argon2')
  );
}

/**
 * Matches backend/server.js:
 *   scrypt$N$r$p$<salt-hex>$<64-byte-key-hex>
 * with N=16384, r=8, p=1.
 */
function hashLegacyPassword(password: string): string {
  const n = 16_384;
  const r = 8;
  const p = 1;
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64, {
    N: n,
    r,
    p,
    maxmem: 128 * n * r * 2,
  }).toString('hex');

  return `scrypt$${n}$${r}$${p}$${salt}$${hash}`;
}

function getDelegate(name: string): Delegate | undefined {
  const client = prisma as unknown as Record<string, Delegate | undefined>;
  return client[name];
}

function requireModel(name: string): Delegate {
  const delegate = getDelegate(name);

  if (!delegate || typeof delegate.upsert !== 'function') {
    throw new Error(
      `Prisma delegate "${name}" is unavailable. Run "prisma generate" against the current schema before seeding.`,
    );
  }

  return delegate;
}

function assertModels(names: string[]): void {
  const missing = names.filter((name) => !getDelegate(name));

  if (missing.length > 0) {
    throw new Error(
      `Prisma client is missing delegate(s): ${missing.join(', ')}. ` +
        'Run "prisma generate" against the current schema before seeding.',
    );
  }
}

function addSummary(
  collection: string,
  model: string,
  read: number,
  written: number,
  skipped: number,
  note?: string,
): void {
  summary.push({ collection, model, read, written, skipped, note });
}

function addSkipped(collection: string, model: string, read: number, note: string): void {
  addSummary(collection, model, read, 0, read, note);
}

async function upsertCollection(
  collection: string,
  modelName: string,
  raw: unknown,
  build: (row: JsonRecord, index: number) => BuiltRow | null,
  note?: string,
): Promise<Set<string>> {
  const rows = toRows(raw);
  const unique = new Map<string, BuiltRow>();
  const duplicateIds = new Set<string>();
  let invalid = 0;

  rows.forEach((row, index) => {
    let built: BuiltRow | null = null;

    try {
      built = build(row, index);
    } catch (error: unknown) {
      invalid += 1;
      notes.push(
        `${collection}[${index}] skipped: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return;
    }

    if (!built || !built.id) {
      invalid += 1;
      return;
    }

    if (unique.has(built.id)) {
      duplicateIds.add(built.id);
    }

    // Last occurrence wins, matching the prototype's overwrite behaviour.
    unique.set(built.id, built);
  });

  if (raw === undefined || raw === null) {
    addSummary(collection, modelName, 0, 0, 0, note ?? 'not present in data.json');
    return new Set<string>();
  }

  const delegate = requireModel(modelName);

  for (const built of unique.values()) {
    await delegate.upsert({
      where: { id: built.id },
      create: { id: built.id, ...built.data },
      update: built.update ?? built.data,
    });
  }

  const summaryNote: string[] = [];
  if (note) {
    summaryNote.push(note);
  }
  if (duplicateIds.size > 0) {
    const names = [...duplicateIds].slice(0, 8).join(', ');
    summaryNote.push(
      `${duplicateIds.size} duplicate id(s) collapsed (last wins): ${names}${
        duplicateIds.size > 8 ? '…' : ''
      }`,
    );
  }
  if (invalid > 0) {
    summaryNote.push(`${invalid} invalid/incomplete row(s) skipped`);
  }

  const read = rawCount(raw);
  addSummary(
    collection,
    modelName,
    read,
    unique.size,
    read - unique.size,
    summaryNote.length > 0 ? summaryNote.join('; ') : undefined,
  );

  return new Set(unique.keys());
}

async function seedFeedbackHistory(cards: JsonRecord[]): Promise<void> {
  const delegate = requireModel('feedbackCardHistory');
  let read = 0;
  let written = 0;
  let skipped = 0;

  for (const card of cards) {
    const cardId = nullableStr(card.id);
    if (!cardId) {
      continue;
    }

    for (const entry of toRows(card.history)) {
      read += 1;
      const at = toDate(entry.at) ?? toDate(card.date) ?? new Date();
      const payload: JsonRecord = {
        cardId,
        at,
        byUser: nullableStr(entry.by),
        action: nullableStr(entry.action) ?? 'imported',
        note: nullableStr(entry.note),
      };

      // FeedbackCardHistory has an auto-increment id, so idempotency is
      // achieved by looking for an identical audit row first.
      const existing = await delegate.findFirst({ where: payload });

      if (existing) {
        skipped += 1;
        continue;
      }

      await delegate.create({ data: payload });
      written += 1;
    }
  }

  addSummary(
    'feedbackCardHistory',
    'FeedbackCardHistory',
    read,
    written,
    skipped,
    read === 0 ? 'no history entries in source data' : undefined,
  );
}

async function seedCaseTimeline(cases: JsonRecord[]): Promise<void> {
  const delegate = requireModel('caseTimeline');
  let read = 0;
  let written = 0;
  let skipped = 0;

  for (const item of cases) {
    const caseId = nullableStr(item.id);
    if (!caseId) {
      continue;
    }

    for (const entry of toRows(item.timeline)) {
      read += 1;
      const event = nullableStr(entry.event);
      if (!event) {
        skipped += 1;
        continue;
      }

      const eventDate = toDate(entry.date) ?? toDate(item.openedAt) ?? new Date();
      const payload: JsonRecord = {
        caseId,
        term: nullableStr(entry.term),
        eventDate,
        event,
        type: nullableStr(entry.type),
        byUser: nullableStr(entry.by),
        createdAt: eventDate,
      };

      const existing = await delegate.findFirst({
        where: { caseId, eventDate, event },
      });

      if (existing) {
        skipped += 1;
        continue;
      }

      await delegate.create({ data: payload });
      written += 1;
    }
  }

  addSummary(
    'caseTimeline',
    'CaseTimeline',
    read,
    written,
    skipped,
    read === 0 ? 'no timeline entries in source data' : undefined,
  );
}

function printSummary(dataPath: string): void {
  const widths = {
    collection: Math.max(10, ...summary.map((row) => row.collection.length)),
    model: Math.max(5, ...summary.map((row) => row.model.length)),
  };

  console.log('');
  console.log(`Seed source: ${dataPath}`);
  console.log('');
  console.log(
    [
      'Collection'.padEnd(widths.collection),
      'Model'.padEnd(widths.model),
      'Read'.padStart(6),
      'Written'.padStart(8),
      'Skipped'.padStart(8),
      'Note',
    ].join('  '),
  );
  console.log(
    [
      '-'.repeat(widths.collection),
      '-'.repeat(widths.model),
      '-'.repeat(6),
      '-'.repeat(8),
      '-'.repeat(8),
      '-'.repeat(4),
    ].join('  '),
  );

  for (const row of summary) {
    console.log(
      [
        row.collection.padEnd(widths.collection),
        row.model.padEnd(widths.model),
        String(row.read).padStart(6),
        String(row.written).padStart(8),
        String(row.skipped).padStart(8),
        row.note ?? '',
      ].join('  '),
    );
  }

  console.log('');
  console.log(
    `Totals: read ${summary.reduce((sum, row) => sum + row.read, 0)}, ` +
      `written ${summary.reduce((sum, row) => sum + row.written, 0)}, ` +
      `skipped ${summary.reduce((sum, row) => sum + row.skipped, 0)}.`,
  );

  if (notes.length > 0) {
    console.log('');
    console.log('Notes:');
    for (const note of notes) {
      console.log(`- ${note}`);
    }
  }
}

async function main(): Promise<void> {
  const dataPath = process.env.SEED_DATA_FILE
    ? resolve(process.cwd(), process.env.SEED_DATA_FILE)
    : DEFAULT_DATA_FILE;

  const rawJson = readFileSync(dataPath, 'utf8');
  const parsed: unknown = JSON.parse(rawJson);

  if (!isRecord(parsed)) {
    throw new Error(`Seed data at ${dataPath} must be a JSON object.`);
  }

  const data = parsed as SeedData;

  assertModels([
    'user',
    'level',
    'class',
    'subject',
    'student',
    'curriculum',
    'assessment',
    'grade',
    'attendance',
    'assignment',
    'submission',
    'competencyReference',
    'studentCompetency',
    'feedbackCard',
    'feedbackCardHistory',
    'case',
    'caseTimeline',
    'talent',
    'learningPath',
    'intervention',
    'alert',
    'activity',
    'activityEnrollment',
    'agentProfile',
    'agentRun',
    'evidence',
    'libraryResource',
    'draft',
    'communication',
    'impactLog',
    'wellbeingCheckin',
    'mentoringPair',
    'staff',
    'goal',
    'competitor',
    'partnership',
    'strategy',
    'finance',
    'calendarEvent',
    'auditLog',
    'engagementLog',
    'contentSample',
    'languageConfig',
  ]);

  const usersRaw = toRows(data.users);
  const levelsRaw = toRows(data.levels);
  const classesRaw = toRows(data.classes);
  const subjectsRaw = toRows(data.subjects);
  const studentsRaw = toRows(data.students);
  const feedbackCardsRaw = toRows(data.feedbackCards);
  const casesRaw = toRows(data.cases);

  const userIds = new Set(usersRaw.map((row) => str(row.id)).filter(Boolean));
  const levelIds = new Set(levelsRaw.map((row) => str(row.id)).filter(Boolean));
  const classIds = new Set(classesRaw.map((row) => str(row.id)).filter(Boolean));
  const subjectIds = new Set(subjectsRaw.map((row) => str(row.id)).filter(Boolean));
  const studentIds = new Set(studentsRaw.map((row) => str(row.id)).filter(Boolean));

  const subjectByName = new Map<string, string>();
  for (const subject of subjectsRaw) {
    const name = nullableStr(subject.name);
    const id = nullableStr(subject.id);
    if (name && id) {
      subjectByName.set(name, id);
    }
  }

  const referenceBySkillSubject = new Map<string, string>();
  for (const reference of toRows(data.competencyReferences)) {
    const id = nullableStr(reference.id);
    const subject = nullableStr(reference.subject);
    const skill = nullableStr(reference.skill);
    if (id && subject && skill) {
      referenceBySkillSubject.set(`${subject}::${skill}`, id);
    }
  }
  const competencyReferenceIds = new Set(
    toRows(data.competencyReferences).map((row) => str(row.id)).filter(Boolean),
  );

  const levelByName = new Map<string, string>();
  for (const level of levelsRaw) {
    const name = nullableStr(level.name);
    const id = nullableStr(level.id);
    if (name && id) {
      levelByName.set(name, id);
    }
  }

  // Classes carry no teacher in the prototype. Derive it from each teacher's
  // scope.classes, which is how the prototype authorises class access.
  const teacherByClass = new Map<string, string>();
  for (const user of usersRaw) {
    if (str(user.role) !== 'teacher') {
      continue;
    }

    const scope = isRecord(user.scope) ? user.scope : {};
    for (const classId of strArray(scope.classes)) {
      if (!teacherByClass.has(classId)) {
        teacherByClass.set(classId, str(user.id));
      }
    }
  }

  let plainPasswords = 0;
  let derivedTeacherIds = 0;

  await upsertCollection('users', 'user', data.users, (row) => {
    const id = nullableStr(row.id);
    const name = nullableStr(row.name);
    const role = nullableStr(row.role);
    const portal = nullableStr(row.portal);
    const rawPassword = str(row.password);

    if (!id || !name || !role || !portal || !rawPassword) {
      return null;
    }

    const scope = jsonObject(row.scope);
    const delegations = strArray(row.delegations);
    if (delegations.length > 0) {
      // User has no profile/details column; `scope` is the only JSON column.
      scope.delegations = delegations;
    }

    const alreadyHashed = isHashedPassword(rawPassword);
    const password = alreadyHashed ? rawPassword : hashLegacyPassword(rawPassword);

    const payload: JsonRecord = {
      name,
      email: nullableStr(row.email),
      phone: nullableStr(row.phone),
      password,
      role,
      portal,
      scope,
      isActive: row.isActive !== false,
    };

    const createdAt = toDate(row.createdAt);
    if (createdAt) {
      payload.createdAt = createdAt;
    }

    const update: JsonRecord = { ...payload };
    if (!alreadyHashed) {
      plainPasswords += 1;
      // Do not overwrite an existing password on re-runs; the create path
      // already has the freshly hashed value.
      delete update.password;
    }

    return { id, data: payload, update };
  });

  await upsertCollection('levels', 'level', data.levels, (row, index) => {
    const id = nullableStr(row.id);
    const name = nullableStr(row.name);

    if (!id || !name) {
      return null;
    }

    return {
      id,
      data: {
        name,
        order: int(row.order, index),
      },
    };
  });

  await upsertCollection('classes', 'class', data.classes, (row) => {
    const id = nullableStr(row.id);
    const name = nullableStr(row.name);
    const levelId = nullableStr(row.levelId);

    if (!id || !name || !levelId || !levelIds.has(levelId)) {
      return null;
    }

    const teacherId = refOrNull(teacherByClass.get(id), userIds);
    if (teacherId) {
      derivedTeacherIds += 1;
    }

    return {
      id,
      data: {
        name,
        levelId,
        teacherId,
      },
    };
  });

  await upsertCollection('subjects', 'subject', data.subjects, (row) => {
    const id = nullableStr(row.id);
    const name = nullableStr(row.name);
    const category = nullableStr(row.category);

    if (!id || !name || !category) {
      return null;
    }

    return { id, data: { name, category } };
  });

  await upsertCollection('students', 'student', data.students, (row) => {
    const id = nullableStr(row.id);
    const name = nullableStr(row.name);
    const levelId = nullableStr(row.levelId);
    const classId = nullableStr(row.classId);

    if (!id || !name || !levelId || !classId) {
      return null;
    }
    if (!levelIds.has(levelId) || !classIds.has(classId)) {
      return null;
    }

    return {
      id,
      data: {
        name,
        levelId,
        classId,
        guardianId: refOrNull(row.guardianId, userIds),
        profile: jsonObject(row.profile),
      },
    };
  });

  // -----------------------------------------------------------------------
  // Core learning records: assignments -> submissions, grades, attendance,
  // assessments. These depend on classes/subjects/students seeded above.
  // -----------------------------------------------------------------------
  const writtenAssignmentIds = await upsertCollection(
    'assignments',
    'assignment',
    data.assignments,
    (row) => {
      const id = nullableStr(row.id);
      const classId = nullableStr(row.classId);
      const subjectId = nullableStr(row.subjectId);
      const title = nullableStr(row.title);

      if (!id || !classId || !subjectId || !title) {
        return null;
      }
      if (!classIds.has(classId) || !subjectIds.has(subjectId)) {
        return null;
      }

      const status = nullableStr(row.status);
      const normalizedStatus =
        status === 'closed' || status === 'archived' ? status : 'open';

      return {
        id,
        data: {
          classId,
          subjectId,
          title,
          description: nullableStr(row.description),
          dueDate: toDate(row.dueDate),
          teacherId: refOrNull(row.teacherId, userIds),
          status: normalizedStatus,
        },
      };
    },
  );

  await upsertCollection('submissions', 'submission', data.submissions, (row) => {
    const id = nullableStr(row.id);
    const assignmentId = nullableStr(row.assignmentId);
    const studentId = nullableStr(row.studentId);

    if (!id || !assignmentId || !studentId) {
      return null;
    }
    if (!writtenAssignmentIds.has(assignmentId) || !studentIds.has(studentId)) {
      return null;
    }

    const status = nullableStr(row.status);
    const normalizedStatus =
      status === 'submitted' || status === 'late' || status === 'graded' ? status : 'pending';

    return {
      id,
      data: {
        assignmentId,
        studentId,
        status: normalizedStatus,
        submittedAt: toDate(row.submittedAt),
        grade: row.grade === undefined || row.grade === null ? null : num(row.grade),
        feedback: nullableStr(row.feedback),
      },
    };
  });

  await upsertCollection('grades', 'grade', data.grades, (row) => {
    const id = nullableStr(row.id);
    const studentId = nullableStr(row.studentId);
    const subjectId = nullableStr(row.subjectId);

    if (!id || !studentId || !subjectId) {
      return null;
    }
    if (!studentIds.has(studentId) || !subjectIds.has(subjectId)) {
      return null;
    }

    const createdAt = toDate(row.createdAt);
    const payload: JsonRecord = {
      studentId,
      subjectId,
      classId: refOrNull(row.classId, classIds),
      score: num(row.score),
      scale: num(row.scale, 20),
      term: nullableStr(row.term),
      teacherId: refOrNull(row.teacherId, userIds),
      date: toDate(row.date) ?? createdAt ?? new Date(),
    };

    if (createdAt) {
      payload.createdAt = createdAt;
    }

    return { id, data: payload };
  });

  await upsertCollection('attendance', 'attendance', data.attendance, (row) => {
    const id = nullableStr(row.id);
    const studentId = nullableStr(row.studentId);
    const classId = nullableStr(row.classId);

    if (!id || !studentId || !classId) {
      return null;
    }
    if (!studentIds.has(studentId) || !classIds.has(classId)) {
      return null;
    }

    const status = nullableStr(row.status);
    const normalizedStatus =
      status === 'late' || status === 'absent' || status === 'excused' ? status : 'present';

    return {
      id,
      data: {
        studentId,
        classId,
        date: dateOrNow(row.date),
        status: normalizedStatus,
        note: nullableStr(row.note),
        recordedBy: refOrNull(row.recordedBy, userIds),
      },
    };
  });

  await upsertCollection('curriculum', 'curriculum', data.curriculum, (row) => {
    const id = nullableStr(row.id);
    const levelId = nullableStr(row.levelId);
    const subjectId = nullableStr(row.subjectId);
    const unit = nullableStr(row.unit);

    if (!id || !levelId || !subjectId || !unit) {
      return null;
    }
    if (!levelIds.has(levelId) || !subjectIds.has(subjectId)) {
      return null;
    }

    const payload: JsonRecord = {
      levelId,
      subjectId,
      unit,
      lessons: strArray(row.lessons),
      status: nullableStr(row.status) ?? 'draft',
      language: nullableStr(row.language) ?? 'ar',
    };

    const createdAt = toDate(row.createdAt);
    if (createdAt) {
      payload.createdAt = createdAt;
    }

    return { id, data: payload };
  });

  await upsertCollection(
    'competencyReferences',
    'competencyReference',
    data.competencyReferences,
    (row) => {
      const levelName = nullableStr(row.level);
      const subject = nullableStr(row.subject);
      const skill = nullableStr(row.skill);

      if (!levelName || !subject || !skill) {
        return null;
      }

      const id =
        nullableStr(row.id) ??
        `cr_${stableSuffix([levelName, subject, skill])}`;

      return {
        id,
        data: {
          levelName,
          subject,
          skill,
          description: nullableStr(row.description),
          indicators: strArray(row.indicators),
          targetMastery: num(row.targetMastery, 0.7),
          levelId: levelByName.get(levelName) ?? null,
        },
      };
    },
  );

  await upsertCollection(
    'competencies',
    'studentCompetency',
    data.competencies,
    (row) => {
      const studentId = nullableStr(row.studentId);
      const subjectId = nullableStr(row.subjectId);
      const skill = nullableStr(row.skill);

      if (!studentId || !subjectId || !skill) {
        return null;
      }
      if (!studentIds.has(studentId) || !subjectIds.has(subjectId)) {
        return null;
      }

      const id =
        nullableStr(row.id) ??
        `sc_${studentId}_${subjectId}_${stableSuffix([skill])}`;

      return {
        id,
        data: {
          studentId,
          subjectId,
          skill,
          mastery: num(row.mastery),
          status: nullableStr(row.status) ?? 'in_progress',
          lastAssessed: toDate(row.lastAssessed),
          refId: refOrNull(row.refId, competencyReferenceIds),
        },
      };
    },
  );

  // Assessments reference both Student and CompetencyReference, so they must
  // run after competencyReferences above.
  await upsertCollection('assessments', 'assessment', data.assessments, (row) => {
    const id = nullableStr(row.id);
    const studentId = nullableStr(row.studentId);
    const refSkill = nullableStr(row.refSkill);

    if (!id || !studentId || !refSkill) {
      return null;
    }
    if (!studentIds.has(studentId)) {
      return null;
    }

    const subjectName = nullableStr(row.subject);
    const subjectId = subjectName ? subjectByName.get(subjectName) ?? null : null;
    const type = nullableStr(row.type);
    const normalizedType =
      type === 'diagnostic' || type === 'summative' || type === 'intake'
        ? type
        : 'formative';

    return {
      id,
      data: {
        studentId,
        subjectId,
        refId:
          subjectName && referenceBySkillSubject.has(`${subjectName}::${refSkill}`)
            ? referenceBySkillSubject.get(`${subjectName}::${refSkill}`) ?? null
            : null,
        refSkill,
        subjectName,
        levelName: nullableStr(row.level),
        type: normalizedType,
        score: num(row.score),
        scale: num(row.scale, 1),
        term: nullableStr(row.term),
        date: dateOrNow(row.date),
        evidence: nullableStr(row.evidence),
        notes: nullableStr(row.notes),
      },
    };
  });

  const writtenFeedbackIds = await upsertCollection(
    'feedbackCards',
    'feedbackCard',
    data.feedbackCards,
    (row) => {
      const id = nullableStr(row.id);
      const studentId = nullableStr(row.studentId);
      const summaryText = nullableStr(row.summary);

      if (!id || !studentId || !summaryText) {
        return null;
      }
      if (!studentIds.has(studentId)) {
        return null;
      }

      let updatedAt: Date | null = null;
      let updatedBy: string | null = null;
      for (const entry of toRows(row.history)) {
        const at = toDate(entry.at);
        if (at && (!updatedAt || at.getTime() > updatedAt.getTime())) {
          updatedAt = at;
          updatedBy = nullableStr(entry.by);
        }
      }

      return {
        id,
        data: {
          studentId,
          agent: nullableStr(row.agent),
          term: nullableStr(row.term),
          year: nullableStr(row.year),
          priority: nullableStr(row.priority),
          status: nullableStr(row.status) ?? 'proposed',
          summary: summaryText,
          evidenceIds: strArray(row.evidenceIds),
          recommendations: strArray(row.recommendations),
          resources: strArray(row.resources),
          assigneeId: refOrNull(row.assignee, userIds),
          reviewNotes: nullableStr(row.reviewNotes),
          actions: jsonArray(row.actions),
          nextReview: toDate(row.nextReview),
          // The prototype's `date` is the card creation moment.
          createdAt: dateOrNow(row.date),
          updatedAt,
          updatedBy,
        },
      };
    },
    'date mapped to createdAt; assignee mapped to assigneeId',
  );

  await seedFeedbackHistory(
    feedbackCardsRaw.filter((row) => writtenFeedbackIds.has(str(row.id))),
  );

  const writtenCaseIds = await upsertCollection(
    'cases',
    'case',
    data.cases,
    (row) => {
      const id = nullableStr(row.id);
      const studentId = nullableStr(row.studentId);

      if (!id || !studentId || !studentIds.has(studentId)) {
        return null;
      }

      let updatedAt: Date | null = null;
      for (const entry of toRows(row.timeline)) {
        const at = toDate(entry.date);
        if (at && (!updatedAt || at.getTime() > updatedAt.getTime())) {
          updatedAt = at;
        }
      }

      const openedAt = toDate(row.openedAt);

      return {
        id,
        data: {
          studentId,
          year: nullableStr(row.year),
          status: nullableStr(row.status) ?? 'active',
          ownerRole: nullableStr(row.ownerRole),
          ownerId: refOrNull(row.ownerId, userIds),
          focus: nullableStr(row.focus),
          openedAt,
          nextReview: toDate(row.nextReview),
          createdAt: openedAt ?? new Date(),
          updatedAt,
        },
      };
    },
  );

  await seedCaseTimeline(casesRaw.filter((row) => writtenCaseIds.has(str(row.id))));

  await upsertCollection('talents', 'talent', data.talents, (row) => {
    const studentId = nullableStr(row.studentId);
    const domain = nullableStr(row.domain);
    const talent = nullableStr(row.talent);
    const level = nullableStr(row.level);

    if (!studentId || !domain || !talent || !level || !studentIds.has(studentId)) {
      return null;
    }

    const id = nullableStr(row.id) ?? `tal_${stableSuffix([studentId, domain, talent])}`;

    return {
      id,
      data: {
        studentId,
        domain,
        talent,
        level,
        evidence: strArray(row.evidence),
        program: nullableStr(row.program),
      },
    };
  });

  await upsertCollection('learningPaths', 'learningPath', data.learningPaths, (row) => {
    const studentId = nullableStr(row.studentId);
    const type = nullableStr(row.type);

    if (!studentId || !type || !studentIds.has(studentId)) {
      return null;
    }

    const id =
      nullableStr(row.id) ??
      `lp_${studentId}_${stableSuffix([type, row.focus, row.nextSteps])}`;

    return {
      id,
      data: {
        studentId,
        type,
        focus: nullableStr(row.focus),
        nextSteps: strArray(row.nextSteps),
        reassessDate: toDate(row.reassessDate),
        status: nullableStr(row.status) ?? 'active',
      },
    };
  });

  await upsertCollection('interventions', 'intervention', data.interventions, (row) => {
    const id = nullableStr(row.id);
    const studentId = nullableStr(row.studentId);
    const type = nullableStr(row.type);

    if (!id || !studentId || !type || !studentIds.has(studentId)) {
      return null;
    }

    return {
      id,
      data: {
        studentId,
        type,
        reason: nullableStr(row.reason),
        plan: nullableStr(row.plan),
        status: nullableStr(row.status) ?? 'active',
        owner: nullableStr(row.owner),
      },
    };
  });

  await upsertCollection('alerts', 'alert', data.alerts, (row) => {
    const id = nullableStr(row.id);
    const studentId = nullableStr(row.studentId);
    const level = nullableStr(row.level);
    const type = nullableStr(row.type);
    const message = nullableStr(row.message);

    if (!id || !studentId || !level || !type || !message || !studentIds.has(studentId)) {
      return null;
    }

    return {
      id,
      data: {
        studentId,
        level,
        type,
        message,
        date: dateOrNow(row.date),
      },
    };
  });

  const writtenActivityIds = await upsertCollection(
    'activities',
    'activity',
    data.activities,
    (row) => {
      const id = nullableStr(row.id);
      const name = nullableStr(row.name);

      if (!id || !name) {
        return null;
      }

      return {
        id,
        data: {
          name,
          category: nullableStr(row.category),
          type: nullableStr(row.type),
          audience: nullableStr(row.audience),
          schedule: nullableStr(row.schedule),
          outreach: bool(row.outreach),
          publish: bool(row.publish),
        },
      };
    },
  );

  const enrollmentPairs = new Set<string>();
  await upsertCollection(
    'activityEnrollments',
    'activityEnrollment',
    data.activityEnrollments,
    (row) => {
      const studentId = nullableStr(row.studentId);
      const activityId = nullableStr(row.activityId);

      if (
        !studentId ||
        !activityId ||
        !studentIds.has(studentId) ||
        !writtenActivityIds.has(activityId)
      ) {
        return null;
      }

      const pair = `${studentId}|${activityId}`;
      if (enrollmentPairs.has(pair)) {
        notes.push(
          `activityEnrollments duplicate pair ${pair} skipped (unique constraint studentId+activityId)`,
        );
        return null;
      }
      enrollmentPairs.add(pair);

      const id =
        nullableStr(row.id) ?? `enr_${stableSuffix([studentId, activityId])}`;

      return {
        id,
        data: {
          studentId,
          activityId,
          enrolledAt: dateOrNow(row.enrolledAt),
          enrolledBy: refOrNull(row.enrolledBy, userIds),
          status: nullableStr(row.status) ?? 'active',
        },
      };
    },
  );

  await upsertCollection('agentProfiles', 'agentProfile', data.agentProfiles, (row) => {
    const id = nullableStr(row.id);
    const name = nullableStr(row.name);

    if (!id || !name) {
      return null;
    }

    return {
      id,
      data: {
        name,
        domain: nullableStr(row.domain),
        level: nullableStr(row.level),
      },
    };
  });

  const agentIds = new Set(
    toRows(data.agentProfiles).map((row) => str(row.id)).filter(Boolean),
  );

  const writtenAgentRunIds = await upsertCollection(
    'agentRuns',
    'agentRun',
    data.agentRuns,
    (row) => {
      const id = nullableStr(row.id);
      const agentId = nullableStr(row.agent);
      const target = nullableStr(row.target);

      if (!id || !agentId || !target) {
        return null;
      }
      if (!agentIds.has(agentId) || !studentIds.has(target)) {
        return null;
      }

      return {
        id,
        data: {
          agentId,
          target,
          term: nullableStr(row.term),
          year: nullableStr(row.year),
          at: dateOrNow(row.at),
          status: nullableStr(row.status) ?? 'completed',
          summary: nullableStr(row.summary),
        },
      };
    },
    'agent mapped to agentId; target mapped to Student.target',
  );

  await upsertCollection('evidence', 'evidence', data.evidence, (row) => {
    const id = nullableStr(row.id);
    const agentRunId = nullableStr(row.agentRunId);
    const studentId = nullableStr(row.studentId);
    const type = nullableStr(row.type);
    const ref = nullableStr(row.ref);

    if (!id || !agentRunId || !studentId || !type || !ref) {
      return null;
    }
    if (!writtenAgentRunIds.has(agentRunId) || !studentIds.has(studentId)) {
      return null;
    }

    return {
      id,
      data: {
        agentRunId,
        studentId,
        type,
        ref,
        weight: nullableStr(row.weight),
      },
    };
  });

  const publicationStudentLinks = toRows(data.publications).filter((row) =>
    Boolean(row.studentId),
  ).length;
  const publicationReviewedDates = toRows(data.publications).filter((row) =>
    Boolean(row.reviewedAt),
  ).length;

  await upsertCollection(
    'publications',
    'publication',
    data.publications,
    (row) => {
      const id = nullableStr(row.id);
      const title = nullableStr(row.title);
      const publishedDate = toDate(row.date);

      if (!id || !title || !publishedDate) {
        return null;
      }

      const status = nullableStr(row.status) ?? 'published';
      const publishedAt =
        toDate(row.publishedAt) ??
        (status === 'published'
          ? toDate(row.reviewedAt) ?? publishedDate
          : null);

      return {
        id,
        data: {
          title,
          type: nullableStr(row.type),
          date: publishedDate,
          audience: nullableStr(row.audience),
          impact: nullableStr(row.impact),
          status,
          publishedAt,
        },
      };
    },
    'studentId and reviewedAt have no schema column',
  );

  await upsertCollection('library', 'libraryResource', data.library, (row) => {
    const id = nullableStr(row.id);
    const title = nullableStr(row.title);

    if (!id || !title) {
      return null;
    }

    return {
      id,
      data: {
        title,
        domain: nullableStr(row.domain),
        tags: strArray(row.tags),
        summary: nullableStr(row.summary),
        source: nullableStr(row.source),
      },
    };
  });

  await upsertCollection('drafts', 'draft', data.drafts, (row) => {
    const id = nullableStr(row.id);
    const type = nullableStr(row.type);

    if (!id || !type) {
      return null;
    }

    const payload: JsonRecord = {
      type,
      studentId: refOrNull(row.studentId, studentIds),
      tone: nullableStr(row.tone),
      subject: nullableStr(row.subject),
      body: nullableStr(row.body),
    };

    const createdAt = toDate(row.createdAt);
    if (createdAt) {
      payload.createdAt = createdAt;
    }

    return { id, data: payload };
  });

  await upsertCollection('communications', 'communication', data.communications, (row) => {
    const id = nullableStr(row.id);
    const type = nullableStr(row.type);

    if (!id || !type) {
      return null;
    }

    const at = toDate(row.at);
    const status = nullableStr(row.status) ?? 'draft';
    const governance = jsonObject(row.governance);
    const approvedBy = nullableStr(governance.approvedBy);
    const sentAt = status === 'sent' ? at : null;

    return {
      id,
      data: {
        studentId: refOrNull(row.studentId, studentIds),
        type,
        channel: nullableStr(row.channel),
        status,
        draftId: nullableStr(row.draftId),
        byUser: nullableStr(row.by),
        governance,
        notes: nullableStr(row.notes),
        sentAt,
        sentBy: status === 'sent' ? approvedBy : null,
        createdAt: at ?? new Date(),
        updatedAt: at,
      },
    };
  });

  const feedbackCardIds = new Set(
    feedbackCardsRaw.map((row) => str(row.id)).filter((id) => writtenFeedbackIds.has(id)),
  );

  await upsertCollection('impactLog', 'impactLog', data.impactLog, (row) => {
    const id = nullableStr(row.id);
    const studentId = nullableStr(row.studentId);
    const indicator = nullableStr(row.indicator);

    if (!id || !studentId || !indicator || !studentIds.has(studentId)) {
      return null;
    }

    return {
      id,
      data: {
        studentId,
        cardId: refOrNull(row.cardId, feedbackCardIds),
        indicator,
        baseline: nullableNum(row.baseline),
        target: nullableNum(row.target),
        current: nullableNum(row.current),
        term: nullableStr(row.term),
        updatedAt: dateOrNow(row.updatedAt),
      },
    };
  });

  await upsertCollection(
    'wellbeingCheckins',
    'wellbeingCheckin',
    data.wellbeingCheckins,
    (row) => {
      const id = nullableStr(row.id);
      const studentId = nullableStr(row.studentId);

      if (!id || !studentId || !studentIds.has(studentId)) {
        return null;
      }

      return {
        id,
        data: {
          studentId,
          mood: int(row.mood),
          energy: int(row.energy),
          stress: int(row.stress),
          notes: nullableStr(row.notes),
          checkedAt: dateOrNow(row.checkedAt),
          checkedBy: refOrNull(row.checkedBy, userIds),
        },
      };
    },
  );

  await upsertCollection('mentoringPairs', 'mentoringPair', data.mentoringPairs, (row) => {
    const id = nullableStr(row.id);
    const mentorId = nullableStr(row.mentorId);
    const menteeId = nullableStr(row.menteeId);

    if (!id || !mentorId || !menteeId) {
      return null;
    }

    return {
      id,
      data: {
        mentorId,
        menteeId,
        subject: nullableStr(row.subject),
        status: nullableStr(row.status) ?? 'active',
        createdAt: dateOrNow(row.createdAt),
        createdBy: refOrNull(row.createdBy, userIds),
      },
    };
  });

  await upsertCollection('staff', 'staff', data.staff, (row) => {
    const id = nullableStr(row.id);
    const name = nullableStr(row.name);
    const role = nullableStr(row.role);

    if (!id || !name || !role) {
      return null;
    }

    return {
      id,
      data: {
        name,
        role,
        salary: num(row.salary),
      },
    };
  });

  await upsertCollection('goals', 'goal', data.goals, (row) => {
    const id = nullableStr(row.id);
    const title = nullableStr(row.title);
    const status = nullableStr(row.status);

    if (!id || !title || !status) {
      return null;
    }

    return {
      id,
      data: {
        title,
        kpi: nullableStr(row.kpi),
        target: num(row.target),
        current: num(row.current),
        owner: nullableStr(row.owner),
        status,
      },
    };
  });

  await upsertCollection('competitors', 'competitor', data.competitors, (row) => {
    const name = nullableStr(row.name);

    if (!name) {
      return null;
    }

    return {
      id: nullableStr(row.id) ?? `comp_${stableSuffix([name, row.area])}`,
      data: {
        name,
        area: nullableStr(row.area),
        strengths: strArray(row.strengths),
        risks: strArray(row.risks),
        position: nullableStr(row.position),
      },
    };
  });

  await upsertCollection('partnerships', 'partnership', data.partnerships, (row) => {
    const institution = nullableStr(row.institution);

    if (!institution) {
      return null;
    }

    return {
      id:
        nullableStr(row.id) ??
        `part_${stableSuffix([institution, row.type, row.focus])}`,
      data: {
        institution,
        type: nullableStr(row.type),
        status: nullableStr(row.status),
        focus: nullableStr(row.focus),
      },
    };
  });

  await upsertCollection('strategy', 'strategy', data.strategy, (row) => {
    return {
      id: nullableStr(row.id) ?? 'default',
      data: {
        vision: nullableStr(row.vision),
        pillars: strArray(row.pillars),
        initiatives: jsonArray(row.initiatives),
      },
    };
  });

  await upsertCollection('finance', 'finance', data.finance, (row) => {
    return {
      id: nullableStr(row.id) ?? 'default',
      data: {
        currency: nullableStr(row.currency) ?? 'MAD',
        monthly: jsonArray(row.monthly),
        categories: jsonObject(row.categories),
      },
    };
  });

  await upsertCollection('calendarEvents', 'calendarEvent', data.calendarEvents ?? data.calendar, (row) => {
    const title = nullableStr(row.title);
    const eventDate = toDate(row.date);

    if (!title || !eventDate) {
      return null;
    }

    const id =
      nullableStr(row.id) ?? `cal_${stableSuffix([title, row.date, row.type])}`;

    return {
      id,
      data: {
        title,
        date: eventDate,
        type: nullableStr(row.type),
        audience: nullableStr(row.audience),
        level: nullableStr(row.level),
      },
    };
  });

  await upsertCollection('auditLogs', 'auditLog', data.auditLogs, (row) => {
    const id = nullableStr(row.id);
    const action = nullableStr(row.action);
    const entityType = nullableStr(row.entityType);

    if (!id || !action || !entityType) {
      return null;
    }

    return {
      id,
      data: {
        actorId: refOrNull(row.actorId, userIds),
        role: nullableStr(row.role),
        action,
        entityType,
        entityId: nullableStr(row.entityId),
        details: jsonObject(row.details),
        at: dateOrNow(row.at),
      },
    };
  });

  await upsertCollection('engagementLog', 'engagementLog', data.engagementLog, (row) => {
    const id = nullableStr(row.id);
    const parentId = nullableStr(row.parentId);
    const action = nullableStr(row.action);

    if (!id || !parentId || !action || !userIds.has(parentId)) {
      return null;
    }

    return {
      id,
      data: {
        parentId,
        action,
        studentId: nullableStr(row.studentId),
        at: dateOrNow(row.at),
      },
    };
  });

  await upsertCollection('contentSamples', 'contentSample', data.contentSamples, (row) => {
    const levelId = nullableStr(row.levelId);
    const levelName = nullableStr(row.levelName);

    if (!levelId || !levelName || !levelIds.has(levelId)) {
      return null;
    }

    return {
      id: nullableStr(row.id) ?? `cs_${levelId}`,
      data: {
        levelId,
        levelName,
        languages: strArray(row.languages),
        subjects: strArray(row.subjects),
        totalUnits: int(row.totalUnits),
        createdAt: dateOrNow(row.createdAt),
      },
    };
  });

  await upsertCollection('languageConfig', 'languageConfig', data.languageConfig, (row) => {
    return {
      id: nullableStr(row.id) ?? 'default',
      data: {
        supportedLanguages: strArray(row.supportedLanguages),
        defaultLanguage: nullableStr(row.defaultLanguage) ?? 'ar',
        rtlLanguages: strArray(row.rtlLanguages),
        ltrLanguages: strArray(row.ltrLanguages),
        coreLanguages: strArray(row.coreLanguages),
        optionalLanguages: strArray(row.optionalLanguages),
        languageNames: jsonObject(row.languageNames),
      },
    };
  });

  // ---------------------------------------------------------------------
  // Collections that cannot be migrated against the current schema.
  // ---------------------------------------------------------------------

  addSkipped(
    'sessions',
    'Session (intentional)',
    rawCount(data.sessions),
    'Not migrated: prototype keeps plaintext refresh tokens; force re-login instead',
  );
  addSkipped(
    'retentionPolicy',
    '(no model)',
    rawCount(data.retentionPolicy),
    'No settings/retention table in schema.prisma; policy must live in configuration',
  );

  if (plainPasswords > 0) {
    notes.push(
      `${plainPasswords} plain-text password(s) in source; converted to scrypt$16384$8$1$... on first insert (not overwritten on re-runs)`,
    );
  }
  if (derivedTeacherIds > 0) {
    notes.push(
      `${derivedTeacherIds} class(es) received teacherId derived from the owning teacher's scope.classes`,
    );
  }
  if (publicationStudentLinks > 0) {
    notes.push(
      `${publicationStudentLinks} publication(s) have studentId with no Publication column; value kept only in data.json`,
    );
  }
  if (publicationReviewedDates > 0) {
    notes.push(
      `${publicationReviewedDates} publication(s) have reviewedAt, used only as a publishedAt fallback`,
    );
  }

  printSummary(dataPath);
}

void main()
  .catch((error: unknown) => {
    console.error('');
    console.error('[seed] FAILED');
    console.error(error instanceof Error ? error.stack ?? error.message : String(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await prisma.$disconnect();
    } catch {
      // Ignore disconnect failures; the original error, if any, is already set.
    }
  });
