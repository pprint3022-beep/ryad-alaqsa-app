import { randomUUID } from 'node:crypto';
import type { FastifyInstance, FastifyReply } from 'fastify';
import {
  AttendanceStatus,
  CardStatus,
  CaseStatus,
  CommStatus,
  Portal,
  type Prisma,
  type Role,
} from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import type { AuthUser } from '../lib/tokens';
import type { AuthPreHandler } from '../plugins/auth';
import {
  ADMIN_PORTAL_ROLES,
  assertScope,
  isAdminPortalRole,
  roleBelongsToPortal,
  type AuthScope,
  type ScopeTarget,
} from '../plugins/rbac';

/**
 * Domain API. Every endpoint requires a valid access token. Reads are filtered
 * by the caller's stored scope; writes additionally assert it. Advisory ML
 * output is only ever stored as advisory metadata — it never becomes an
 * approval, consent, or decision.
 */

const ADMIN_ROLES: Role[] = [...ADMIN_PORTAL_ROLES];
const RECORDER_ROLES: Role[] = [...ADMIN_PORTAL_ROLES, 'teacher'];
const MAX_PAGE_SIZE = 200;

const pagination = {
  limit: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(50),
  offset: z.coerce.number().int().min(0).default(0),
};

const idParam = z.object({ id: z.string().min(1) });

function fail(
  reply: FastifyReply,
  statusCode: number,
  error: string,
  message: string,
): FastifyReply {
  return reply.code(statusCode).send({ ok: false, error, message });
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter((value) => value.length > 0))];
}

function scopeCollections(scope: AuthScope): {
  classIds: string[];
  levelIds: string[];
  studentIds: string[];
} {
  return {
    classIds: unique([...(scope.classes ?? []), ...(scope.classIds ?? [])]),
    levelIds: unique([...(scope.levels ?? []), ...(scope.levelIds ?? [])]),
    studentIds: unique([
      ...(scope.children ?? []),
      ...(scope.childIds ?? []),
      ...(scope.studentIds ?? []),
      ...(scope.studentId ? [scope.studentId] : []),
      ...(scope.selfId ? [scope.selfId] : []),
    ]),
  };
}

function hasScopeRestriction(scope: AuthScope): boolean {
  if (scope.all === true) return true;
  const { classIds, levelIds, studentIds } = scopeCollections(scope);
  return classIds.length > 0 || levelIds.length > 0 || studentIds.length > 0;
}

/** Admin-portal staff are organisation-wide until their scope narrows access. */
function isUnrestrictedAdmin(user: AuthUser): boolean {
  return isAdminPortalRole(user.role) && !hasScopeRestriction(user.scope);
}

export function scopedStudentWhere(user: AuthUser): Prisma.StudentWhereInput {
  if (user.scope.all === true) return {};

  const { classIds, levelIds, studentIds } = scopeCollections(user.scope);
  if (isUnrestrictedAdmin(user)) return {};

  const clauses: Prisma.StudentWhereInput[] = [];
  if (studentIds.length > 0) clauses.push({ id: { in: studentIds } });
  if (classIds.length > 0) clauses.push({ classId: { in: classIds } });
  if (levelIds.length > 0) clauses.push({ levelId: { in: levelIds } });

  return clauses.length > 0 ? { OR: clauses } : { id: { in: [] } };
}

export function scopedClassWhere(user: AuthUser): Prisma.ClassWhereInput {
  if (user.scope.all === true) return {};

  const { classIds, levelIds } = scopeCollections(user.scope);
  if (isUnrestrictedAdmin(user)) return {};

  const clauses: Prisma.ClassWhereInput[] = [];
  if (classIds.length > 0) clauses.push({ id: { in: classIds } });
  if (levelIds.length > 0) clauses.push({ levelId: { in: levelIds } });
  if (user.role === 'parent' || user.role === 'student') {
    clauses.push({ students: { some: scopedStudentWhere(user) } });
  }

  return clauses.length > 0 ? { OR: clauses } : { id: { in: [] } };
}

/** Throws ScopeError (403 via the global error handler) for out-of-scope writes. */
function ensureScope(user: AuthUser, target: ScopeTarget): void {
  if (isUnrestrictedAdmin(user)) return;
  assertScope(user.scope, target);
}

