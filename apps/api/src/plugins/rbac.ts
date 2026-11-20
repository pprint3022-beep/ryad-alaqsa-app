import type { Portal, Role } from '@prisma/client';

/**
 * Scope shape stored on User.scope (JSON).
 *
 * The prototype used `classes` and `children`; those aliases are accepted so
 * migrated data keeps working alongside the canonical `classIds`, `levelIds`,
 * and `childIds` names.
 */
export interface AuthScope {
  all?: boolean;
  classes?: string[];
  classIds?: string[];
  levels?: string[];
  levelIds?: string[];
  children?: string[];
  childIds?: string[];
  studentId?: string;
  studentIds?: string[];
  selfId?: string;
  [key: string]: unknown;
}

export interface StudentRef {
  id: string;
  classId?: string | null;
  levelId?: string | null;
}

export interface ScopeTarget {
  classId?: string | null;
  levelId?: string | null;
  studentId?: string | null;
  student?: StudentRef | null;
}

export const ADMIN_PORTAL_ROLES: readonly Role[] = [
  'director',
  'deputy',
  'supervisor',
  'clerk',
  'admin',
];

export const PRIVATE_PORTAL_ROLES: readonly Role[] = [
  'teacher',
  'parent',
  'student',
];

const ARRAY_SCOPE_KEYS = [
  'classes',
  'classIds',
  'levels',
  'levelIds',
  'children',
  'childIds',
  'studentIds',
] as const;

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is string => typeof item === 'string' && item.length > 0,
  );
}

/**
 * Normalizes User.scope from Prisma JSON into a predictable object. Handles
 * null, arrays, stringified JSON, and non-string array members.
 */
export function normalizeScope(raw: unknown): AuthScope {
  let value = raw;

  if (typeof value === 'string') {
    try {
      value = JSON.parse(value) as unknown;
    } catch {
      return {};
    }
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  const source = value as Record<string, unknown>;
  const scope = { ...source } as AuthScope;

  for (const key of ARRAY_SCOPE_KEYS) {
    scope[key] = toStringArray(source[key]);
  }

  if (typeof source.studentId === 'string' && source.studentId.length > 0) {
    scope.studentId = source.studentId;
  } else {
    delete scope.studentId;
  }

  if (typeof source.selfId === 'string' && source.selfId.length > 0) {
    scope.selfId = source.selfId;
  } else {
    delete scope.selfId;
  }

  if (source.all !== true) {
    delete scope.all;
  }

  return scope;
}

function collectIds(scope: AuthScope, ...keys: string[]): string[] {
  const ids = new Set<string>();

  for (const key of keys) {
    const value = scope[key];
    if (!Array.isArray(value)) continue;

    for (const item of value) {
      if (typeof item === 'string' && item.length > 0) {
        ids.add(item);
      }
    }
  }

  return [...ids];
}

/**
 * Checks class access. When levelId is supplied, a teacher assigned to the
 * whole level is also allowed. `*` acts as a wildcard for administrator scopes.
 */
export function canAccessClass(
  scope: AuthScope,
  classId?: string | null,
  levelId?: string | null,
): boolean {
  if (scope.all === true) return true;

  const classIds = collectIds(scope, 'classIds', 'classes');
  const levelIds = collectIds(scope, 'levelIds', 'levels');

  if (classIds.includes('*') || levelIds.includes('*')) return true;
  if (classId && classIds.includes(classId)) return true;

  return Boolean(levelId && levelIds.includes(levelId));
}

/**
 * Checks student access via parent child scope, student self scope, or the
 * student's class/level (teacher scope).
 */
export function canAccessStudent(
  scope: AuthScope,
  student: StudentRef,
): boolean {
  if (scope.all === true) return true;

  const ids = collectIds(scope, 'childIds', 'children', 'studentIds');

  if (typeof scope.studentId === 'string') ids.push(scope.studentId);
  if (typeof scope.selfId === 'string') ids.push(scope.selfId);
  if (ids.includes(student.id)) return true;

  return canAccessClass(scope, student.classId, student.levelId);
}

export function canAccessTarget(
  scope: AuthScope,
  target: ScopeTarget,
): boolean {
  if (target.student) {
    return canAccessStudent(scope, target.student);
  }

  if (target.studentId) {
    return canAccessStudent(scope, {
      id: target.studentId,
      classId: target.classId,
      levelId: target.levelId,
    });
  }

  if (target.classId || target.levelId) {
    return canAccessClass(scope, target.classId, target.levelId);
  }

  return true;
}

export class ScopeError extends Error {
  readonly statusCode = 403;
  readonly code = 'forbidden';

  constructor(message = 'Access outside the permitted scope') {
    super(message);
    this.name = 'ScopeError';
  }
}

/**
 * Throws ScopeError (mapped to HTTP 403 by the global error handler) when the
 * resource is outside the caller's scope. Pass a student object when available
 * so class-based teacher scope can be evaluated.
 */
export function assertScope(scope: AuthScope, target: ScopeTarget): void {
  if (!canAccessTarget(scope, target)) {
    throw new ScopeError();
  }
}

export function roleBelongsToPortal(role: Role, portal: Portal): boolean {
  return portal === 'admin_portal'
    ? ADMIN_PORTAL_ROLES.includes(role)
    : PRIVATE_PORTAL_ROLES.includes(role);
}

export function isAdminPortalRole(role: Role): boolean {
  return ADMIN_PORTAL_ROLES.includes(role);
}

export function isPrivatePortalRole(role: Role): boolean {
  return PRIVATE_PORTAL_ROLES.includes(role);
}
