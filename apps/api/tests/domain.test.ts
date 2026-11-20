import request from 'supertest';
import type { FastifyInstance } from 'fastify';
import { prisma } from '../src/lib/prisma';
import { buildApp } from '../src/index';
import type { AuthUser } from '../src/lib/tokens';

/**
 * The Prisma singleton is replaced entirely so no database is required. The
 * auth guard still performs its per-request user lookup against this mock.
 */
jest.mock('../src/lib/prisma', () => ({
  prisma: {
    $queryRaw: jest.fn().mockResolvedValue([]),
    $disconnect: jest.fn().mockResolvedValue(undefined),
    user: { findUnique: jest.fn() },
    student: { findMany: jest.fn(), findUnique: jest.fn(), count: jest.fn() },
    class: { findMany: jest.fn(), count: jest.fn() },
    attendance: { findMany: jest.fn(), count: jest.fn(), createMany: jest.fn() },
    grade: {
      findMany: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      createMany: jest.fn(),
    },
    feedbackCard: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    feedbackCardHistory: { create: jest.fn() },
    case: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    caseTimeline: { create: jest.fn() },
    communication: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    auditLog: { findMany: jest.fn(), count: jest.fn(), create: jest.fn() },
  },
}));

const asMock = (fn: unknown): jest.Mock => fn as jest.Mock;

function makeUser(overrides: Partial<AuthUser> = {}): AuthUser {
  return {
    sub: 'user-1',
    name: 'Test User',
    email: 'test@example.invalid',
    role: 'teacher',
    portal: 'private',
    scope: { classIds: [], levelIds: [], childIds: [], studentIds: [] },
    typ: 'access',
    sid: 'session-1',
    ...overrides,
  };
}

function headersFor(app: FastifyInstance, user: AuthUser): Record<string, string> {
  // The token carries identity; scope is reloaded from the mocked DB lookup,
  // which is what the domain scope checks actually use.
  asMock(prisma.user.findUnique).mockResolvedValue({
    id: user.sub,
    name: user.name,
    email: user.email,
    role: user.role,
    portal: user.portal,
    scope: user.scope,
    isActive: true,
  });

  return { authorization: `Bearer ${app.jwt.sign(user, { expiresIn: '1h' })}` };
}

/** Audit writes are fire-and-forget; let their promises settle before asserting. */
async function flushAudit(): Promise<void> {
  await new Promise<void>((resolve) => setImmediate(resolve));
}