const ensurePortalRole: AuthPreHandler = async (request, reply) => {
  const user = request.user;
  if (!user?.sub) {
    return fail(reply, 401, 'unauthorized', 'Authentication is required');
  }
  if (!roleBelongsToPortal(user.role, user.portal)) {
    return fail(
      reply,
      403,
      'portal_mismatch',
      'This role cannot use the selected portal',
    );
  }
};

const CARD_TRANSITIONS: Record<CardStatus, CardStatus[]> = {
  [CardStatus.proposed]: [CardStatus.approved, CardStatus.rejected, CardStatus.in_progress],
  [CardStatus.approved]: [CardStatus.in_progress, CardStatus.rejected],
  [CardStatus.rejected]: [CardStatus.proposed],
  [CardStatus.in_progress]: [CardStatus.completed, CardStatus.rejected],
  [CardStatus.completed]: [],
};

const CASE_TRANSITIONS: Record<CaseStatus, CaseStatus[]> = {
  [CaseStatus.active]: [CaseStatus.paused, CaseStatus.closed],
  [CaseStatus.paused]: [CaseStatus.active, CaseStatus.closed],
  [CaseStatus.closed]: [CaseStatus.active],
};

// --- Validation schemas -----------------------------------------------------

const studentListQuery = z.object({
  ...pagination,
  classId: z.string().min(1).optional(),
  levelId: z.string().min(1).optional(),
  search: z.string().trim().min(1).optional(),
});

const classListQuery = z.object({
  ...pagination,
  levelId: z.string().min(1).optional(),
  search: z.string().trim().min(1).optional(),
});

const attendanceListQuery = z.object({
  ...pagination,
  studentId: z.string().min(1).optional(),
  classId: z.string().min(1).optional(),
  status: z.nativeEnum(AttendanceStatus).optional(),
});

const attendanceEntry = z.object({
  studentId: z.string().min(1),
  classId: z.string().min(1),
  date: z.coerce.date(),
  status: z.nativeEnum(AttendanceStatus),
  note: z.string().trim().max(500).optional(),
});

const attendanceBulkBody = z.object({
  entries: z.array(attendanceEntry).min(1).max(MAX_PAGE_SIZE),
});

const gradeListQuery = z.object({
  ...pagination,
  studentId: z.string().min(1).optional(),
  subjectId: z.string().min(1).optional(),
  classId: z.string().min(1).optional(),
  term: z.string().trim().min(1).optional(),
});

const gradeEntry = z
  .object({
    studentId: z.string().min(1),
    subjectId: z.string().min(1),
    score: z.number().finite(),
    scale: z.number().positive().max(1_000).default(20),
    classId: z.string().min(1).optional(),
    term: z.string().trim().min(1).optional(),
    date: z.coerce.date().optional(),
  })
  .refine((entry) => entry.score >= 0 && entry.score <= entry.scale, {
    message: 'score must be between 0 and scale',
    path: ['score'],
  });

const gradeBulkBody = z.object({
  entries: z.array(gradeEntry).min(1).max(MAX_PAGE_SIZE),
});

const cardListQuery = z.object({
  ...pagination,
  status: z.nativeEnum(CardStatus).optional(),
  studentId: z.string().min(1).optional(),
});

const cardPatchBody = z.object({
  status: z.nativeEnum(CardStatus),
  reviewNotes: z.string().trim().max(2_000).optional(),
  assigneeId: z.string().min(1).nullable().optional(),
});

const caseListQuery = z.object({
  ...pagination,
  status: z.nativeEnum(CaseStatus).optional(),
  studentId: z.string().min(1).optional(),
});

const casePatchBody = z.object({
  status: z.nativeEnum(CaseStatus),
  focus: z.string().trim().max(500).optional(),
});

const caseTimelineBody = z.object({
  event: z.string().trim().min(1).max(2_000),
  eventDate: z.coerce.date().optional(),
  term: z.string().trim().min(1).optional(),
  type: z.string().trim().min(1).optional(),
});

const communicationListQuery = z.object({
  ...pagination,
  studentId: z.string().min(1).optional(),
  status: z.enum(['draft', 'approved', 'sent', 'cancelled']).optional(),
});

/**
 * Governance is explicit and human-owned: `approval` and `consent` must carry
 * an actor id. `advisory` is free-form ML output and is never read as a
 * decision by the send gate.
 */
