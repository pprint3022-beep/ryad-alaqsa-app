// Input validation schemas (Zod-like, zero dependencies)
// Provides schema-based validation for all API endpoints

function isString(v) { return typeof v === 'string'; }
function isNumber(v) { return typeof v === 'number' && !isNaN(v); }
function isBoolean(v) { return typeof v === 'boolean'; }
function isArray(v) { return Array.isArray(v); }
function isObject(v) { return v !== null && typeof v === 'object' && !Array.isArray(v); }
function isEmail(v) { return isString(v) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isDate(v) { return isString(v) && !isNaN(Date.parse(v)); }

const validators = {
  string: (v, opts = {}) => {
    if (!isString(v)) return { ok: false, error: 'must be string' };
    if (opts.min && v.length < opts.min) return { ok: false, error: `min length ${opts.min}` };
    if (opts.max && v.length > opts.max) return { ok: false, error: `max length ${opts.max}` };
    if (opts.enum && !opts.enum.includes(v)) return { ok: false, error: `must be one of: ${opts.enum.join(', ')}` };
    if (opts.pattern && !opts.pattern.test(v)) return { ok: false, error: 'invalid format' };
    return { ok: true, value: v };
  },
  number: (v, opts = {}) => {
    if (!isNumber(v)) return { ok: false, error: 'must be number' };
    if (opts.min !== undefined && v < opts.min) return { ok: false, error: `min ${opts.min}` };
    if (opts.max !== undefined && v > opts.max) return { ok: false, error: `max ${opts.max}` };
    if (opts.integer && !Number.isInteger(v)) return { ok: false, error: 'must be integer' };
    return { ok: true, value: v };
  },
  boolean: (v) => isBoolean(v) ? { ok: true, value: v } : { ok: false, error: 'must be boolean' },
  array: (v, opts = {}) => {
    if (!isArray(v)) return { ok: false, error: 'must be array' };
    if (opts.min && v.length < opts.min) return { ok: false, error: `min items ${opts.min}` };
    if (opts.max && v.length > opts.max) return { ok: false, error: `max items ${opts.max}` };
    return { ok: true, value: v };
  },
  email: (v) => isEmail(v) ? { ok: true, value: v } : { ok: false, error: 'invalid email' },
  date: (v) => isDate(v) ? { ok: true, value: v } : { ok: false, error: 'invalid date' },
  object: (v) => isObject(v) ? { ok: true, value: v } : { ok: false, error: 'must be object' },
};

function validate(schema, data) {
  const errors = {};
  const result = {};
  for (const [key, rule] of Object.entries(schema)) {
    const value = data ? data[key] : undefined;
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors[key] = 'required';
      continue;
    }
    if (value === undefined || value === null) {
      if (rule.default !== undefined) result[key] = rule.default;
      continue;
    }
    const v = (validators[rule.type] || validators.string)(value, rule);
    if (!v.ok) { errors[key] = v.error; continue; }
    result[key] = v.value;
  }
  // Check for unknown fields
  if (data) {
    for (const key of Object.keys(data)) {
      if (!schema[key]) errors[key] = 'unknown field';
    }
  }
  return { ok: Object.keys(errors).length === 0, errors, value: result };
}

// Predefined schemas
const schemas = {
  login: {
    login: { type: 'string', required: true, min: 1 },
    password: { type: 'string', required: true, min: 1 },
    portal: { type: 'string', required: true, enum: ['admin_portal', 'private', 'admin', 'private'] },
  },
  feedbackCardUpdate: {
    id: { type: 'string', required: true },
    status: { type: 'string', enum: ['proposed', 'approved', 'rejected', 'in_progress', 'completed'] },
    assignee: { type: 'string' },
    reviewNotes: { type: 'string', max: 1000 },
    nextReview: { type: 'date' },
    actions: { type: 'array' },
    note: { type: 'string', max: 500 },
  },
  caseUpdate: {
    id: { type: 'string' },
    studentId: { type: 'string' },
    status: { type: 'string', enum: ['active', 'paused', 'closed'] },
    ownerRole: { type: 'string' },
    ownerId: { type: 'string' },
    focus: { type: 'string', max: 500 },
    nextReview: { type: 'date' },
  },
  caseTimeline: {
    id: { type: 'string' },
    studentId: { type: 'string' },
    event: { type: 'string', required: true, min: 1, max: 1000 },
    term: { type: 'string' },
    date: { type: 'date' },
    type: { type: 'string', enum: ['note', 'meeting', 'intervention', 'communication', 'review'] },
  },
  assessment: {
    studentId: { type: 'string', required: true },
    refSkill: { type: 'string' },
    subject: { type: 'string' },
    level: { type: 'string' },
    type: { type: 'string', enum: ['diagnostic', 'formative', 'summative', 'intake'] },
    score: { type: 'number', min: 0, max: 1 },
    term: { type: 'string' },
    date: { type: 'date' },
    evidence: { type: 'string' },
    notes: { type: 'string', max: 1000 },
  },
  communicationUpdate: {
    id: { type: 'string', required: true },
    status: { type: 'string', enum: ['draft', 'approved', 'sent', 'cancelled'] },
    consent: { type: 'string', enum: ['pending', 'granted', 'declined', 'n/a'] },
    notes: { type: 'string', max: 1000 },
  },
  communicationSend: {
    id: { type: 'string', required: true },
    recipientAddress: { type: 'string' },
    body: { type: 'string', max: 5000 },
  },
};

module.exports = { validate, schemas, validators };