describe('domain API (mocked Prisma)', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    asMock(prisma.student.findMany).mockResolvedValue([]);
    asMock(prisma.student.findUnique).mockResolvedValue(null);
    asMock(prisma.student.count).mockResolvedValue(0);
    asMock(prisma.class.findMany).mockResolvedValue([]);
    asMock(prisma.class.count).mockResolvedValue(0);
    asMock(prisma.attendance.findMany).mockResolvedValue([]);
    asMock(prisma.attendance.count).mockResolvedValue(0);
    asMock(prisma.attendance.createMany).mockResolvedValue({ count: 0 });
    asMock(prisma.grade.findMany).mockResolvedValue([]);
    asMock(prisma.grade.count).mockResolvedValue(0);
    asMock(prisma.grade.aggregate).mockResolvedValue({ _avg: { score: null } });
    asMock(prisma.grade.createMany).mockResolvedValue({ count: 0 });
    asMock(prisma.feedbackCard.findMany).mockResolvedValue([]);
    asMock(prisma.feedbackCard.count).mockResolvedValue(0);
    asMock(prisma.feedbackCard.findUnique).mockResolvedValue(null);
    asMock(prisma.feedbackCard.update).mockResolvedValue({ id: 'card-1' });
    asMock(prisma.feedbackCardHistory.create).mockResolvedValue({});
    asMock(prisma.case.findMany).mockResolvedValue([]);
    asMock(prisma.case.count).mockResolvedValue(0);
    asMock(prisma.case.findUnique).mockResolvedValue(null);
    asMock(prisma.case.update).mockResolvedValue({ id: 'case-1' });
    asMock(prisma.caseTimeline.create).mockResolvedValue({ id: 1 });
    asMock(prisma.communication.findMany).mockResolvedValue([]);
    asMock(prisma.communication.count).mockResolvedValue(0);
    asMock(prisma.communication.findUnique).mockResolvedValue(null);
    asMock(prisma.communication.create).mockImplementation(
      async (args: {
        data: {
          id: string;
          studentId: string;
          type: string;
          channel?: string;
          status: string;
          governance: unknown;
          byUser: string;
        };
      }) => ({
        id: args.data.id,
        studentId: args.data.studentId,
        type: args.data.type,
        channel: args.data.channel,
        status: args.data.status,
        governance: args.data.governance,
        byUser: args.data.byUser,
      }),
    );
    asMock(prisma.communication.update).mockResolvedValue({ id: 'comm-1' });
    asMock(prisma.auditLog.findMany).mockResolvedValue([]);
    asMock(prisma.auditLog.count).mockResolvedValue(0);
    asMock(prisma.auditLog.create).mockResolvedValue({});
  });

  function lastWhere(fn: jest.Mock): Record<string, unknown> {
    const calls = fn.mock.calls;
    return calls[calls.length - 1][0].where as Record<string, unknown>;
  }

  it('requires a bearer token for domain routes', async () => {
    const response = await request(app.server).get('/api/students');

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({ ok: false, error: 'unauthorized' });
  });

  // --- Scope enforcement ----------------------------------------------------

  it('limits students to the classes in a teacher scope', async () => {
    const teacher = makeUser({
      sub: 'teacher-1',
      role: 'teacher',
      portal: 'private',
      scope: { classIds: ['class-1'] },
    });

    const response = await request(app.server)
      .get('/api/students')
      .set(headersFor(app, teacher));

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ ok: true, students: [], total: 0 });
    expect(lastWhere(asMock(prisma.student.findMany))).toEqual(
      expect.objectContaining({
        OR: expect.arrayContaining([{ classId: { in: ['class-1'] } }]),
      }),
    );
  });

  it('limits students to a parent’s children and a student to self', async () => {
    const parent = makeUser({
      sub: 'parent-1',
      role: 'parent',
      portal: 'private',
      scope: { childIds: ['stu-child'] },
    });
    await request(app.server)
      .get('/api/students')
      .set(headersFor(app, parent));
    expect(lastWhere(asMock(prisma.student.findMany))).toEqual(
      expect.objectContaining({
        OR: expect.arrayContaining([{ id: { in: ['stu-child'] } }]),
      }),
    );

    const student = makeUser({
      sub: 'student-1',
      role: 'student',
      portal: 'private',
      scope: { studentId: 'stu-self' },
    });
    await request(app.server)
      .get('/api/students')
      .set(headersFor(app, student));
    expect(lastWhere(asMock(prisma.student.findMany))).toEqual(
      expect.objectContaining({
        OR: expect.arrayContaining([{ id: { in: ['stu-self'] } }]),
      }),
    );
  });

  it('uses an empty-page filter for unscoped private users but no filter for admins', async () => {
    const teacher = makeUser({
      role: 'teacher',
      portal: 'private',
      scope: {},
    });
    await request(app.server)
      .get('/api/students')
      .set(headersFor(app, teacher));
    expect(lastWhere(asMock(prisma.student.findMany))).toEqual({ id: { in: [] } });

    const director = makeUser({
      sub: 'director-1',
      role: 'director',
      portal: 'admin_portal',
      scope: {},
    });
    await request(app.server)
      .get('/api/students')
      .set(headersFor(app, director));
    expect(lastWhere(asMock(prisma.student.findMany))).toEqual({});
  });

  it('rejects a private-role user on an admin-only audit endpoint', async () => {
    const teacher = makeUser({ sub: 'teacher-1', role: 'teacher', portal: 'private' });
    const response = await request(app.server)
      .get('/api/audit-logs')
      .set(headersFor(app, teacher));

    expect(response.status).toBe(403);
    expect(response.body).toMatchObject({ ok: false, error: 'portal_mismatch' });
  });

  // --- Attendance -----------------------------------------------------------

  it('rejects an attendance entry with an invalid status enum', async () => {
    const teacher = makeUser({ scope: { classIds: ['class-1'] } });
    const response = await request(app.server)
      .post('/api/attendance')
      .set(headersFor(app, teacher))
      .send({
        entries: [
          {
            studentId: 'stu-1',
            classId: 'class-1',
            date: '2026-11-18',
            status: 'maybe',
          },
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({ ok: false, error: 'validation_error' });
    expect(asMock(prisma.attendance.createMany).mock.calls).toHaveLength(0);
  });

  it('blocks attendance outside the teacher’s class scope', async () => {
    const teacher = makeUser({
      sub: 'teacher-1',
      scope: { classIds: ['class-1'] },
    });
    asMock(prisma.student.findMany).mockResolvedValue([
      { id: 'stu-2', classId: 'class-2', levelId: 'lvl-2' },
    ]);

    const response = await request(app.server)
      .post('/api/attendance')
      .set(headersFor(app, teacher))
      .send({
        entries: [
          {
            studentId: 'stu-2',
            classId: 'class-2',
            date: '2026-11-18',
            status: 'present',
          },
        ],
      });

    expect(response.status).toBe(403);
    expect(response.body).toMatchObject({ ok: false, error: 'forbidden' });
    expect(asMock(prisma.attendance.createMany).mock.calls).toHaveLength(0);
  });

  it('records in-scope attendance with an id and recordedBy', async () => {
    const teacher = makeUser({
      sub: 'teacher-1',
      scope: { classIds: ['class-1'] },
    });
    asMock(prisma.student.findMany).mockResolvedValue([
      { id: 'stu-1', classId: 'class-1', levelId: 'lvl-1' },
    ]);
    asMock(prisma.attendance.createMany).mockResolvedValue({ count: 1 });

    const response = await request(app.server)
      .post('/api/attendance')
      .set(headersFor(app, teacher))
      .send({
        entries: [
          {
            studentId: 'stu-1',
            classId: 'class-1',
            date: '2026-11-18',
            status: 'late',
            note: 'arrived late',
          },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ ok: true, created: 1 });
    const data = asMock(prisma.attendance.createMany).mock.calls[0][0].data;
    expect(data[0]).toMatchObject({
      studentId: 'stu-1',
      classId: 'class-1',
      status: 'late',
      note: 'arrived late',
      recordedBy: 'teacher-1',
    });
    expect(typeof data[0].id).toBe('string');
  });

  // --- Feedback card transitions --------------------------------------------

  const director = (): AuthUser =>
    makeUser({
      sub: 'director-1',
      role: 'director',
      portal: 'admin_portal',
      scope: {},
    });

  it('rejects an illegal feedback card status transition', async () => {
    asMock(prisma.feedbackCard.findUnique).mockResolvedValue({
      id: 'card-1',
      status: 'proposed',
      student: { id: 'stu-1', classId: 'class-1', levelId: 'lvl-1' },
    });

    const response = await request(app.server)
      .patch('/api/feedback-cards/card-1')
      .set(headersFor(app, director()))
      .send({ status: 'completed' });

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({ ok: false, error: 'invalid_transition' });
    expect(asMock(prisma.feedbackCard.update).mock.calls).toHaveLength(0);
  });

  it('applies a legal feedback transition and records history plus audit', async () => {
    asMock(prisma.feedbackCard.findUnique).mockResolvedValue({
      id: 'card-1',
      status: 'proposed',
      student: { id: 'stu-1', classId: 'class-1', levelId: 'lvl-1' },
    });
    asMock(prisma.feedbackCard.update).mockResolvedValue({
      id: 'card-1',
      studentId: 'stu-1',
      status: 'approved',
      reviewNotes: 'looks good',
      assigneeId: null,
      updatedBy: 'director-1',
    });

    const response = await request(app.server)
      .patch('/api/feedback-cards/card-1')
      .set(headersFor(app, director()))
      .send({ status: 'approved', reviewNotes: 'looks good' });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      ok: true,
      transition: { from: 'proposed', to: 'approved' },
    });
    expect(asMock(prisma.feedbackCard.update).mock.calls[0][0].data).toMatchObject({
      status: 'approved',
      updatedBy: 'director-1',
    });
    expect(asMock(prisma.feedbackCardHistory.create).mock.calls[0][0].data).toMatchObject({
      cardId: 'card-1',
      action: 'STATUS_CHANGED',
    });

    await flushAudit();
    expect(asMock(prisma.auditLog.create).mock.calls[0][0].data).toMatchObject({
      action: 'FEEDBACK_CARD_STATUS_CHANGED',
      entityType: 'feedback_card',
      entityId: 'card-1',
    });
  });

  // --- Communication governance ---------------------------------------------

  it('blocks sending until human approval and consent are present', async () => {
    asMock(prisma.student.findUnique).mockResolvedValue({
      id: 'stu-1',
      classId: 'class-1',
      levelId: 'lvl-1',
    });
    const actor = director();

    const created = await request(app.server)
      .post('/api/communications')
      .set(headersFor(app, actor))
      .send({ studentId: 'stu-1', type: 'progress_update', channel: 'email' });
    expect(created.status).toBe(200);
    expect(created.body).toMatchObject({ ok: true, communication: { status: 'draft' } });

    const governance = asMock(prisma.communication.create).mock.calls[0][0].data
      .governance as Record<string, unknown>;
    expect(governance).toMatchObject({
      requiresApproval: true,
      requiresConsent: true,
    });
    expect(governance.approval).toEqual({});
    expect(governance.consent).toEqual({});

    asMock(prisma.communication.findUnique).mockResolvedValue({
      id: 'comm-1',
      studentId: 'stu-1',
      status: 'draft',
      governance,
      student: { id: 'stu-1', classId: 'class-1', levelId: 'lvl-1' },
    });

    const blocked = await request(app.server)
      .post('/api/communications/comm-1/send')
      .set(headersFor(app, actor));
    expect(blocked.status).toBe(403);
    expect(blocked.body).toMatchObject({ ok: false, error: 'governance_gate' });
    expect(asMock(prisma.communication.update).mock.calls).toHaveLength(0);

    // Advisory ML output alone must never satisfy the governance gate.
    asMock(prisma.communication.findUnique).mockResolvedValue({
      id: 'comm-1',
      studentId: 'stu-1',
      status: 'draft',
      governance: {
        ...governance,
        advisory: { source: 'ml-advisor', summary: 'suggested follow-up' },
      },
      student: { id: 'stu-1', classId: 'class-1', levelId: 'lvl-1' },
    });
    const advisoryOnly = await request(app.server)
      .post('/api/communications/comm-1/send')
      .set(headersFor(app, actor));
    expect(advisoryOnly.status).toBe(403);
    expect(asMock(prisma.communication.update).mock.calls).toHaveLength(0);
  });

  it('sends a communication once approval and consent are recorded', async () => {
    asMock(prisma.communication.findUnique).mockResolvedValue({
      id: 'comm-1',
      studentId: 'stu-1',
      status: 'draft',
      governance: {
        requiresApproval: true,
        requiresConsent: true,
        approval: { approvedBy: 'director-1' },
        consent: { grantedBy: 'parent-1' },
        advisory: { source: 'ml-advisor' },
      },
      student: { id: 'stu-1', classId: 'class-1', levelId: 'lvl-1' },
    });
    asMock(prisma.communication.update).mockResolvedValue({
      id: 'comm-1',
      studentId: 'stu-1',
      type: 'progress_update',
      status: 'sent',
      sentAt: new Date(),
      sentBy: 'director-1',
    });

    const response = await request(app.server)
      .post('/api/communications/comm-1/send')
      .set(headersFor(app, director()));

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      ok: true,
      communication: { status: 'sent', sentBy: 'director-1' },
    });
    expect(asMock(prisma.communication.update).mock.calls[0][0].data).toMatchObject({
      status: 'sent',
      sentBy: 'director-1',
    });
  });

  // --- Audit log write ------------------------------------------------------

  it('writes an audit entry and serves audit logs to admins', async () => {
    const teacher = makeUser({
      sub: 'teacher-1',
      scope: { classIds: ['class-1'] },
    });
    asMock(prisma.student.findMany).mockResolvedValue([
      { id: 'stu-1', classId: 'class-1', levelId: 'lvl-1' },
    ]);
    asMock(prisma.attendance.createMany).mockResolvedValue({ count: 1 });

    await request(app.server)
      .post('/api/attendance')
      .set(headersFor(app, teacher))
      .send({
        entries: [
          {
            studentId: 'stu-1',
            classId: 'class-1',
            date: '2026-11-18',
            status: 'present',
          },
        ],
      });

    await flushAudit();
    expect(asMock(prisma.auditLog.create).mock.calls.length).toBeGreaterThan(0);
    expect(asMock(prisma.auditLog.create).mock.calls[0][0].data).toMatchObject({
      action: 'ATTENDANCE_RECORDED',
      entityType: 'attendance',
      actorId: 'teacher-1',
    });

    asMock(prisma.auditLog.findMany).mockResolvedValue([
      { id: 'audit-1', action: 'ATTENDANCE_RECORDED' },
    ]);
    asMock(prisma.auditLog.count).mockResolvedValue(1);
    const response = await request(app.server)
      .get('/api/audit-logs')
      .set(headersFor(app, director()));

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ ok: true, total: 1 });
    expect(response.body.auditLogs[0].action).toBe('ATTENDANCE_RECORDED');
  });
});