const governanceInput = z.object({
  approval: z
    .object({ approvedBy: z.string().min(1) })
    .nullable()
    .optional(),
  consent: z.object({ grantedBy: z.string().min(1) }).nullable().optional(),
  advisory: z
    .object({
      source: z.string().min(1).max(200),
      summary: z.string().trim().max(2_000).optional(),
    })
    .nullable()
    .optional(),
});
type GovernanceInput = z.infer<typeof governanceInput>;

const communicationBody = z.object({
  studentId: z.string().min(1).optional(),
  type: z.string().trim().min(1).max(100),
  channel: z.string().trim().min(1).optional(),
  notes: z.string().trim().max(2_000).optional(),
  governance: governanceInput.optional(),
});

const auditLogListQuery = z.object({
  ...pagination,
  actorId: z.string().min(1).optional(),
  action: z.string().trim().min(1).optional(),
  entityType: z.string().trim().min(1).optional(),
});

// --- Governance helpers -----------------------------------------------------

function buildGovernance(input?: GovernanceInput): Prisma.InputJsonValue {
  return {
    requiresApproval: true,
    requiresConsent: true,
    approval: input?.approval ? { approvedBy: input.approval.approvedBy } : {},
    consent: input?.consent ? { grantedBy: input.consent.grantedBy } : {},
    advisory: input?.advisory
      ? {
          source: input.advisory.source,
          summary: input.advisory.summary ?? '',
        }
      : {},
  };
}

function governanceGate(value: unknown): { allowed: boolean; missing: string[] } {
  const governance =
    value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  const approval = governance.approval as { approvedBy?: string } | undefined;
  const consent = governance.consent as { grantedBy?: string } | undefined;

  const missing: string[] = [];
  if (!approval?.approvedBy) missing.push('approval');
  if (!consent?.grantedBy) missing.push('consent');

  return { allowed: missing.length === 0, missing };
}

// --- Plugin -----------------------------------------------------------------

export async function domainRoutes(app: FastifyInstance): Promise<void> {
  const readHooks = [app.authenticate, ensurePortalRole];
  const recorderHooks = [
    app.authenticate,
    ensurePortalRole,
    app.requireRoles(RECORDER_ROLES),
  ];
  const adminHooks = [
    app.authenticate,
    ensurePortalRole,
    app.requirePortal(Portal.admin_portal),
    app.requireRoles(ADMIN_ROLES),
  ];

  // ------------------------------------------------------------------ students
  app.get(
    '/api/students',
    { preHandler: readHooks },
    async (request) => {
      const query = studentListQuery.parse(request.query);
      const where: Prisma.StudentWhereInput = {
        ...scopedStudentWhere(request.user),
        ...(query.classId ? { classId: query.classId } : {}),
        ...(query.levelId ? { levelId: query.levelId } : {}),
        ...(query.search
          ? { name: { contains: query.search, mode: 'insensitive' as const } }
          : {}),
      };

      const [students, total] = await Promise.all([
        prisma.student.findMany({
          where,
          select: {
            id: true,
            name: true,
            classId: true,
            levelId: true,
            guardianId: true,
          },
          orderBy: { name: 'asc' },
          skip: query.offset,
          take: query.limit,
        }),
        prisma.student.count({ where }),
      ]);

      return { ok: true, students, total, limit: query.limit, offset: query.offset };
    },
  );

  // ------------------------------------------------------------------- classes
  app.get('/api/classes', { preHandler: readHooks }, async (request) => {
    const query = classListQuery.parse(request.query);
    const where: Prisma.ClassWhereInput = {
      ...scopedClassWhere(request.user),
      ...(query.levelId ? { levelId: query.levelId } : {}),
      ...(query.search
        ? { name: { contains: query.search, mode: 'insensitive' as const } }
        : {}),
    };

    const [classes, total] = await Promise.all([
      prisma.class.findMany({
        where,
        select: { id: true, name: true, levelId: true, teacherId: true },
        orderBy: { name: 'asc' },
        skip: query.offset,
        take: query.limit,
      }),
      prisma.class.count({ where }),
    ]);

    return { ok: true, classes, total, limit: query.limit, offset: query.offset };
  });

  // ------------------------------------------------------------ reports/overview
  app.get(
    '/api/reports/overview',
    { preHandler: readHooks },
    async (request) => {
      const studentWhere = scopedStudentWhere(request.user);
      const classWhere = scopedClassWhere(request.user);

      const [
        students,
        classes,
        attendanceTotal,
        attendancePresent,
        grades,
        activeCases,
        proposedCards,
        draftComms,
        sentComms,
      ] = await Promise.all([
        prisma.student.count({ where: studentWhere }),
        prisma.class.count({ where: classWhere }),
        prisma.attendance.count({ where: { student: studentWhere } }),
        prisma.attendance.count({
          where: { student: studentWhere, status: AttendanceStatus.present },
        }),
        prisma.grade.aggregate({
          where: { student: studentWhere },
          _avg: { score: true },
        }),
        prisma.case.count({
          where: { student: studentWhere, status: CaseStatus.active },
        }),
        prisma.feedbackCard.count({
          where: { student: studentWhere, status: CardStatus.proposed },
        }),
        prisma.communication.count({
          where: { student: studentWhere, status: CommStatus.draft },
        }),
        prisma.communication.count({
          where: { student: studentWhere, status: CommStatus.sent },
        }),
      ]);

      return {
        ok: true,
        overview: {
          students,
          classes,
          attendance: {
            total: attendanceTotal,
            present: attendancePresent,
            rate: attendanceTotal === 0 ? 0 : attendancePresent / attendanceTotal,
          },
          grades: { average: grades._avg.score ?? 0 },
          cases: { active: activeCases },
          feedbackCards: { proposed: proposedCards },
          communications: { draft: draftComms, sent: sentComms },
        },
      };
    },
  );

  // ---------------------------------------------------------------- attendance
  app.get(
    '/api/attendance',
    { preHandler: readHooks },
    async (request) => {
      const query = attendanceListQuery.parse(request.query);
      const where: Prisma.AttendanceWhereInput = {
        ...(query.classId ? { classId: query.classId } : {}),
        ...(query.studentId ? { studentId: query.studentId } : {}),
        ...(query.status ? { status: query.status } : {}),
        student: scopedStudentWhere(request.user),
      };

      const [attendance, total] = await Promise.all([
        prisma.attendance.findMany({
          where,
          select: {
            id: true,
            studentId: true,
            classId: true,
            date: true,
            status: true,
            note: true,
            recordedBy: true,
          },
          orderBy: { date: 'desc' },
          skip: query.offset,
          take: query.limit,
        }),
        prisma.attendance.count({ where }),
      ]);

      return { ok: true, attendance, total, limit: query.limit, offset: query.offset };
    },
  );

  app.post(
    '/api/attendance',
    { preHandler: recorderHooks },
    async (request, reply) => {
      const body = attendanceBulkBody.parse(request.body);
      const user = request.user;
      const studentIds = unique(body.entries.map((entry) => entry.studentId));

      const students = await prisma.student.findMany({
        where: { id: { in: studentIds } },
        select: { id: true, classId: true, levelId: true },
      });
      const byId = new Map(students.map((student) => [student.id, student]));

      for (const entry of body.entries) {
        const student = byId.get(entry.studentId);
        if (!student) {
          return fail(
            reply,
            422,
            'invalid_entry',
            `Unknown student: ${entry.studentId}`,
          );
        }
        ensureScope(user, { classId: entry.classId });
        ensureScope(user, {
          student: {
            id: student.id,
            classId: student.classId,
            levelId: student.levelId,
          },
        });
      }

      const created = await prisma.attendance.createMany({
        data: body.entries.map((entry) => ({
          id: randomUUID(),
          studentId: entry.studentId,
          classId: entry.classId,
          date: entry.date,
          status: entry.status,
          note: entry.note,
          recordedBy: user.sub,
        })),
      });

      app.audit({
        actorId: user.sub,
        role: user.role,
        action: 'ATTENDANCE_RECORDED',
        entityType: 'attendance',
        details: {
          count: created.count,
          classIds: unique(body.entries.map((entry) => entry.classId)),
        },
      });

      return { ok: true, created: created.count };
    },
  );

  // --------------------------------------------------------------------- grades
  app.get('/api/grades', { preHandler: readHooks }, async (request) => {
    const query = gradeListQuery.parse(request.query);
    const where: Prisma.GradeWhereInput = {
      ...(query.classId ? { classId: query.classId } : {}),
      ...(query.studentId ? { studentId: query.studentId } : {}),
      ...(query.subjectId ? { subjectId: query.subjectId } : {}),
      ...(query.term ? { term: query.term } : {}),
      student: scopedStudentWhere(request.user),
    };

    const [grades, total] = await Promise.all([
      prisma.grade.findMany({
        where,
        select: {
          id: true,
          studentId: true,
          subjectId: true,
          classId: true,
          score: true,
          scale: true,
          term: true,
          date: true,
        },
        orderBy: { date: 'desc' },
        skip: query.offset,
        take: query.limit,
      }),
      prisma.grade.count({ where }),
    ]);

    return { ok: true, grades, total, limit: query.limit, offset: query.offset };
  });

  app.post(
    '/api/grades',
    { preHandler: recorderHooks },
    async (request, reply) => {
      const body = gradeBulkBody.parse(request.body);
      const user = request.user;
      const studentIds = unique(body.entries.map((entry) => entry.studentId));

      const students = await prisma.student.findMany({
        where: { id: { in: studentIds } },
        select: { id: true, classId: true, levelId: true },
      });
      const byId = new Map(students.map((student) => [student.id, student]));

      for (const entry of body.entries) {
        const student = byId.get(entry.studentId);
        if (!student) {
          return fail(
            reply,
            422,
            'invalid_entry',
            `Unknown student: ${entry.studentId}`,
          );
        }
        if (entry.classId) ensureScope(user, { classId: entry.classId });
        ensureScope(user, {
          student: {
            id: student.id,
            classId: student.classId,
            levelId: student.levelId,
          },
        });
      }

      const created = await prisma.grade.createMany({
        data: body.entries.map((entry) => ({
          id: randomUUID(),
          studentId: entry.studentId,
          subjectId: entry.subjectId,
          classId: entry.classId,
          score: entry.score,
          scale: entry.scale,
          term: entry.term,
          teacherId: user.sub,
          ...(entry.date ? { date: entry.date } : {}),
        })),
      });

      app.audit({
        actorId: user.sub,
        role: user.role,
        action: 'GRADES_RECORDED',
        entityType: 'grade',
        details: { count: created.count },
      });

      return { ok: true, created: created.count };
    },
  );

  // ------------------------------------------------------------- feedback cards
  app.get(
    '/api/feedback-cards',
    { preHandler: readHooks },
    async (request) => {
      const query = cardListQuery.parse(request.query);
      const where: Prisma.FeedbackCardWhereInput = {
        ...(query.status ? { status: query.status } : {}),
        ...(query.studentId ? { studentId: query.studentId } : {}),
        student: scopedStudentWhere(request.user),
      };

      const [cards, total] = await Promise.all([
        prisma.feedbackCard.findMany({
          where,
          select: {
            id: true,
            studentId: true,
            agent: true,
            status: true,
            priority: true,
            summary: true,
            assigneeId: true,
            reviewNotes: true,
            nextReview: true,
          },
          orderBy: { createdAt: 'desc' },
          skip: query.offset,
          take: query.limit,
        }),
        prisma.feedbackCard.count({ where }),
      ]);

      return { ok: true, cards, total, limit: query.limit, offset: query.offset };
    },
  );

  app.patch(
    '/api/feedback-cards/:id',
    { preHandler: adminHooks },
    async (request, reply) => {
      const { id } = idParam.parse(request.params);
      const body = cardPatchBody.parse(request.body);
      const user = request.user;

      const card = await prisma.feedbackCard.findUnique({
        where: { id },
        select: {
          id: true,
          status: true,
          student: { select: { id: true, classId: true, levelId: true } },
        },
      });

      if (!card) {
        return fail(reply, 404, 'not_found', 'Feedback card not found');
      }
      ensureScope(user, { student: card.student });

      if (!CARD_TRANSITIONS[card.status].includes(body.status)) {
        return fail(
          reply,
          409,
          'invalid_transition',
          `Cannot change feedback card from ${card.status} to ${body.status}`,
        );
      }

      const updated = await prisma.feedbackCard.update({
        where: { id },
        data: {
          status: body.status,
          ...(body.reviewNotes !== undefined
            ? { reviewNotes: body.reviewNotes }
            : {}),
          ...(body.assigneeId !== undefined
            ? { assigneeId: body.assigneeId }
            : {}),
          updatedAt: new Date(),
          updatedBy: user.sub,
        },
        select: {
          id: true,
          studentId: true,
          status: true,
          reviewNotes: true,
          assigneeId: true,
          updatedBy: true,
        },
      });

      await prisma.feedbackCardHistory.create({
        data: {
          cardId: id,
          byUser: user.sub,
          action: 'STATUS_CHANGED',
          note: `${card.status} -> ${body.status}`,
        },
      });

      app.audit({
        actorId: user.sub,
        role: user.role,
        action: 'FEEDBACK_CARD_STATUS_CHANGED',
        entityType: 'feedback_card',
        entityId: id,
        details: { from: card.status, to: body.status, studentId: card.student.id },
      });

      return { ok: true, card: updated, transition: { from: card.status, to: body.status } };
    },
  );

  // ---------------------------------------------------------------------- cases
  app.get('/api/cases', { preHandler: readHooks }, async (request) => {
    const query = caseListQuery.parse(request.query);
    const where: Prisma.CaseWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.studentId ? { studentId: query.studentId } : {}),
      student: scopedStudentWhere(request.user),
    };

    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where,
        select: {
          id: true,
          studentId: true,
          status: true,
          ownerId: true,
          focus: true,
          openedAt: true,
          nextReview: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: query.offset,
        take: query.limit,
      }),
      prisma.case.count({ where }),
    ]);

    return { ok: true, cases, total, limit: query.limit, offset: query.offset };
  });

  app.patch(
    '/api/cases/:id',
    { preHandler: adminHooks },
    async (request, reply) => {
      const { id } = idParam.parse(request.params);
      const body = casePatchBody.parse(request.body);
      const user = request.user;

      const existing = await prisma.case.findUnique({
        where: { id },
        select: {
          id: true,
          status: true,
          student: { select: { id: true, classId: true, levelId: true } },
        },
      });

      if (!existing) {
        return fail(reply, 404, 'not_found', 'Case not found');
      }
      ensureScope(user, { student: existing.student });

      if (!CASE_TRANSITIONS[existing.status].includes(body.status)) {
        return fail(
          reply,
          409,
          'invalid_transition',
          `Cannot change case from ${existing.status} to ${body.status}`,
        );
      }

      const updated = await prisma.case.update({
        where: { id },
        data: {
          status: body.status,
          ...(body.focus !== undefined ? { focus: body.focus } : {}),
          updatedAt: new Date(),
        },
        select: { id: true, studentId: true, status: true, focus: true, updatedAt: true },
      });

      app.audit({
        actorId: user.sub,
        role: user.role,
        action: 'CASE_STATUS_CHANGED',
        entityType: 'case',
        entityId: id,
        details: {
          from: existing.status,
          to: body.status,
          studentId: existing.student.id,
        },
      });

      return { ok: true, case: updated };
    },
  );

  app.post(
    '/api/cases/:id/timeline',
    { preHandler: adminHooks },
    async (request, reply) => {
      const { id } = idParam.parse(request.params);
      const body = caseTimelineBody.parse(request.body);
      const user = request.user;

      const existing = await prisma.case.findUnique({
        where: { id },
        select: {
          id: true,
          student: { select: { id: true, classId: true, levelId: true } },
        },
      });

      if (!existing) {
        return fail(reply, 404, 'not_found', 'Case not found');
      }
      ensureScope(user, { student: existing.student });

      const event = await prisma.caseTimeline.create({
        data: {
          caseId: id,
          term: body.term,
          eventDate: body.eventDate ?? new Date(),
          event: body.event,
          type: body.type,
          byUser: user.sub,
        },
        select: {
          id: true,
          caseId: true,
          eventDate: true,
          event: true,
          type: true,
        },
      });

      app.audit({
        actorId: user.sub,
        role: user.role,
        action: 'CASE_TIMELINE_ADDED',
        entityType: 'case_timeline',
        entityId: id,
        details: { studentId: existing.student.id },
      });

      return { ok: true, event };
    },
  );

  // ------------------------------------------------------------- communications
  app.get(
    '/api/communications',
    { preHandler: readHooks },
    async (request) => {
      const query = communicationListQuery.parse(request.query);
      const where: Prisma.CommunicationWhereInput = {
        ...(query.studentId ? { studentId: query.studentId } : {}),
        ...(query.status ? { status: query.status } : {}),
        student: scopedStudentWhere(request.user),
      };

      const [communications, total] = await Promise.all([
        prisma.communication.findMany({
          where,
          select: {
            id: true,
            studentId: true,
            type: true,
            channel: true,
            status: true,
            notes: true,
            sentAt: true,
            sentBy: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          skip: query.offset,
          take: query.limit,
        }),
        prisma.communication.count({ where }),
      ]);

      return {
        ok: true,
        communications,
        total,
        limit: query.limit,
        offset: query.offset,
      };
    },
  );

  app.post(
    '/api/communications',
    { preHandler: adminHooks },
    async (request, reply) => {
      const body = communicationBody.parse(request.body);
      const user = request.user;

      if (!body.studentId) {
        return fail(
          reply,
          400,
          'validation_error',
          'studentId is required to create a communication',
        );
      }
      const student = await prisma.student.findUnique({
        where: { id: body.studentId },
        select: { id: true, classId: true, levelId: true },
      });
      if (!student) {
        return fail(reply, 404, 'not_found', 'Student not found');
      }
      ensureScope(user, { student });

      const communication = await prisma.communication.create({
        data: {
          id: randomUUID(),
          studentId: body.studentId,
          type: body.type,
          channel: body.channel,
          notes: body.notes,
          status: 'draft',
          governance: buildGovernance(body.governance),
          byUser: user.sub,
        },
        select: {
          id: true,
          studentId: true,
          type: true,
          channel: true,
          status: true,
          governance: true,
          byUser: true,
        },
      });

      app.audit({
        actorId: user.sub,
        role: user.role,
        action: 'COMMUNICATION_CREATED',
        entityType: 'communication',
        entityId: communication.id,
        details: { studentId: body.studentId },
      });

      return { ok: true, communication };
    },
  );

  app.post(
    '/api/communications/:id/send',
    { preHandler: adminHooks },
    async (request, reply) => {
      const { id } = idParam.parse(request.params);
      const user = request.user;

      const communication = await prisma.communication.findUnique({
        where: { id },
        select: {
          id: true,
          studentId: true,
          status: true,
          governance: true,
          student: { select: { id: true, classId: true, levelId: true } },
        },
      });

      if (!communication) {
        return fail(reply, 404, 'not_found', 'Communication not found');
      }
      if (communication.student) {
        ensureScope(user, { student: communication.student });
      } else if (!isAdminPortalRole(user.role)) {
        return fail(reply, 403, 'forbidden', 'No access to this communication');
      }

      if (communication.status !== 'draft') {
        return fail(
          reply,
          409,
          'invalid_status',
          `Only draft communications can be sent (current: ${communication.status})`,
        );
      }

      // Governance gate: a human approval and recorded consent are mandatory.
      // Advisory ML output cannot satisfy either requirement.
      const gate = governanceGate(communication.governance);
      if (!gate.allowed) {
        return fail(
          reply,
          403,
          'governance_gate',
          `Cannot send before governance requirements are met: ${gate.missing.join(', ')}`,
        );
      }

      const sentAt = new Date();
      const updated = await prisma.communication.update({
        where: { id },
        data: { status: 'sent', sentAt, sentBy: user.sub, updatedAt: sentAt },
        select: {
          id: true,
          studentId: true,
          type: true,
          status: true,
          sentAt: true,
          sentBy: true,
        },
      });

      app.audit({
        actorId: user.sub,
        role: user.role,
        action: 'COMMUNICATION_SENT',
        entityType: 'communication',
        entityId: id,
        details: { studentId: communication.studentId },
      });

      return { ok: true, communication: updated };
    },
  );

  // ---------------------------------------------------------------- audit logs
  app.get(
    '/api/audit-logs',
    { preHandler: adminHooks },
    async (request) => {
      const query = auditLogListQuery.parse(request.query);
      const where: Prisma.AuditLogWhereInput = {
        ...(query.actorId ? { actorId: query.actorId } : {}),
        ...(query.action ? { action: query.action } : {}),
        ...(query.entityType ? { entityType: query.entityType } : {}),
      };

      const [auditLogs, total] = await Promise.all([
        prisma.auditLog.findMany({
          where,
          select: {
            id: true,
            actorId: true,
            role: true,
            action: true,
            entityType: true,
            entityId: true,
            details: true,
            at: true,
          },
          orderBy: { at: 'desc' },
          skip: query.offset,
          take: query.limit,
        }),
        prisma.auditLog.count({ where }),
      ]);

      return { ok: true, auditLogs, total, limit: query.limit, offset: query.offset };
    },
  );
}
