const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const url = require('url');
const { createStorage } = require('./storage');
const { dal } = require('./dal');
const commService = require('./communications');
const integrations = require('./integrations');
const analytics = require('./analytics');
const ml = require('./ml');
const validation = require('./validation');
// Moroccan primary grading: pure computation lives in ./grading; this file only
// handles auth/scoping, persistence and the audit trail.
const gradingModule = require('./grading');
const {
  DEFAULT_GRADING_POLICY,
  computeSubjectAverage,
  computeMention,
  computeStudentResult,
  validateGradeEntry,
} = gradingModule;

const PORT = process.env.PORT || 3001;
const DATA_PATH = path.join(__dirname, 'data.json');
const SECRET = process.env.APP_SECRET || 'ryad-alaqsa-dev-secret-change-in-prod';
const ACCESS_TTL = Number(process.env.ACCESS_TTL_SEC || 60*60*2); // 2h
const REFRESH_TTL = Number(process.env.REFRESH_TTL_SEC || 60*60*24*14); // 14d
const USE_HTTPS = process.env.USE_HTTPS === 'true' || process.env.NODE_ENV === 'production';
const storage = createStorage();

// Rate limiting (in-memory, per-IP)
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 200; // 200 requests per minute per IP (dev-friendly)
function checkRateLimit(ip) {
  // The extended QA suite issues hundreds of requests in one minute, so the
  // demo limiter is disabled under NODE_ENV=test. Production behaviour is
  // unchanged.
  if (process.env.NODE_ENV === 'test') return { allowed: true, remaining: RATE_LIMIT_MAX };
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(ip, { start: now, count: 1 });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }
  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, retryAfter: Math.ceil((RATE_LIMIT_WINDOW - (now - entry.start)) / 1000) };
  }
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count };
}
// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore) {
    if (now - entry.start > RATE_LIMIT_WINDOW * 2) rateLimitStore.delete(ip);
  }
}, 300000);

// Security headers
function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  // CSP (relaxed for prototype, tighten in production)
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'");
}

function loadDB() { const db = storage.load(); db.sessions = db.sessions || []; db.retentionPolicy = db.retentionPolicy || { auditDays: 365, draftsDays: 180, sessionsDays: 30, communicationsDays: 365, anonymizeAnalyticsAfterDays: 730 }; return db; }
function saveDB(db) { storage.save(db); }

function base64url(input) {
  return Buffer.from(input).toString('base64').replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
}
function signToken(payload, ttlSec = ACCESS_TTL) {
  const header = base64url(JSON.stringify({alg:'HS256',typ:'JWT'}));
  const body = base64url(JSON.stringify({...payload, iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000)+ttlSec}));
  const sig = crypto.createHmac('sha256', SECRET).update(header+'.'+body).digest('base64').replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  return `${header}.${body}.${sig}`;
}
function verifyToken(token) {
  try {
    const [h,b,s] = token.split('.');
    if (!h||!b||!s) return null;
    const expected = crypto.createHmac('sha256', SECRET).update(h+'.'+b).digest('base64').replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
    if (!crypto.timingSafeEqual(Buffer.from(s), Buffer.from(expected))) return null;
    const payload = JSON.parse(Buffer.from(b.replace(/-/g,'+').replace(/_/g,'/'), 'base64').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now()/1000)) return null;
    return payload;
  } catch { return null; }
}
// Password hashing: scrypt (memory-hard, Node.js built-in) with PBKDF2 fallback
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  // scrypt: memory-hard, resistant to GPU/ASIC attacks (Node.js built-in)
  const N = 16384; const r = 8; const p = 1; const keyLen = 64;
  const hash = crypto.scryptSync(String(password), salt, keyLen, { N, r, p, maxmem: 128 * N * r * 2 }).toString('hex');
  return `scrypt$${N}$${r}$${p}$${salt}$${hash}`;
}
function verifyPassword(password, stored) {
  if (!stored) return false;
  if (typeof stored === 'string' && stored.startsWith('scrypt$')) {
    const [, Nstr, rstr, pstr, salt, hash] = stored.split('$');
    try {
      const calc = crypto.scryptSync(String(password), salt, 64, { N: Number(Nstr), r: Number(rstr), p: Number(pstr), maxmem: 128 * Number(Nstr) * Number(rstr) * 2 }).toString('hex');
      return crypto.timingSafeEqual(Buffer.from(calc,'hex'), Buffer.from(hash,'hex'));
    } catch { return false; }
  }
  if (typeof stored === 'string' && stored.startsWith('pbkdf2$')) {
    const [, iterStr, salt, hash] = stored.split('$');
    const calc = crypto.pbkdf2Sync(String(password), salt, Number(iterStr), 32, 'sha256').toString('hex');
    try { return crypto.timingSafeEqual(Buffer.from(calc,'hex'), Buffer.from(hash,'hex')); } catch { return false; }
  }
  return String(password) === String(stored); // legacy prototype compatibility
}
function issueSession(db, user) {
  const refresh = crypto.randomBytes(24).toString('hex');
  const exp = Math.floor(Date.now()/1000) + REFRESH_TTL;
  db.sessions.push({ id: 'sess_'+Date.now()+'_'+Math.random().toString(36).slice(2,6), userId: user.id, refresh, exp, createdAt: new Date().toISOString() });
  if (db.sessions.length > 200) db.sessions = db.sessions.slice(-200);
  return { accessToken: signToken({ sub:user.id, role:user.role, portal:user.portal, scope:user.scope, name:user.name, typ:'access' }, ACCESS_TTL), refreshToken: refresh, expiresIn: ACCESS_TTL };
}

function send(res, code, data, headers={}) {
  const body = JSON.stringify(data);
  res.writeHead(code, {'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'Content-Type, Authorization','Access-Control-Allow-Methods':'GET,POST,PUT,OPTIONS', ...headers});
  res.end(body);
}
function parseBody(req) {
  return new Promise((resolve) => {
    let buf=''; req.on('data',c=>buf+=c); req.on('end',()=>{ try{ resolve(buf?JSON.parse(buf):{});}catch{resolve({});} });
  });
}
function getAuth(req) {
  const h = req.headers['authorization'] || '';
  if (!h.startsWith('Bearer ')) return null;
  return verifyToken(h.slice(7));
}
function audit(db, actor, action, entityType, entityId, details={}) {
  db.auditLogs.push({ id:'log_'+Date.now()+'_'+Math.random().toString(36).slice(2,6), actorId: actorId(actor), role: actor?.role||null, action, entityType, entityId, details, at: new Date().toISOString() });
  if (db.auditLogs.length > 500) db.auditLogs = db.auditLogs.slice(-500);
}

/** JWT payloads carry the user id in `sub`; older call sites used `actorId(auth)`. */
function actorId(auth) { return auth?.sub || auth?.id || null; }

function requireAuth(req, res) {
  const auth = getAuth(req);
  if (!auth) { send(res, 401, {error:'unauthorized', message:'رمز المصادقة مفقود أو غير صالح'}); return null; }
  return auth;
}
function requirePortal(auth, res, portal) {
  if (auth.portal !== portal) { send(res, 403, {error:'forbidden', message:'لا يسمح بالوصول: فصل البوابات (منصة الإدارة / حساب خاص)'}); return false; }
  return true;
}
function hasRole(auth, roles) { return roles.includes(auth.role); }

// Helpers
function studentById(db,id){ return db.students.find(s=>s.id===id); }
function classById(db,id){ return db.classes.find(c=>c.id===id); }
function levelById(db,id){ return db.levels.find(l=>l.id===id); }
function canTeacherAccessStudent(auth, db, studentId) {
  if (auth.role !== 'teacher') return false;
  const st = studentById(db, studentId); if (!st) return false;
  return (auth.scope?.classes||[]).includes(st.classId);
}
function canParentAccessStudent(auth, studentId) {
  return auth.role === 'parent' && (auth.scope?.children||[]).includes(studentId);
}

// ---- Moroccan primary grading subsystem helpers -------------------------
// The grading maths itself is pure and documented in ./grading. Everything
// below adapts it to DB records, teacher scoping and human-owned workflows.
function gradingPolicy(db) { return db.gradingPolicy || DEFAULT_GRADING_POLICY; }
function normalizeGradeCycle(entry) {
  return entry?.cycle || (entry?.term === 'الفصل 2' ? 'cycle2' : 'cycle1');
}
function gradeEntryView(db, entry) {
  const sub = (db.subjects || []).find((s) => s.id === entry.subjectId);
  const st = studentById(db, entry.studentId);
  return {
    ...entry,
    cycle: normalizeGradeCycle(entry),
    subjectName: sub?.name || entry.subjectId,
    studentName: st?.name || '',
  };
}
/** Derived values returned by teacher create/update (kept minimal by contract). */
function gradeDerived(entry, policy) {
  const subjectAverage = computeSubjectAverage(entry, policy);
  return { subjectAverage, mention: computeMention(subjectAverage, policy) };
}
/** Build the record consumed by computeStudentResult from stored entries.
 *  Drafts are ignored inside the pure function; submitted/approved are kept. */
function gradeRecordFor(db, studentId, cycle, policy) {
  const st = studentById(db, studentId);
  const entries = (db.gradeEntries || []).filter((e) => e.studentId === studentId
    && ['submitted', 'approved'].includes(e.status)
    && (!cycle || normalizeGradeCycle(e) === cycle));
  return {
    studentId,
    levelId: st?.levelId || null,
    levelName: levelName(db, st?.levelId),
    localExam: st?.localExam,
    regionalExam: st?.regionalExam,
    cycle1: entries.filter((e) => normalizeGradeCycle(e) === 'cycle1'),
    cycle2: entries.filter((e) => normalizeGradeCycle(e) === 'cycle2'),
  };
}

// ---- Two-way message threads (human-only, child/class-scoped, consent-aware) ----
// Shared enrichment for the parent / teacher / admin listings. Every listing is
// scoped to the caller and every write is an audited human action.
function messageThreadView(db, thread) {
  const st = studentById(db, thread.studentId);
  const linkedCase = (db.cases || []).find(c => c.id === thread.caseId);
  const card = (db.feedbackCards || []).find(c => c.id === thread.cardId);
  return {
    ...thread,
    studentName: st?.name || '',
    className: classById(db, st?.classId || thread.classId)?.name || '',
    caseFocus: linkedCase?.focus || '',
    cardSummary: card?.summary || '',
  };
}

// ---- Question bank & formative assessment helpers ----
function teacherLevelIds(auth, db) {
  const classIds = auth.scope?.classes || [];
  return [...new Set((db.classes || []).filter(c => classIds.includes(c.id)).map(c => c.levelId))];
}
function subjectName(db, id) { return (db.subjects || []).find(s => s.id === id)?.name || ''; }
function levelName(db, id) { return (db.levels || []).find(l => l.id === id)?.name || ''; }
function questionView(db, q) {
  return { ...q, subject: q.subject || subjectName(db, q.subjectId), level: q.level || levelName(db, q.levelId) };
}
function attemptsFor(db, assessmentId, studentId) {
  return (db.assessmentAttempts || []).filter(a => a.assessmentId === assessmentId && (!studentId || a.studentId === studentId));
}
function formativeView(db, f) {
  return {
    ...f,
    subject: f.subject || subjectName(db, f.subjectId),
    level: f.level || levelName(db, f.levelId),
    attemptsCount: attemptsFor(db, f.id).length,
  };
}
function normalizeQuestionOptions(options) {
  return Array.isArray(options)
    ? options.map(o => String(o).trim()).filter(Boolean).slice(0, 6)
    : [];
}

// ---- Interactive lesson content (student learning space) ----------------
// Published-only, scoped by the API layer. Correct answers never leave here:
// the question listing maps to safe fields only.
function lessonContentStatus(c) { return c.status || 'draft'; }
function lessonContentSummary(c) {
  return {
    id: c.id, lessonId: c.lessonId, curriculumId: c.curriculumId,
    levelId: c.levelId, subjectId: c.subjectId, subject: c.subject,
    title: c.title, intro: c.intro, duration: c.estimatedMinutes,
    difficulty: c.difficulty, prerequisites: c.prerequisites || [],
    hasQuiz: Array.isArray(c.quizQuestionIds) && c.quizQuestionIds.length > 0,
  };
}
function publishedLessonContentsForLevel(db, levelId) {
  return (db.lessonContents || []).filter(c => lessonContentStatus(c) === 'published' && c.levelId === levelId);
}
function findLessonContent(db, key) {
  return (db.lessonContents || []).find(c => c.lessonId === key || c.id === key);
}
/** Idempotent read marker: one row per (student, lesson). The first read time
 *  is kept as `at`/`readAt` so progress stays stable across repeated views. */
function ensureLessonContentView(db, studentId, lessonId) {
  db.lessonContentViews = db.lessonContentViews || [];
  let row = db.lessonContentViews.find(v => v.studentId === studentId && v.lessonId === lessonId);
  if (!row) {
    row = { studentId, lessonId, at: new Date().toISOString(), read: true };
    db.lessonContentViews.push(row);
  } else {
    row.read = true;
  }
  return row;
}
/** A submitted answer is only credited when it is an integer option index. */
function validAnswerIndex(value, optionCount) {
  if (Number.isInteger(value)) return value >= 0 && value < optionCount;
  if (typeof value === 'string' && /^\d+$/.test(value)) {
    const n = Number(value);
    return n >= 0 && n < optionCount;
  }
  return false;
}
/** Classical item analysis: difficulty = % correct, discrimination = top-third minus bottom-third. */
function itemAnalysis(db, formative) {
  const questions = (db.questionBank || []).filter(q => (formative.questionIds || []).includes(q.id));
  const attempts = attemptsFor(db, formative.id);
  const ranked = [...attempts].sort((a, b) => (b.score || 0) - (a.score || 0));
  const band = Math.max(1, Math.floor(ranked.length / 3));
  const top = ranked.slice(0, band);
  const bottom = ranked.slice(-band);
  const isRight = (attempt, question) => attempt.answers && attempt.answers[question.id] !== undefined
    && Number(attempt.answers[question.id]) === Number(question.correctIndex);
  return questions.map(q => {
    const answered = attempts.filter(a => a.answers && a.answers[q.id] !== undefined);
    const correct = answered.filter(a => isRight(a, q)).length;
    const difficultyPct = answered.length ? Math.round((correct / answered.length) * 100) : 0;
    const topPct = top.length ? top.filter(a => isRight(a, q)).length / top.length : 0;
    const bottomPct = bottom.length ? bottom.filter(a => isRight(a, q)).length / bottom.length : 0;
    return {
      questionId: q.id, prompt: q.prompt, attempts: answered.length, correct,
      difficultyPct, discriminationPct: Math.round((topPct - bottomPct) * 100),
    };
  });
}

// ---- Prototype gap helpers: create/state-machine/bulk validation ----
function isNonEmptyString(value) { return typeof value === 'string' && value.trim().length > 0; }

// Feedback-card state machine. Teacher can only (re)propose; approve/reject and
// in_progress/completed are admin-only. Terminal states cannot be reopened.
const FEEDBACK_TRANSITIONS = {
  proposed: ['proposed', 'approved', 'rejected', 'in_progress'],
  approved: ['in_progress', 'rejected'],
  rejected: ['rejected'],
  in_progress: ['completed', 'rejected'],
  completed: ['completed']
};
const FEEDBACK_ADMIN_ROLES = ['director', 'deputy', 'supervisor', 'admin'];
function feedbackTransitionAllowed(auth, from, to) {
  if (to === undefined || to === from) return true; // field-only update or no-op
  if (!(FEEDBACK_TRANSITIONS[from] || []).includes(to)) return false;
  if (to === 'proposed') return auth.role === 'teacher' || hasRole(auth, FEEDBACK_ADMIN_ROLES);
  return hasRole(auth, FEEDBACK_ADMIN_ROLES);
}

// Atomic bulk writes: report every failing row with its index before any write.
function bulkValidationFailed(res, total, rows) {
  const errors = rows.filter(r => !r.ok);
  send(res, 400, {
    error: 'validation_failed',
    message: 'One or more rows failed validation; no rows were written.',
    total,
    results: rows,
    errors
  });
}

// ---- Intervention plans: human-authored, measurable, reviewed weekly ----
// Early-warning output is advisory input context only. Plan goals, actions and
// review notes always come from a person; nothing here is auto-decided.
const INTERVENTION_STATUSES = ['active', 'reviewed', 'closed'];
const INTERVENTION_INDICATORS = ['attendance', 'homework', 'mood', 'practice', 'engagement'];

function isValidDateValue(value) {
  return typeof value === 'string' && value.trim().length > 0 && !Number.isNaN(Date.parse(value));
}
/** One consistent week rule: Monday (UTC) of the review week, as YYYY-MM-DD. */
function interventionWeekStart(date = new Date()) {
  const d = new Date(date);
  const daysSinceMonday = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - daysSinceMonday);
  return d.toISOString().slice(0, 10);
}
function interventionPlanView(db, plan) {
  const st = studentById(db, plan.studentId);
  return {
    ...plan,
    studentName: st?.name || '',
    className: classById(db, st?.classId)?.name || ''
  };
}
function openInterventionPlan(db, studentId) {
  return (db.interventionPlans || []).find(p => p.studentId === studentId && (p.status === 'active' || p.status === 'reviewed')) || null;
}

function computeImpact(db) {
  const today = new Date().toISOString().slice(0,10);
  const reassessmentDue = [];
  (db.learningPaths||[]).forEach(p=>{ if (p.reassessDate && p.reassessDate <= today) reassessmentDue.push({type:'learning_path', studentId:p.studentId, due:p.reassessDate}); });
  (db.feedbackCards||[]).forEach(f=>{ if (f.nextReview && f.nextReview <= today && !['completed','rejected'].includes(f.status)) reassessmentDue.push({type:'feedback_card', id:f.id, studentId:f.studentId, due:f.nextReview}); });
  return {
    feedbackCards: { total:(db.feedbackCards||[]).length, approved:(db.feedbackCards||[]).filter(f=>f.status==='approved').length, inProgress:(db.feedbackCards||[]).filter(f=>f.status==='in_progress').length, completed:(db.feedbackCards||[]).filter(f=>f.status==='completed').length },
    impactLog: db.impactLog||[],
    reassessmentDue,
    outreach: { activities:(db.activities||[]).filter(a=>a.outreach).length, publications:(db.publications||[]).length }
  };
}

function computeStudentReport(db, studentId) {
  const st = studentById(db, studentId); if (!st) return null;
  const cls = classById(db, st.classId); const lvl = levelById(db, st.levelId);
  const att = db.attendance.filter(a=>a.studentId===studentId);
  const present = att.filter(a=>a.status==='present').length;
  const rate = att.length ? Math.round((present/att.length)*100) : 0;
  const grades = db.grades.filter(g=>g.studentId===studentId).map(g=>{
    const sub = db.subjects.find(s=>s.id===g.subjectId);
    return { subject: sub?.name||g.subjectId, score: g.score, scale: g.scale, term: g.term };
  });
  const asg = db.assignments.filter(a=>a.classId===st.classId).map(a=>{
    const sub = db.subjects.find(s=>s.id===a.subjectId);
    const subm = db.submissions.find(s=>s.assignmentId===a.id && s.studentId===studentId);
    return { id:a.id, title:a.title, subject: sub?.name, dueDate:a.dueDate, status: subm?.status||'not_submitted', grade: subm?.grade??null, feedback: subm?.feedback??null };
  });
  const avg = grades.length ? (grades.reduce((s,g)=>s+g.score,0)/grades.length).toFixed(1) : null;
  const weak = grades.filter(g=>g.score < 12).map(g=>g.subject);
  return {
    student: {id: st.id, name: st.name},
    level: lvl?.name, class: cls?.name,
    attendance: { total: att.length, present, rate },
    grades, average: avg, assignments: asg,
    guidance: weak.length ? [`مراجعة إضافية في: ${weak.join('، ')}`, 'تنسيق أسبوعي بين ولي الأمر والمعلم'] : ['الاستمرار على نفس الوتيرة', 'تعزيز نقاط القوة بأنشطة إضافية'],
    privacy: 'تمت تصفية البيانات حسب النطاق والصلاحية'
  };
}

function computeStudentInsights(db, studentId) {
  const base = computeStudentReport(db, studentId);
  if (!base) return null;
  const comps = (db.competencies||[]).filter(c=>c.studentId===studentId).map(c=>{
    const sub = db.subjects.find(s=>s.id===c.subjectId);
    return {...c, subject: sub?.name||c.subjectId};
  });
  const gaps = comps.filter(c=>c.status==='gap' || c.status==='needs_support' || c.mastery < 0.5);
  const strengths = comps.filter(c=>c.mastery >= 0.75);
  const talents = (db.talents||[]).filter(t=>t.studentId===studentId);
  // Enhanced recommendation scoring: combine mastery gap, assessment recency, and talent signals
  const assess = (db.assessments||[]).filter(a=>a.studentId===studentId);
  const recentAssess = assess.filter(a=>a.date && new Date(a.date).getTime() > Date.now() - 30*24*60*60*1000);
  const lowAssess = assess.filter(a=> (a.score||0) < 0.5);
  const recommendationScore = Math.min(1, (gaps.length*0.3 + lowAssess.length*0.2 + (talents.length?0.2:0) + (recentAssess.length>0?0.1:0)));
  const path = (db.learningPaths||[]).find(p=>p.studentId===studentId) || null;
  const intervention = (db.interventions||[]).filter(i=>i.studentId===studentId);
  const alerts = (db.alerts||[]).filter(a=>a.studentId===studentId);
  const evidence = (db.evidence||[]).filter(e=>e.studentId===studentId);
  const agentRuns = (db.agentRuns||[]).filter(r=>r.target===studentId);
  const feedbackCards = (db.feedbackCards||[]).filter(c=>c.studentId===studentId);
  const caseFile = (db.cases||[]).find(c=>c.studentId===studentId) || null;
  const competencyRefs = (db.competencyReferences||[]).filter(r=>!base?.level || r.level===base.level);
  const competenciesAligned = comps.map(c=>{
    const ref = competencyRefs.find(r=>r.skill===c.skill && r.subject===c.subject);
    return {...c, targetMastery: ref?.targetMastery ?? 0.7, indicators: ref?.indicators||[], description: ref?.description||''};
  });
  const recommendedActivities = (db.activities||[]).filter(act=>{
    if (gaps.length) return true;
    if (talents.length) return ['gifted_interested','interested','all'].includes(act.audience) || act.outreach;
    return act.audience==='all' || act.outreach;
  });
  const exercises = [];
  gaps.forEach(g=>exercises.push({skill:g.skill, subject:g.subject, exercise:`تمارين تدريجية موجهة في ${g.skill} (${g.subject})`, frequency:'يومي/أسبوعي حسب الخطة'}));
  strengths.forEach(s=>exercises.push({skill:s.skill, subject:s.subject, exercise:`تحدي إثرائي متقدم في ${s.skill}`, frequency:'أسبوعي'}));
  const classification = gaps.length ? (talents.length ? 'يحتاج دعم مع مواهب قابلة للتنمية' : 'يحتاج دعم/سد فجوات') : (talents.length ? 'موهوب/متميز مع مسار إثرائي' : 'مسار عادي مع متابعة');
  const summaryReport = {
    headline: classification,
    keyPoints: [
      gaps.length ? `فجوات: ${gaps.map(g=>g.skill).join('، ')}` : 'لا فجوات حرجة مرصودة',
      strengths.length ? `نقاط قوة: ${strengths.map(s=>s.skill).join('، ')}` : 'قوة قيد البناء',
      path ? `إعادة تقييم: ${path.reassessDate}` : 'تحديد موعد إعادة تقييم'
    ],
    nextActions: (path?.nextSteps||[]).slice(0,3)
  };
  const detailedReport = {
    competencies: competenciesAligned, gaps, strengths, talents, path, interventions: intervention, alerts, evidence, agentRuns, feedbackCards, caseFile,
    suggestedExercises: exercises, recommendedActivities, competencyRefs,
    recommendationScore: Math.round(recommendationScore*100)/100,
    assessmentSummary: { total: assess.length, recent: recentAssess.length, belowThreshold: lowAssess.length },
    methodology: 'تحليل متعدد المؤشرات (كفايات + تقييمات + مواهب + حضور) وفق نموذج كفايات مرجعي + مخرجات وكلاء متخصصين مساندين مع أدلة قابلة للمراجعة'
  };
  return {
    ...base,
    competencies: competenciesAligned,
    competencyRefs,
    gaps, strengths, talents, learningPath: path, interventions: intervention, alerts,
    recommendedActivities, suggestedExercises: exercises,
    classification,
    evidence, agentRuns, feedbackCards, caseFile,
    summaryReport, detailedReport,
    feedback: [
      gaps.length ? 'تم رصد فجوات/صعوبات تستوجب خطة دعم مبكرة وإعادة تقييم.' : 'لا توجد فجوات حرجة مرصودة حاليًا.',
      talents.length ? 'تم رصد مؤشرات موهبة/تميز تستوجب مسارًا إثرائيًا وأنشطة إشعاعية مناسبة.' : 'يمكن استكشاف المواهب عبر أنشطة موازية متنوعة.',
      'التوصيات وبطاقات التغذية الراجعة مبنية على أدلة ونموذج كفايات مرجعي وتتطلب مراجعة واعتماد بشري.'
    ]
  };
}

// ---------------------------------------------------------------------------
// Curriculum terms, libraries and term report cards
// ---------------------------------------------------------------------------
const TERMS = ['الفصل 1', 'الفصل 2', 'الفصل 3'];

function termOfDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const month = date.getUTCMonth() + 1;
  if (month >= 9) return 'الفصل 1';
  if (month <= 3) return 'الفصل 2';
  if (month <= 6) return 'الفصل 3';
  return 'الفصل 1';
}

// ---------------------------------------------------------------------------
// Weekly school timetable: classroom schedule with attendance/homework links.
// Classroom attendance stays separate from platform time and learning progress.
// ---------------------------------------------------------------------------
const TIMETABLE_DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
const TIMETABLE_PERIODS = [
  { period: 1, time: '08:30–09:15' },
  { period: 2, time: '09:15–10:00' },
  { period: 3, time: '10:00–10:45' },
  { period: 4, time: '10:45–11:30' },
  { period: 5, time: '11:30–12:15' },
  { period: 6, time: '12:15–13:00' },
];

function timetableTime(period) {
  return TIMETABLE_PERIODS.find(p => p.period === Number(period))?.time || '';
}

/** Attendance for a timetable link: classroom rows only, never ML/advisory data. */
function timetableAttendance(db, view, classId, studentId) {
  const rows = (db.attendance || []).filter(a => view === 'student' ? a.studentId === studentId : a.classId === classId);
  const present = rows.filter(a => a.status === 'present').length;
  const late = rows.filter(a => a.status === 'late').length;
  const absent = rows.filter(a => a.status === 'absent').length;
  return {
    view,
    total: rows.length,
    present,
    late,
    absent,
    rate: rows.length ? Math.round((present / rows.length) * 100) / 100 : 0,
  };
}

function timetableAssignments(db, slot, view, studentId) {
  return (db.assignments || [])
    .filter(a => a.classId === slot.classId && a.subjectId === slot.subjectId)
    .slice(0, 5)
    .map(a => {
      const submission = view === 'student'
        ? (db.submissions || []).find(s => s.assignmentId === a.id && s.studentId === studentId)
        : null;
      return {
        id: a.id,
        title: a.title,
        dueDate: a.dueDate,
        status: a.status,
        submissionStatus: view === 'student' ? (submission?.status || '') : '',
      };
    });
}

/** Single enrichment helper used by every timetable GET and POST response. */
function timetableView(db, slot, options = {}) {
  const view = options.view === 'student' ? 'student' : 'class';
  const studentId = options.studentId || '';
  const cls = classById(db, slot.classId);
  const teacher = slot.teacherId ? ((db.users || []).find(u => u.id === slot.teacherId)?.name || '') : '';
  return {
    id: slot.id,
    classId: slot.classId,
    className: cls?.name || '',
    levelId: cls?.levelId || '',
    levelName: levelName(db, cls?.levelId),
    day: slot.day,
    period: Number(slot.period),
    time: timetableTime(slot.period),
    subjectId: slot.subjectId,
    subject: subjectName(db, slot.subjectId),
    teacherId: slot.teacherId || '',
    teacher,
    room: slot.room || '',
    term: slot.term || TERMS[0],
    links: {
      attendance: timetableAttendance(db, view, slot.classId, studentId),
      assignments: timetableAssignments(db, slot, view, studentId),
    },
  };
}

function timetableMeta(db, scope, classes) {
  return {
    days: TIMETABLE_DAYS.slice(),
    periods: TIMETABLE_PERIODS.map(p => ({ ...p })),
    classes: (classes || []).map(c => ({ id: c.id, name: c.name })),
    // Exposed so the admin "add lesson" form can offer a labelled subject
    // picker instead of asking staff to type a raw subject id.
    subjects: (db.subjects || []).map(s => ({ id: s.id, name: s.name })),
    scope,
  };
}

/** Validate create/patch fields. Returns { field } on failure or { value } on success. */
function validateTimetableFields(db, body, partial = false) {
  const value = {};
  for (const field of ['classId', 'day', 'period', 'subjectId']) {
    if (!partial && body[field] === undefined) return { field };
  }
  if (body.classId !== undefined) {
    if (!isNonEmptyString(body.classId) || !classById(db, body.classId)) return { field: 'classId' };
    value.classId = body.classId;
  }
  if (body.subjectId !== undefined) {
    if (!isNonEmptyString(body.subjectId) || !(db.subjects || []).some(s => s.id === body.subjectId)) return { field: 'subjectId' };
    value.subjectId = body.subjectId;
  }
  if (body.day !== undefined) {
    if (!TIMETABLE_DAYS.includes(body.day)) return { field: 'day' };
    value.day = body.day;
  }
  if (body.period !== undefined) {
    if (typeof body.period !== 'number' || !Number.isInteger(body.period) || body.period < 1 || body.period > 6) return { field: 'period' };
    value.period = body.period;
  }
  if (body.teacherId !== undefined) {
    if (typeof body.teacherId !== 'string') return { field: 'teacherId' };
    value.teacherId = body.teacherId;
  }
  if (body.room !== undefined) {
    if (typeof body.room !== 'string') return { field: 'room' };
    value.room = body.room;
  }
  if (body.term !== undefined) {
    if (!TERMS.includes(body.term)) return { field: 'term' };
    value.term = body.term;
  }
  return { value };
}

function curriculumList(db, filters = {}) {
  const { levelId, term, subjectId } = filters;
  return (db.curriculum || [])
    .filter((item) => !levelId || item.levelId === levelId)
    .filter((item) => !term || (item.term || 'الفصل 1') === term)
    .filter((item) => !subjectId || item.subjectId === subjectId)
    .map((item) => ({
      ...item,
      term: item.term || 'الفصل 1',
      level: levelById(db, item.levelId)?.name,
      subject: db.subjects.find((subject) => subject.id === item.subjectId)?.name,
    }));
}

// ---------------------------------------------------------------------------
// Structured lesson editor: plans layered on top of curriculum units.
// Human-authored, scope-aware and audited; publication is an admin-only review
// step so a teacher can never publish their own plan.
// ---------------------------------------------------------------------------
const LESSON_PLAN_STATUSES = ['draft', 'in_review', 'published'];
const LESSON_ACTIVITY_TYPES = ['practice', 'exploration', 'assessment', 'game'];
const LESSON_DIFFERENTIATION_GROUPS = ['support', 'enrichment', 'all'];
const LESSON_RESOURCE_TYPES = ['link', 'file', 'library', 'material'];

function lessonPlanId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
function lessonPlanView(db, plan) {
  return { ...plan, levelName: levelName(db, plan.levelId), subjectName: subjectName(db, plan.subjectId) };
}
function csvCell(value) {
  return `"${(value === null || value === undefined ? '' : String(value)).replace(/"/g, '""')}"`;
}
/** Validate create fields or, with partial=true, only the fields present in the patch. */
function validateLessonPlanFields(body, partial = false) {
  const value = {};
  if (!partial || body.lessonTitle !== undefined) {
    if (!isNonEmptyString(body.lessonTitle)) return { field: 'lessonTitle' };
    value.lessonTitle = body.lessonTitle.trim();
  }
  if (!partial || body.term !== undefined) {
    if (!TERMS.includes(body.term)) return { field: 'term' };
    value.term = body.term;
  }
  if (!partial || body.objectives !== undefined) {
    if (!Array.isArray(body.objectives)) return { field: 'objectives' };
    const objectives = body.objectives.filter(isNonEmptyString).map((o) => o.trim());
    if (objectives.length < 1) return { field: 'objectives' };
    value.objectives = objectives;
  }
  if (!partial || body.activities !== undefined) {
    if (!Array.isArray(body.activities)) return { field: 'activities' };
    const activities = [];
    for (const a of body.activities) {
      if (!a || typeof a !== 'object' || Array.isArray(a) || !isNonEmptyString(a.title)
        || !LESSON_ACTIVITY_TYPES.includes(a.type)
        || typeof a.durationMinutes !== 'number' || !Number.isFinite(a.durationMinutes) || a.durationMinutes <= 0) {
        return { field: 'activities' };
      }
      activities.push({
        id: isNonEmptyString(a.id) ? a.id : lessonPlanId('act'),
        title: a.title.trim(),
        type: a.type,
        description: isNonEmptyString(a.description) ? a.description.trim() : '',
        durationMinutes: a.durationMinutes,
      });
    }
    value.activities = activities;
  }
  if (!partial || body.differentiation !== undefined) {
    if (!Array.isArray(body.differentiation)) return { field: 'differentiation' };
    const differentiation = [];
    for (const d of body.differentiation) {
      if (!d || typeof d !== 'object' || Array.isArray(d)
        || !LESSON_DIFFERENTIATION_GROUPS.includes(d.group)
        || !isNonEmptyString(d.need) || !isNonEmptyString(d.strategy)) {
        return { field: 'differentiation' };
      }
      differentiation.push({
        id: isNonEmptyString(d.id) ? d.id : lessonPlanId('diff'),
        group: d.group,
        need: d.need.trim(),
        strategy: d.strategy.trim(),
      });
    }
    value.differentiation = differentiation;
  }
  if (!partial || body.resources !== undefined) {
    if (!Array.isArray(body.resources)) return { field: 'resources' };
    const resources = [];
    for (const r of body.resources) {
      if (!r || typeof r !== 'object' || Array.isArray(r) || !isNonEmptyString(r.title)
        || !LESSON_RESOURCE_TYPES.includes(r.type) || !isNonEmptyString(r.reference)) {
        return { field: 'resources' };
      }
      resources.push({
        id: isNonEmptyString(r.id) ? r.id : lessonPlanId('res'),
        title: r.title.trim(),
        type: r.type,
        reference: r.reference.trim(),
      });
    }
    value.resources = resources;
  }
  if (body.competencyIds !== undefined) {
    if (!Array.isArray(body.competencyIds) || !body.competencyIds.every((id) => typeof id === 'string')) {
      return { field: 'competencyIds' };
    }
    value.competencyIds = body.competencyIds.slice();
  }
  return { value };
}
function lessonPlansFiltered(db, filters = {}) {
  const { levelId, subjectId, term, status } = filters;
  return (db.lessonPlans || [])
    .filter((p) => !levelId || p.levelId === levelId)
    .filter((p) => !subjectId || p.subjectId === subjectId)
    .filter((p) => !term || p.term === term)
    .filter((p) => !status || p.status === status)
    .map((p) => lessonPlanView(db, p));
}
function lessonPlanCsv(db, plans) {
  const header = ['id', 'level', 'subject', 'unit', 'lesson', 'term', 'status', 'objectives', 'activities', 'differentiation', 'resources'];
  const lines = [header.join(',')];
  for (const p of plans) {
    lines.push([
      p.id, p.levelName || p.levelId, p.subjectName || p.subjectId, p.unit || '',
      p.lessonTitle || '', p.term || '', p.status || '',
      (p.objectives || []).join(' | '),
      (p.activities || []).map((a) => `${a.title}(${a.type},${a.durationMinutes})`).join(' | '),
      (p.differentiation || []).map((d) => `${d.group}: ${d.need} → ${d.strategy}`).join(' | '),
      (p.resources || []).map((r) => `${r.title} [${r.type}] ${r.reference}`).join(' | '),
    ].map(csvCell).join(','));
  }
  return lines.join('\r\n') + '\r\n';
}

function libraryForLevel(db, levelId, term, publishedOnly = false) {
  const items = curriculumList(db, { levelId, term }).filter((item) => !publishedOnly || item.status === 'published');
  const grouped = new Map();
  for (const item of items) {
    const key = item.subjectId || 'other';
    const group = grouped.get(key) || {
      subjectId: key,
      subject: item.subject || key,
      units: 0,
      lessons: 0,
      items: [],
    };
    group.units += 1;
    group.lessons += (item.lessons || []).length;
    group.items.push({ id: item.id, unit: item.unit, lessons: item.lessons || [], status: item.status, term: item.term });
    grouped.set(key, group);
  }
  return {
    level: levelById(db, levelId)?.name,
    term,
    terms: TERMS,
    subjects: [...grouped.values()].sort((a, b) => a.subject.localeCompare(b.subject, 'ar')),
    pedagogic: db.library || [],
  };
}

function computeReportCard(db, studentId, term) {
  const st = studentById(db, studentId);
  if (!st) return null;
  const selected = TERMS.includes(term) ? term : TERMS[0];
  const cls = classById(db, st.classId);
  const lvl = levelById(db, st.levelId);
  const grades = (db.grades || []).filter((grade) => grade.studentId === studentId && (!grade.term || grade.term === selected));
  const competencies = (db.competencies || []).filter((row) => row.studentId === studentId);
  const subjectMap = new Map();
  const subjectName = (id) => db.subjects.find((subject) => subject.id === id)?.name || id;
  for (const grade of grades) {
    const name = subjectName(grade.subjectId);
    const row = subjectMap.get(name) || { subject: name, score: null, scale: 20, competencyMastery: null, status: 'unknown' };
    row.score = grade.score;
    row.scale = grade.scale || 20;
    subjectMap.set(name, row);
  }
  for (const competency of competencies) {
    const name = subjectName(competency.subjectId);
    const row = subjectMap.get(name) || { subject: name, score: null, scale: 20, competencyMastery: null, status: 'unknown' };
    const mastery = Number(competency.mastery) || 0;
    row.competencyMastery = row.competencyMastery === null ? mastery : (row.competencyMastery + mastery) / 2;
    row.status = competency.status === 'mastered' || mastery >= 0.75 ? 'mastered'
      : (competency.status === 'gap' || mastery < 0.5 ? 'gap' : 'in_progress');
    subjectMap.set(name, row);
  }
  const subjects = [...subjectMap.values()]
    .map((row) => ({
      ...row,
      competencyMastery: row.competencyMastery === null ? null : Math.round(row.competencyMastery * 100) / 100,
    }))
    .sort((a, b) => a.subject.localeCompare(b.subject, 'ar'));
  const scored = grades.filter((grade) => Number.isFinite(Number(grade.score)));
  const average = scored.length
    ? Math.round((scored.reduce((sum, grade) => sum + Number(grade.score), 0) / scored.length) * 10) / 10
    : null;
  const attendance = (db.attendance || []).filter((row) => row.studentId === studentId && (!row.date || termOfDate(row.date) === selected));
  const present = attendance.filter((row) => row.status === 'present').length;
  const late = attendance.filter((row) => row.status === 'late').length;
  const absent = attendance.filter((row) => row.status === 'absent' || row.status === 'excused').length;
  const engagement = engagementSummary(db, studentId);
  const lessons = lessonProgressSummary(db, studentId);
  const assignments = studentAssignments(db, studentId);
  const done = assignments.filter((row) => row.status === 'submitted' || row.status === 'graded').length;
  const comments = (db.feedbackCards || [])
    .filter((card) => card.studentId === studentId && card.status === 'approved' && (!card.term || card.term === selected))
    .slice(-3)
    .map((card) => ({ summary: card.summary, agent: card.agent, at: card.date || null }));
  return {
    student: { id: st.id, name: st.name, level: lvl?.name || null, class: cls?.name || null },
    term: selected,
    terms: TERMS,
    subjects,
    average,
    attendance: {
      rate: attendance.length ? Math.round(((present + late) / attendance.length) * 100) : null,
      present, absent, late, total: attendance.length,
    },
    engagement,
    lessons: { completed: lessons.completed, totalXp: lessons.totalXp },
    assignments: { done, total: assignments.length },
    comments,
    note: 'بطاقة استرشادية تجمع الدرجات والكفايات والحضور وزمن المنصة؛ لا تُعتمد رسميًا إلا بعد مراجعة المعلّم.',
    advisory: true,
  };
}

// ---------------------------------------------------------------------------
// Parallel learning space (separate from classroom attendance)
// ---------------------------------------------------------------------------
function engagementSummary(db, studentId) {
  const events = (db.studentEngagement || []).filter((e) => e.studentId === studentId);
  const today = new Date().toISOString().slice(0, 10);
  const byDay = new Map();
  const bySubject = new Map();
  let totalSeconds = 0;
  for (const event of events) {
    const seconds = Math.max(0, Number(event.seconds) || 0);
    const day = String(event.at || '').slice(0, 10);
    if (day) byDay.set(day, (byDay.get(day) || 0) + seconds);
    const key = event.subject || event.subjectId || 'general';
    bySubject.set(key, (bySubject.get(key) || 0) + seconds);
    totalSeconds += seconds;
  }
  const days = [...byDay.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  let streak = 0;
  let cursor = new Date(`${today}T00:00:00Z`);
  for (let i = days.length - 1; i >= 0; i -= 1) {
    const day = days[i][0];
    if (day === cursor.toISOString().slice(0, 10)) {
      streak += 1;
      cursor = new Date(cursor.getTime() - 86400000);
    } else if (i === days.length - 1 && day === new Date(cursor.getTime() - 86400000).toISOString().slice(0, 10)) {
      streak += 1;
      cursor = new Date(cursor.getTime() - 86400000);
    } else {
      break;
    }
  }
  return {
    totalMinutes: Math.round(totalSeconds / 60),
    todayMinutes: Math.round((byDay.get(today) || 0) / 60),
    streakDays: streak,
    sessions: days.length,
    lastActive: events.length ? events[events.length - 1].at : null,
    bySubjectMinutes: Object.fromEntries([...bySubject.entries()].map(([k, v]) => [k, Math.round(v / 60)])),
    dailyMinutes: days.map(([date, seconds]) => ({ date, minutes: Math.round(seconds / 60) })),
    note: 'زمن المنصة مُقاس داخل الفضاء الموازي فقط، ومنفصل عن حضور القسم.',
  };
}

// Family approval & privacy center helpers (advisory only: the parent decides).
function parentRequestView(db, row) {
  return {
    id: row.id,
    studentId: row.studentId,
    studentName: studentById(db, row.studentId)?.name || '',
    type: row.type,
    entityType: row.entityType,
    entityId: row.entityId,
    title: row.title,
    summary: row.summary,
    status: row.status,
    requestedAt: row.requestedAt,
    decidedAt: row.decidedAt ?? null,
    decidedBy: row.decidedBy ?? null,
    decisionNote: row.decisionNote ?? '',
    advisory: row.advisory !== false,
  };
}

// Last 7 calendar days (today back 6), computed in UTC so ISO date strings
// compare cleanly. All sub-summaries default to zero/empty when data is absent.
function weeklySummaryFor(db, studentId) {
  const todayDate = new Date();
  const today = new Date(Date.UTC(todayDate.getUTCFullYear(), todayDate.getUTCMonth(), todayDate.getUTCDate()));
  const start = new Date(today.getTime() - 6 * 86400000);
  const startDay = start.toISOString().slice(0, 10);
  const endDay = today.toISOString().slice(0, 10);
  const inWindow = (value) => {
    const day = String(value || '').slice(0, 10);
    return day >= startDay && day <= endDay;
  };
  const st = studentById(db, studentId);

  // Classroom attendance — a source distinct from platform time.
  const attendanceRows = (db.attendance || []).filter((a) => a.studentId === studentId && inWindow(a.date));
  let present = 0;
  let late = 0;
  let absent = 0;
  for (const row of attendanceRows) {
    if (row.status === 'present') present += 1;
    else if (row.status === 'late') late += 1;
    else if (row.status === 'absent') absent += 1;
  }
  const total = attendanceRows.length;
  const attendance = {
    present,
    late,
    absent,
    total,
    percent: total ? Math.round((present / total) * 100) : 0,
    note: 'هذا حضور القسم داخل الفصل، وهو مصدر منفصل تمامًا عن زمن المنصة الموازية.',
  };

  // Optional parallel learning space — never mixed with classroom attendance.
  const engagementRows = (db.studentEngagement || []).filter((e) => e.studentId === studentId && inWindow(e.at));
  let seconds = 0;
  const bySubject = new Map();
  const activeDays = new Set();
  for (const event of engagementRows) {
    const value = Math.max(0, Number(event.seconds) || 0);
    seconds += value;
    const key = event.subject || event.subjectId || 'عام';
    bySubject.set(key, (bySubject.get(key) || 0) + value);
    if (event.at) activeDays.add(String(event.at).slice(0, 10));
  }
  const engagement = {
    minutes: Math.round(seconds / 60),
    sessions: activeDays.size,
    subjects: [...bySubject.entries()]
      .map(([name, value]) => ({ name, minutes: Math.round(value / 60) }))
      .sort((a, b) => b.minutes - a.minutes),
    note: 'هذا زمن تعلّم اختياري في الفضاء الموازي، منفصل عن حضور القسم.',
  };

  // Homework due this week for the child's class.
  const assignmentRows = (db.assignments || [])
    .filter((a) => a.classId === st?.classId && inWindow(a.dueDate))
    .map((a) => {
      const submission = (db.submissions || []).find((s) => s.assignmentId === a.id && s.studentId === studentId);
      return { id: a.id, title: a.title, dueDate: a.dueDate || null, status: submission?.status || 'not_submitted' };
    });
  const assignments = {
    due: assignmentRows.length,
    submitted: assignmentRows.filter((a) => a.status === 'submitted').length,
    overdue: assignmentRows.filter((a) => a.status !== 'submitted' && a.dueDate && a.dueDate < endDay).length,
    items: assignmentRows,
  };

  // Formative practice attempts — score is stored as a fraction (0..1).
  const attempts = (db.assessmentAttempts || []).filter((a) => a.studentId === studentId && inWindow(a.completedAt));
  const rawAverage = attempts.length
    ? attempts.reduce((sum, a) => sum + Math.max(0, Math.min(1, Number(a.score) || 0)) * 100, 0) / attempts.length
    : 0;
  const assessment = {
    attempts: attempts.length,
    averageScore: Math.round(rawAverage),
    note: 'محاولات التقييم التكويني تدريب استرشادي ولا تُدرج أبدًا في بطاقة التقرير.',
  };

  const highlights = [
    `حضور القسم ${attendance.percent}% هذا الأسبوع (${present} من ${total} يومًا مسجّلًا).`,
    `زمن المنصة ${engagement.minutes} دقيقة خلال ${engagement.sessions} جلسة.`,
    `الواجبات المسلّمة ${assignments.submitted} من ${assignments.due} هذا الأسبوع.`,
  ];
  if (assessment.attempts) highlights.push(`متوسط محاولات التدريب ${assessment.averageScore}%.`);

  return {
    student: {
      id: studentId,
      name: st?.name || '',
      level: levelById(db, st?.levelId)?.name || '',
      class: classById(db, st?.classId)?.name || '',
    },
    week: { start: startDay, end: endDay },
    classroomAttendance: attendance,
    platformTime: engagement,
    homework: assignments,
    practice: assessment,
    highlights: highlights.slice(0, 4),
    conversationStarters: [
      'ما النشاط الذي استمتعت به أكثر هذا الأسبوع؟',
      'كيف ساعدتك تمارين المنصة في واجباتك؟',
      'هل نراجع معًا ما تعلّمته هذا الأسبوع؟',
    ],
    privacy: 'البيانات مقتصرة على هذا الطفل وحده وذات طابع استرشادي فقط.',
    advisory: true,
  };
}

function studentAssignments(db, studentId) {
  const student = studentById(db, studentId);
  if (!student) return [];
  return (db.assignments || [])
    .filter((item) => item.classId === student.classId)
    .map((item) => {
      const submission = (db.submissions || []).find((s) => s.assignmentId === item.id && s.studentId === studentId);
      const subject = (db.subjects || []).find((s) => s.id === item.subjectId);
      return {
        id: item.id,
        title: item.title,
        subject: subject?.name || item.subjectId,
        dueDate: item.dueDate || null,
        assignmentStatus: item.status || 'open',
        status: submission?.status || 'not_submitted',
        grade: submission?.grade ?? null,
        feedback: submission?.feedback || null,
        submittedAt: submission?.submittedAt || null,
      };
    });
}

function lessonProgressSummary(db, studentId) {
  const rows = (db.lessonProgress || []).filter((row) => row.studentId === studentId);
  return {
    completed: rows.filter((row) => row.completed).length,
    totalXp: rows.reduce((sum, row) => sum + (Number(row.xp) || 0), 0),
    averageScore: rows.length
      ? Math.round((rows.reduce((sum, row) => sum + (Number(row.score) || 0), 0) / rows.length) * 100) / 100
      : 0,
    rows,
  };
}

async function handleRequest(req, res) {
  // Security headers
  setSecurityHeaders(res);
  // Rate limiting
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const rl = checkRateLimit(ip);
  res.setHeader('X-RateLimit-Limit', String(RATE_LIMIT_MAX));
  res.setHeader('X-RateLimit-Remaining', String(rl.remaining));
  if (!rl.allowed) {
    res.setHeader('Retry-After', String(rl.retryAfter));
    send(res, 429, { error: 'rate_limited', message: 'تم تجاوز حد الطلبات. حاول لاحقًا.', retryAfter: rl.retryAfter });
    return;
  }
  if (req.method === 'OPTIONS') { send(res, 204, {}); return; }
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  // Static files (serve frontend)
  if (req.method === 'GET' && !pathname.startsWith('/api')) {
    let filePath = pathname === '/' ? path.join(__dirname, '..', 'index.html') : path.join(__dirname, '..', pathname);
    if (!filePath.startsWith(path.join(__dirname, '..'))) { send(res,403,{error:'forbidden'}); return; }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const types = {'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json','.png':'image/png'};
      const data = fs.readFileSync(filePath);
      res.writeHead(200, {'Content-Type': types[ext] || 'application/octet-stream'});
      res.end(data); return;
    }
  }

  const db = loadDB();

  // Health/version endpoints (shared with the production Fastify API contract).
  if (req.method === 'GET' && pathname === '/api/health') {
    send(res, 200, { status: 'ok', database: 'json_file', timestamp: new Date().toISOString() }); return;
  }
  if (req.method === 'GET' && pathname === '/api/version') {
    send(res, 200, { version: '2.0.0', service: 'ryad-alaqsa-prototype' }); return;
  }

  // AUTH
  if (req.method === 'POST' && pathname === '/api/auth/login') {
    const body = await parseBody(req);
    const identifier = body.identifier || body.login || body.email;
    const { password, portal } = body;
    const user = db.users.find(u => (u.email===identifier || u.phone===identifier) && verifyPassword(password, u.password));
    if (!user) { send(res,401,{error:'invalid_credentials'}); return; }
    if (portal && user.portal !== portal) { send(res,403,{error:'portal_mismatch', message:'هذا الحساب لا يتبع البوابة المختارة. استخدم البوابة الصحيحة (إدارة/حساب خاص).'}); return; }
    // migrate legacy plain password to hashed (prototype hardening)
    if (user.password && !String(user.password).startsWith('pbkdf2$')) user.password = hashPassword(password);
    const sess = issueSession(db, user);
    audit(db, {sub:user.id, role:user.role}, 'login', 'session', user.id, {portal: user.portal, hardened: true});
    saveDB(db);
    send(res,200,{token: sess.accessToken, accessToken: sess.accessToken, refreshToken: sess.refreshToken, expiresIn: sess.expiresIn, user:{id:user.id,name:user.name,role:user.role,portal:user.portal,scope:user.scope}, security:{httpsRecommended: !USE_HTTPS}});
    return;
  }
  if (req.method === 'POST' && pathname === '/api/auth/refresh') {
    const body = await parseBody(req);
    const rt = body.refreshToken;
    const now = Math.floor(Date.now()/1000);
    const s = (db.sessions||[]).find(x=>x.refresh===rt && x.exp>now);
    if (!s) { send(res,401,{error:'invalid_refresh'}); return; }
    const user = db.users.find(u=>u.id===s.userId);
    if (!user) { send(res,401,{error:'invalid_refresh'}); return; }
    // rotate
    s.refresh = crypto.randomBytes(24).toString('hex'); s.exp = now + REFRESH_TTL; s.rotatedAt = new Date().toISOString();
    const accessToken = signToken({ sub:user.id, role:user.role, portal:user.portal, scope:user.scope, name:user.name, typ:'access' }, ACCESS_TTL);
    audit(db,{sub:user.id, role:user.role},'refresh','session',s.id,{});
    saveDB(db);
    send(res,200,{token: accessToken, accessToken, refreshToken: s.refresh, expiresIn: ACCESS_TTL}); return;
  }
  if (req.method === 'GET' && pathname === '/api/auth/me') {
    const auth = requireAuth(req,res); if(!auth) return;
    const user = db.users.find(u=>u.id===auth.sub);
    send(res,200,{user:{id:user.id,name:user.name,role:user.role,portal:user.portal,scope:user.scope}});
    return;
  }

  // ADMIN portal endpoints
  if (pathname.startsWith('/api/admin/')) {
    const auth = requireAuth(req,res); if(!auth) return;
    if (!requirePortal(auth,res,'admin_portal')) return;

    if (req.method==='GET' && pathname==='/api/admin/overview') {
      const agg = dal.getDashboardAggregates(db);
      const report = {
        attendanceRate: 94,
        studentsPresent: agg.students,
        teachers: (db.users||[]).filter(u=>u.role==='teacher' && u.isActive!==false).length,
        levels: db.levels.map(l=>({name:l.name, classes: db.classes.filter(c=>c.levelId===l.id).length})),
        auditCount: agg.auditCount,
        feedbackPending: agg.feedbackPending,
        activeCases: agg.activeCases,
        reassessmentDue: agg.reassessmentDue,
        competencyRefs: (db.competencyReferences||[]).length,
        withGaps: agg.withGaps,
        gifted: agg.gifted,
        activeInterventions: agg.activeInterventions,
        outreachActivities: agg.outreachActivities,
        publications: agg.publications
      };
      audit(db,auth,'read','overview','global',{}); saveDB(db);
      send(res,200,report); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/curriculum') {
      const items = curriculumList(db, { levelId: parsed.query.levelId, term: parsed.query.term, subjectId: parsed.query.subjectId });
      audit(db,auth,'read','curriculum',parsed.query.levelId||'all',{term:parsed.query.term||null}); saveDB(db);
      send(res,200,{
        items, terms: TERMS, subjects: db.subjects, levels: db.levels,
        languageConfig: db.languageConfig||{}, contentSamples: db.contentSamples||[]
      }); return;
    }
    if (req.method==='POST' && pathname==='/api/admin/curriculum/update') {
      if (!hasRole(auth,['director','deputy','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const body = await parseBody(req);
      const item = (db.curriculum||[]).find(c=>c.id===body.id);
      if (!item) { send(res,404,{error:'not_found'}); return; }
      const changes = {};
      if (body.term !== undefined) {
        if (!TERMS.includes(body.term)) { send(res,400,{error:'validation_failed', field:'term'}); return; }
        changes.term = item.term || 'الفصل 1';
        item.term = body.term;
      }
      if (body.status !== undefined) {
        if (!['draft','published'].includes(body.status)) { send(res,400,{error:'validation_failed', field:'status'}); return; }
        changes.status = item.status || 'draft';
        item.status = body.status;
      }
      if (!Object.keys(changes).length) { send(res,400,{error:'validation_failed', message:'no editable fields'}); return; }
      audit(db,auth,'update','curriculum',item.id,{from:changes,to:{term:item.term,status:item.status}});
      saveDB(db);
      send(res,200,{ok:true, item:{...item, level: levelById(db,item.levelId)?.name, subject: db.subjects.find(s=>s.id===item.subjectId)?.name, term:item.term||'الفصل 1'}}); return;
    }
    if (req.method==='POST' && pathname==='/api/admin/lesson-contents/publish') {
      if (!hasRole(auth,['director','deputy','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const body = await parseBody(req);
      const content = findLessonContent(db, body.id);
      if (!content) { send(res,404,{error:'not_found'}); return; }
      const now = new Date().toISOString();
      content.status = 'published';
      content.publishedAt = now;
      content.publishedBy = actorId(auth);
      audit(db, auth, 'publish', 'lesson_content', content.id, { lessonId: content.lessonId, by: actorId(auth) }); saveDB(db);
      send(res, 200, { content }); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/students') {
      if (!hasRole(auth,['director','deputy','supervisor','admin','clerk'])) { send(res,403,{error:'forbidden'}); return; }
      const students = (db.students||[]).map(st=>({
        id:st.id, name:st.name, levelId:st.levelId, classId:st.classId,
        level: levelById(db,st.levelId)?.name, class: classById(db,st.classId)?.name
      }));
      send(res,200,{students}); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/report-card') {
      if (!hasRole(auth,['director','deputy','supervisor','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const sid = parsed.query.studentId;
      if (!sid || !studentById(db,sid)) { send(res,400,{error:'validation_failed', field:'studentId'}); return; }
      const reportCard = computeReportCard(db, sid, parsed.query.term);
      audit(db,auth,'read','report_card',sid,{term:reportCard.term}); saveDB(db);
      send(res,200,{reportCard}); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/content-samples') {
      if (!hasRole(auth,['director','deputy','supervisor','admin','clerk'])) { send(res,403,{error:'forbidden'}); return; }
      const level = parsed.query.level;
      const samples = (db.contentSamples||[]).filter(s=>!level || s.levelId===level);
      send(res,200,{samples, languageConfig: db.languageConfig||{}, curriculum: db.curriculum.filter(c=>!level || c.levelId===level)}); return;
    }
    if (req.method==='POST' && pathname==='/api/admin/curriculum') {
      if (!hasRole(auth,['director','deputy','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const body = await parseBody(req);
      const item = { id:'cur_'+Date.now(), status:'draft', ...body };
      db.curriculum.push(item);
      audit(db,auth,'create','curriculum',item.id,{title:item.unit}); saveDB(db);
      send(res,201,{item}); return;
    }

    // --- Structured lesson editor (admin, global oversight) ---
    // Read is open to every admin-portal role (supervisor included), matching the
    // read-only curriculum rule. Review and export require a writing role.
    if (req.method === 'GET' && pathname === '/api/admin/lesson-plans') {
      const filters = { levelId: parsed.query.levelId, subjectId: parsed.query.subjectId, term: parsed.query.term, status: parsed.query.status };
      const plans = lessonPlansFiltered(db, filters);
      const summary = {
        total: plans.length,
        draft: plans.filter((p) => p.status === 'draft').length,
        in_review: plans.filter((p) => p.status === 'in_review').length,
        published: plans.filter((p) => p.status === 'published').length,
      };
      audit(db, auth, 'read', 'lesson_plan', 'all', { ...filters, count: plans.length }); saveDB(db);
      send(res, 200, { plans, summary }); return;
    }
    if (req.method === 'POST' && pathname === '/api/admin/lesson-plans/review') {
      if (!hasRole(auth, ['director','deputy','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const body = await parseBody(req);
      const plan = (db.lessonPlans || []).find((p) => p.id === body.id);
      if (!plan) { send(res,404,{error:'not_found'}); return; }
      if (plan.status !== 'in_review') { send(res,400,{error:'invalid_transition'}); return; }
      if (!['published','draft'].includes(body.decision)) { send(res,400,{error:'validation_failed', field:'decision'}); return; }
      const now = new Date().toISOString();
      const note = isNonEmptyString(body.note) ? body.note.trim() : '';
      if (body.decision === 'published') {
        plan.status = 'published';
        plan.publishedAt = now;
        plan.reviewedBy = actorId(auth);
      } else {
        plan.status = 'draft';
        plan.publishedAt = null;
        plan.reviewedBy = null;
      }
      plan.updatedAt = now;
      plan.history = plan.history || [];
      plan.history.push({
        at: now, by: actorId(auth),
        action: body.decision === 'published' ? 'published' : 'unpublished',
        details: note || (body.decision === 'published' ? 'اعتماد الخطة ونشرها' : 'إعادة الخطة إلى المسودة'),
      });
      audit(db, auth, 'review', 'lesson_plan', plan.id, { decision: body.decision, note: note || null }); saveDB(db);
      send(res, 200, { plan: lessonPlanView(db, plan) }); return;
    }
    if (req.method === 'GET' && pathname === '/api/admin/lesson-plans/export') {
      if (!hasRole(auth, ['director','deputy','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const filters = { levelId: parsed.query.levelId, subjectId: parsed.query.subjectId, term: parsed.query.term, status: parsed.query.status };
      const plans = lessonPlansFiltered(db, filters);
      const format = parsed.query.format === 'csv' ? 'csv' : 'json';
      audit(db, auth, 'export', 'lesson_plan', 'all', { format, count: plans.length, ...filters }); saveDB(db);
      if (format === 'csv') {
        // CSV is deliberately written raw: send() would JSON.stringify the body.
        res.writeHead(200, {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="lesson-plans.csv"',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(lessonPlanCsv(db, plans)); return;
      }
      send(res, 200, plans, {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': 'attachment; filename="lesson-plans.json"',
      }); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/audit-logs') {
      if (!hasRole(auth,['director','deputy','admin'])) { send(res,403,{error:'forbidden'}); return; }
      send(res,200,{logs: db.auditLogs.slice(-100).reverse()}); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/performance') {
      const byLevel = db.levels.map(l=>{
        const stIds = db.students.filter(s=>s.levelId===l.id).map(s=>s.id);
        const g = db.grades.filter(x=>stIds.includes(x.studentId));
        const avg = g.length ? (g.reduce((s,x)=>s+x.score,0)/g.length).toFixed(1) : null;
        return { level:l.name, students: stIds.length, average: avg };
      });
      audit(db,auth,'read','performance','global',{}); saveDB(db);
      send(res,200,{byLevel}); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/strategy') {
      if (!hasRole(auth,['director','deputy','admin'])) { send(res,403,{error:'forbidden'}); return; }
      audit(db,auth,'read','strategy','global',{}); saveDB(db);
      send(res,200,{strategy: db.strategy, goals: db.goals, competitors: db.competitors, partnerships: db.partnerships}); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/finance') {
      if (!hasRole(auth,['director','deputy'])) { send(res,403,{error:'forbidden', message:'البيانات المالية متاحة للمدير ونائب المدير'}); return; }
      const salaryTotal = (db.staff||[]).reduce((s,x)=>s+x.salary,0);
      audit(db,auth,'read','finance','global',{}); saveDB(db);
      send(res,200,{finance: db.finance, salaries: {total: salaryTotal, count: (db.staff||[]).length}}); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/learning-analytics') {
      const insights = db.students.map(s=>computeStudentInsights(db,s.id)).filter(Boolean);
      const summary = {
        students: insights.length,
        withGaps: insights.filter(i=>i.gaps.length).length,
        gifted: insights.filter(i=>i.talents.length).length,
        activeInterventions: (db.interventions||[]).filter(i=>i.status==='active').length,
        alerts: (db.alerts||[]).length
      };
      audit(db,auth,'read','learning_analytics','global',{}); saveDB(db);
      send(res,200,{summary, insights, activities: db.activities||[]}); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/smart-assistant') {
      if (!hasRole(auth,['director','deputy','supervisor','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const payload = {
        agentProfiles: db.agentProfiles||[],
        agentRuns: (db.agentRuns||[]).slice(-50).reverse(),
        evidence: (db.evidence||[]).slice(-100).reverse(),
        feedbackCards: db.feedbackCards||[],
        cases: db.cases||[],
        drafts: (db.drafts||[]),
        library: (db.library||[]),
        activities: db.activities||[],
        publications: db.publications||[],
        stats: {
          gaps: (db.competencies||[]).filter(c=>c.status==='gap' || c.mastery<0.5).length,
          talents: (db.talents||[]).length,
          interventions: (db.interventions||[]).filter(i=>i.status==='active').length,
          alerts: (db.alerts||[]).length,
          evidenceCount: (db.evidence||[]).length,
          activeCases: (db.cases||[]).filter(c=>c.status==='active').length,
          feedbackCards: (db.feedbackCards||[]).length
        }
      };
      audit(db,auth,'read','smart_assistant','global',{sections:['agents','evidence','cases','feedback_cards','library','drafts']}); saveDB(db);
      send(res,200,payload); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/competency-refs') {
      if (!hasRole(auth,['director','deputy','supervisor','admin','clerk'])) { send(res,403,{error:'forbidden'}); return; }
      const level = parsed.query.level;
      const refs = (db.competencyReferences||[]).filter(r=>!level || r.level===level);
      send(res,200,{competencyReferences: refs}); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/feedback-cards') {
      if (!hasRole(auth,['director','deputy','supervisor','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const sid = parsed.query.studentId;
      const cards = (db.feedbackCards||[]).filter(c=>!sid || c.studentId===sid);
      audit(db,auth,'read','feedback_cards',sid||'all',{}); saveDB(db);
      send(res,200,{feedbackCards: cards}); return;
    }
    if (req.method==='POST' && pathname==='/api/admin/feedback-cards/update') {
      if (!hasRole(auth,['director','deputy','supervisor','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const body = await parseBody(req);
      const card = (db.feedbackCards||[]).find(c=>c.id===body.id);
      if (!card) { send(res,404,{error:'not_found'}); return; }
      if (body.status !== undefined && !feedbackTransitionAllowed(auth, card.status, body.status)) {
        send(res,400,{error:'invalid_transition'}); return; // no mutation
      }
      const before = card.status;
      if (body.status) card.status = body.status; // proposed|approved|rejected|in_progress|completed
      if (body.assignee !== undefined) card.assignee = body.assignee;
      if (body.reviewNotes !== undefined) card.reviewNotes = body.reviewNotes;
      if (body.nextReview) card.nextReview = body.nextReview;
      if (Array.isArray(body.actions)) card.actions = body.actions;
      card.updatedAt = new Date().toISOString();
      card.updatedBy = actorId(auth);
      card.history = card.history || [];
      card.history.push({at: card.updatedAt, by: actorId(auth), action: body.status ? `status:${before}->${body.status}` : 'updated', note: body.note || body.reviewNotes || ''});
      audit(db,auth,'update','feedback_card',card.id,{status:card.status,assignee:card.assignee}); saveDB(db);
      send(res,200,{ok:true, card}); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/cases') {
      if (!hasRole(auth,['director','deputy','supervisor','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const sid = parsed.query.studentId;
      const cases = (db.cases||[]).filter(c=>!sid || c.studentId===sid);
      audit(db,auth,'read','cases',sid||'all',{}); saveDB(db);
      send(res,200,{cases}); return;
    }
    if (req.method==='POST' && pathname==='/api/admin/cases/update') {
      if (!hasRole(auth,['director','deputy','supervisor','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const body = await parseBody(req);
      const cs = (db.cases||[]).find(c=>c.id===body.id || c.studentId===body.studentId);
      if (!cs) { send(res,404,{error:'not_found'}); return; }
      if (body.status) cs.status = body.status;
      if (body.ownerRole) cs.ownerRole = body.ownerRole;
      if (body.ownerId !== undefined) cs.ownerId = body.ownerId;
      if (body.focus) cs.focus = body.focus;
      if (body.nextReview) cs.nextReview = body.nextReview;
      cs.updatedAt = new Date().toISOString();
      audit(db,auth,'update','case',cs.id,{status:cs.status}); saveDB(db);
      send(res,200,{ok:true, case: cs}); return;
    }
    if (req.method==='POST' && pathname==='/api/admin/cases/timeline') {
      if (!hasRole(auth,['director','deputy','supervisor','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const body = await parseBody(req);
      const cs = (db.cases||[]).find(c=>c.id===body.id || c.studentId===body.studentId);
      if (!cs) { send(res,404,{error:'not_found'}); return; }
      const entry = { term: body.term||'الفصل 1', date: body.date||new Date().toISOString().slice(0,10), event: body.event||'', by: actorId(auth), type: body.type||'note' };
      cs.timeline = cs.timeline || [];
      cs.timeline.push(entry);
      cs.updatedAt = new Date().toISOString();
      audit(db,auth,'append','case_timeline',cs.id,{event:entry.event}); saveDB(db);
      send(res,200,{ok:true, case: cs}); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/intervention-plans') {
      if (!hasRole(auth,['director','deputy','supervisor','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const sid = parsed.query.studentId;
      const status = parsed.query.status;
      // Global read-only view across all students; no class filter for admins.
      const filtered = (db.interventionPlans||[]).filter(p =>
        (!sid || p.studentId===sid) && (!status || p.status===status));
      const plans = filtered.map(p => interventionPlanView(db, p));
      const today = new Date().toISOString().slice(0,10);
      const byLevel = { high:0, medium:0, low:0 };
      filtered.forEach(p => { const level = p.source?.level; if (level && byLevel[level] !== undefined) byLevel[level]++; });
      const summary = {
        total: filtered.length,
        active: filtered.filter(p=>p.status==='active').length,
        reviewed: filtered.filter(p=>p.status==='reviewed').length,
        closed: filtered.filter(p=>p.status==='closed').length,
        dueReviews: filtered.filter(p=>p.status!=='closed' && p.nextReview && String(p.nextReview).slice(0,10) <= today).length,
        byLevel
      };
      audit(db,auth,'read','intervention_plans',sid||'global',{status:status||'all',count:plans.length}); saveDB(db);
      send(res,200,{plans, summary}); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/library') {
      if (!hasRole(auth,['director','deputy','supervisor','admin','clerk'])) { send(res,403,{error:'forbidden'}); return; }
      audit(db,auth,'read','library','global',{}); saveDB(db);
      send(res,200,{items: db.library||[]}); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/search') {
      if (!hasRole(auth,['director','deputy','supervisor','admin','clerk'])) { send(res,403,{error:'forbidden'}); return; }
      const q = (parsed.query.q || '').toLowerCase().trim();
      const type = parsed.query.type || 'all';
      if (!q) { send(res,200,{results:[],total:0}); return; }
      const searchTypes = type === 'all' ? ['students','activities','library','cases','cards'] : [type];
      const searchResult = dal.search(db, q, searchTypes);
      audit(db,auth,'search','global',q,{type,results:searchResult.total}); saveDB(db);
      send(res,200,{results: searchResult.results, total: searchResult.total, query: q}); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/ml/gap-prediction') {
      if (!hasRole(auth,['director','deputy','supervisor','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const sid = parsed.query.studentId;
      if (sid) {
        const st = studentById(db, sid);
        if (!st) { send(res,404,{error:'not_found'}); return; }
        const risk = ml.predictGapRisk(st, db);
        const anomalies = ml.detectAnomalies(st, db);
        const recommendations = ml.generateRecommendations(st, db);
        audit(db,auth,'read','ml_gap_prediction',sid,{}); saveDB(db);
        send(res,200,{student: st.name, risk, anomalies, recommendations}); return;
      }
      const predictions = (db.students||[]).map(s => ({ id: s.id, name: s.name, ...ml.predictGapRisk(s, db) }));
      audit(db,auth,'read','ml_gap_prediction','all',{}); saveDB(db);
      send(res,200,{predictions}); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/ml/early-warning') {
      if (!hasRole(auth,['director','deputy','supervisor','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const warnings = ml.earlyWarningSystem(db);
      audit(db,auth,'read','ml_early_warning','global',{count:warnings.length}); saveDB(db);
      send(res,200,{warnings, total: warnings.length }); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/ml/experiment') {
      if (!hasRole(auth,['director','deputy','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const id = parsed.query.id;
      if (id) { send(res,200,{results: ml.getExperimentResults(id)}); return; }
      send(res,200,{experiments: Array.from(ml.experiments.keys())}); return;
    }
    // Assignments use ml.assignVariant's existing stable per-user logic. There is
    // no assignment collection in the JSON schema, so they stay in memory.
    if (req.method==='GET' && pathname==='/api/admin/ml/experiment/assignment') {
      if (!hasRole(auth,['director','deputy','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const userId = parsed.query.userId;
      if (!isNonEmptyString(userId)) { send(res,400,{error:'missing_userId'}); return; }
      const experimentId = isNonEmptyString(parsed.query.experimentId) ? parsed.query.experimentId : 'feedback_card_ui';
      const variant = ml.assignVariant(experimentId, userId);
      if (variant === null) { send(res,404,{error:'unknown_experiment'}); return; }
      send(res,200,{ok:true, experimentId, userId, variant, source:'memory', persisted:false}); return;
    }
    if (req.method==='POST' && pathname==='/api/admin/ml/experiment/assign') {
      if (!hasRole(auth,['director','deputy','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const body = await parseBody(req);
      const userId = body.userId;
      if (!isNonEmptyString(userId)) { send(res,400,{error:'missing_userId'}); return; }
      const experimentId = isNonEmptyString(body.experimentId) ? body.experimentId : 'feedback_card_ui';
      const variant = ml.assignVariant(experimentId, userId);
      if (variant === null) { send(res,404,{error:'unknown_experiment'}); return; }
      send(res,200,{ok:true, experimentId, userId, variant, source:'memory', persisted:false}); return;
    }
    if (req.method==='POST' && pathname==='/api/admin/students/bulk-import') {
      if (!hasRole(auth, ['director', 'deputy', 'admin'])) { send(res, 403, { error: 'forbidden' }); return; }
      const body = await parseBody(req);
      const students = Array.isArray(body.students) ? body.students : [];
      // Validate every row before inserting anything (atomic bulk import).
      const checked = students.map((s, index) => {
        const row = { index, name: s && s.name, ok: false };
        if (!s || typeof s !== 'object' || Array.isArray(s)) { row.error = 'invalid_row'; return row; }
        if (!isNonEmptyString(s.name)) { row.error = 'invalid_name'; row.field = 'name'; return row; }
        if (!isNonEmptyString(s.levelId) || !levelById(db, s.levelId)) { row.error = 'invalid_levelId'; row.field = 'levelId'; return row; }
        if (!isNonEmptyString(s.classId) || !classById(db, s.classId)) { row.error = 'invalid_classId'; row.field = 'classId'; return row; }
        if (s.guardianId !== undefined && s.guardianId !== null && !isNonEmptyString(s.guardianId)) { row.error = 'invalid_guardianId'; row.field = 'guardianId'; return row; }
        if (s.profile !== undefined && (!s.profile || typeof s.profile !== 'object' || Array.isArray(s.profile))) { row.error = 'invalid_profile'; row.field = 'profile'; return row; }
        row.ok = true; return row;
      });
      if (checked.some(r => !r.ok)) { bulkValidationFailed(res, students.length, checked); return; }
      const results = [];
      for (const s of students) {
        const id = 's_imp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
        const student = { id, name: s.name, levelId: s.levelId, classId: s.classId, guardianId: s.guardianId || null, profile: s.profile || { strengths: [], interests: [] } };
        db.students.push(student);
        results.push({ id, name: s.name, ok: true });
      }
      audit(db, auth, 'bulk_import', 'students', 'bulk', { count: students.length });
      saveDB(db);
      send(res, 201, { results, total: students.length, success: results.length }); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/system-stats') {
      const stats = {
        users: db.users.length, students: db.students.length, classes: db.classes.length,
        competencies: (db.competencies||[]).length, competencyReferences: (db.competencyReferences||[]).length,
        evidence: (db.evidence||[]).length,
        agentRuns: (db.agentRuns||[]).length, auditLogs: (db.auditLogs||[]).length,
        interventions: (db.interventions||[]).length, activities: (db.activities||[]).length,
        feedbackCards: (db.feedbackCards||[]).length, cases: (db.cases||[]).length
      };
      audit(db,auth,'read','system_stats','global',{}); saveDB(db);
      send(res,200,{stats, retentionPolicy: db.retentionPolicy||null}); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/impact') {
      if (!hasRole(auth,['director','deputy','supervisor','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const today = new Date().toISOString().slice(0,10);
      const reassessmentDue = [];
      (db.learningPaths||[]).forEach(p=>{ if (p.reassessDate && p.reassessDate <= today) reassessmentDue.push({type:'learning_path', studentId:p.studentId, due:p.reassessDate, focus:p.focus}); });
      (db.cases||[]).forEach(c=>{ if (c.nextReview && c.nextReview <= today) reassessmentDue.push({type:'case', id:c.id, studentId:c.studentId, due:c.nextReview, focus:c.focus}); });
      (db.feedbackCards||[]).forEach(f=>{ if (f.nextReview && f.nextReview <= today && f.status!=='completed' && f.status!=='rejected') reassessmentDue.push({type:'feedback_card', id:f.id, studentId:f.studentId, due:f.nextReview, status:f.status}); });
      const impact = {
        interventions: { active: (db.interventions||[]).filter(i=>i.status==='active').length, total: (db.interventions||[]).length },
        feedbackCards: { proposed: (db.feedbackCards||[]).filter(f=>f.status==='proposed').length, approved: (db.feedbackCards||[]).filter(f=>f.status==='approved').length, inProgress: (db.feedbackCards||[]).filter(f=>f.status==='in_progress').length, completed: (db.feedbackCards||[]).filter(f=>f.status==='completed').length },
        cases: { active: (db.cases||[]).filter(c=>c.status==='active').length, total: (db.cases||[]).length },
        outreach: { activities: (db.activities||[]).filter(a=>a.outreach).length, publications: (db.publications||[]).length },
        reassessmentDue
      };
      audit(db,auth,'read','impact','global',{due: reassessmentDue.length}); saveDB(db);
      send(res,200,{impact}); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/alerts') {
      if (!hasRole(auth,['director','deputy','supervisor','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const today = new Date().toISOString().slice(0,10);
      const due = [];
      (db.learningPaths||[]).forEach(p=>{ if (p.reassessDate && p.reassessDate <= today) due.push({kind:'reassessment', level:'warn', studentId:p.studentId, message:`إعادة تقييم مسار التعلم مستحقة (${p.reassessDate})`, ref:p.studentId}); });
      (db.feedbackCards||[]).forEach(f=>{ if (f.nextReview && f.nextReview <= today && !['completed','rejected'].includes(f.status)) due.push({kind:'feedback_review', level:'warn', studentId:f.studentId, message:`مراجعة بطاقة تغذية راجعة مستحقة (${f.nextReview})`, ref:f.id}); });
      const alerts = [...(db.alerts||[]), ...due];
      audit(db,auth,'read','alerts','global',{count:alerts.length}); saveDB(db);
      send(res,200,{alerts}); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/retention') {
      if (!hasRole(auth,['director','deputy','admin'])) { send(res,403,{error:'forbidden'}); return; }
      send(res,200,{retentionPolicy: db.retentionPolicy||{}, storageType: storage.type(), note:'لإنتاج: اعتماد قاعدة بيانات (PostgreSQL) مع نسخ احتياطي وتشفير وسجلات وصول. راجع docs/schema-postgres.sql'}); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/impact-report') {
      if (!hasRole(auth,['director','deputy','supervisor','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const report = analytics.impactReport(db);
      audit(db,auth,'read','impact_report','global',{period:report.period}); saveDB(db);
      send(res,200,{report}); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/analytics/anonymized') {
      if (!hasRole(auth,['director','deputy','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const level = parsed.query.level;
      const students = (db.students||[]).filter(s => !level || (db.levels.find(l=>l.id===s.levelId)?.name===level));
      const comps = (db.competencies||[]).filter(c => students.some(s=>s.id===c.studentId));
      const agg = analytics.anonymizeAggregate(comps.map(c=>({mastery:c.mastery,status:c.status,talents:[]})), 3);
      const trends = analytics.timeSeriesTrends(db, 'all', 6);
      audit(db,auth,'read','anonymized_analytics','global',{level:level||'all'}); saveDB(db);
      send(res,200,{anonymized: agg, trends, policy: {minGroupSize:3, note:'k-anonymity: لا تُعرض تجميعات لمجموعات أقل من 3'} }); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/integrations') {
      if (!hasRole(auth,['director','deputy','admin'])) { send(res,403,{error:'forbidden'}); return; }
      send(res,200,{integrations: integrations.listIntegrations()}); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/integrations/export') {
      if (!hasRole(auth,['director','deputy','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const system = parsed.query.system || 'massar';
      const data = integrations.exportData(system, db);
      if (!data) { send(res,404,{error:'unknown_system'}); return; }
      audit(db,auth,'export','integration',system,{records: (data.students||[]).length}); saveDB(db);
      send(res,200,{export: data}); return;
    }
    if (req.method==='POST' && pathname==='/api/admin/communications/send') {
      if (!hasRole(auth,['director','deputy','supervisor','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const body = await parseBody(req);
      const c = (db.communications||[]).find(x=>x.id===body.id);
      if (!c) { send(res,404,{error:'not_found'}); return; }
      // governance check
      const gate = commService.canSend(c);
      if (!gate.ok) { send(res,400,{error:'governance', reason:gate.reason, message:gate.reason==='requires_approval'?'يتطلب اعتمادًا قبل الإرسال':gate.reason==='consent_pending'?'موافقة ولي الأمر معلقة':gate.reason==='consent_declined'?'تم رفض موافقة ولي الأمر':'غير مسموح'}); return; }
      const addr = body.recipientAddress || (c.channel==='whatsapp'?'0600000000':'parent@ryad.ma');
      const text = body.body || (db.drafts||[]).find(d=>d.id===c.draftId)?.body || c.notes || '';
      const result = await commService.sendCommunication(c, addr, text);
      if (result.ok) {
        c.status = 'sent'; c.sentAt = new Date().toISOString(); c.sentBy = actorId(auth);
        c.delivery = result;
        audit(db,auth,'send','communication',c.id,{channel:c.channel,provider:result.provider,messageId:result.messageId}); saveDB(db);
        send(res,200,{ok:true, communication:c, delivery:result}); return;
      }
      send(res,500,{error:'send_failed', reason:result.reason}); return;
    }
    if (req.method==='POST' && pathname==='/api/admin/retention/apply') {
      if (!hasRole(auth,['director','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const body = await parseBody(req);
      const dryRun = body.dryRun === true;
      const p = db.retentionPolicy || {auditDays:365,draftsDays:180,sessionsDays:30};
      const now = Date.now();
      const cut = d => now - d*24*60*60*1000;
      const before = {audit: (db.auditLogs||[]).length, sessions:(db.sessions||[]).length};
      const keptAudit = (db.auditLogs||[]).filter(l=> new Date(l.at||0).getTime() >= cut(p.auditDays||365));
      const keptSessions = (db.sessions||[]).filter(s=> (s.exp*1000) >= now && new Date(s.createdAt||0).getTime() >= cut(p.sessionsDays||30));
      const removed = { audit: before.audit - keptAudit.length, sessions: before.sessions - keptSessions.length };
      if (dryRun) {
        // Preview only: no db mutation, no saveDB, no audit entry.
        const preview = {
          audit: (db.auditLogs||[]).filter(l => !keptAudit.includes(l)).slice(0, 50).map(l => l.id),
          sessions: (db.sessions||[]).filter(s => !keptSessions.includes(s)).slice(0, 50).map(s => s.id)
        };
        send(res,200,{ok:true, dryRun:true, policy:p, removed, preview}); return;
      }
      db.auditLogs = keptAudit;
      db.sessions = keptSessions;
      audit(db,auth,'retention','storage','global',{before, after:{audit:db.auditLogs.length, sessions:db.sessions.length}}); saveDB(db);
      send(res,200,{ok:true, policy:p, removed}); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/attendance') {
      if (!hasRole(auth,['director','deputy','supervisor','admin','clerk'])) { send(res,403,{error:'forbidden'}); return; }
      const sid = parsed.query.studentId;
      const classId = parsed.query.classId;
      let items = (db.attendance||[]);
      if (sid) items = items.filter(a=>a.studentId===sid);
      if (classId) items = items.filter(a=>a.classId===classId);
      send(res,200,{attendance: items}); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/engagement') {
      if (!hasRole(auth,['director','deputy','supervisor','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const sid = parsed.query.studentId;
      const classId = parsed.query.classId;
      let students = sid ? [studentById(db,sid)].filter(Boolean) : (db.students||[]);
      if (classId) students = students.filter(st=>st.classId===classId);
      const rows = students.map((st)=>({
        studentId: st.id, name: st.name,
        engagement: engagementSummary(db,st.id),
        assignments: studentAssignments(db,st.id),
        lessons: lessonProgressSummary(db,st.id),
      }));
      send(res,200,{students: rows, note:'زمن المنصة والواجبات والتقدم التفاعلي منفصلة عن حضور القسم.'}); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/assessments') {
      if (!hasRole(auth,['director','deputy','supervisor','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const sid = parsed.query.studentId;
      const items = (db.assessments||[]).filter(a=>!sid || a.studentId===sid);
      audit(db,auth,'read','assessments',sid||'all',{}); saveDB(db);
      send(res,200,{assessments: items, competencyReferences: db.competencyReferences||[]}); return;
    }
    if (req.method==='POST' && pathname==='/api/admin/assessments') {
      if (!hasRole(auth,['director','deputy','supervisor','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const body = await parseBody(req);
      const item = { id:'asmt_'+Date.now(), ...body, createdAt: new Date().toISOString(), createdBy: actorId(auth) };
      db.assessments = db.assessments || []; db.assessments.push(item);
      audit(db,auth,'create','assessment',item.id,{studentId:item.studentId}); saveDB(db);
      send(res,201,{assessment:item}); return;
    }
    if (req.method==='GET' && pathname==='/api/admin/communications') {
      if (!hasRole(auth,['director','deputy','supervisor','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const items = (db.communications||[]).slice().reverse();
      audit(db,auth,'read','communications','all',{}); saveDB(db);
      send(res,200,{communications: items, drafts: db.drafts||[]}); return;
    }
    if (req.method==='POST' && pathname==='/api/admin/communications/update') {
      if (!hasRole(auth,['director','deputy','supervisor','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const body = await parseBody(req);
      const c = (db.communications||[]).find(x=>x.id===body.id);
      if (!c) { send(res,404,{error:'not_found'}); return; }
      if (body.status) c.status = body.status; // draft|approved|sent|cancelled
      c.governance = c.governance || {requiresApproval:true};
      if (body.status==='approved') { c.governance.approvedBy = actorId(auth); c.governance.approvedAt = new Date().toISOString(); }
      if (body.status==='sent') {
        if (!c.governance.approvedBy) { send(res,400,{error:'governance', message:'يتطلب اعتمادًا قبل الإرسال'}); return; }
        c.sentAt = new Date().toISOString(); c.sentBy = actorId(auth);
      }
      if (body.consent) c.governance.consent = body.consent;
      if (body.notes !== undefined) c.notes = body.notes;
      c.updatedAt = new Date().toISOString();
      audit(db,auth,'update','communication',c.id,{status:c.status}); saveDB(db);
      send(res,200,{ok:true, communication:c}); return;
    }

    // --- Weekly school timetable (classroom schedule) ---
    if (req.method === 'GET' && pathname === '/api/admin/timetable') {
      if (!hasRole(auth, ['director','deputy','supervisor','admin','clerk'])) { send(res,403,{error:'forbidden'}); return; }
      let slots = (db.timetable || []);
      if (parsed.query.classId) slots = slots.filter(s => s.classId === parsed.query.classId);
      if (parsed.query.day) slots = slots.filter(s => s.day === parsed.query.day);
      if (parsed.query.term) slots = slots.filter(s => (s.term || TERMS[0]) === parsed.query.term);
      audit(db, auth, 'read', 'timetable', 'all', { classId: parsed.query.classId || null }); saveDB(db);
      send(res, 200, {
        slots: slots.map(s => timetableView(db, s, { view: 'class' })),
        meta: timetableMeta(db, 'global', db.classes || []),
      }); return;
    }
    if (req.method === 'POST' && pathname === '/api/admin/timetable') {
      if (!hasRole(auth, ['director','deputy','supervisor','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const body = await parseBody(req);
      const checked = validateTimetableFields(db, body);
      if (checked.field) { send(res,400,{error:'validation_failed', field:checked.field}); return; }
      const v = checked.value;
      const slot = {
        id: 'ts_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        classId: v.classId,
        day: v.day,
        period: v.period,
        subjectId: v.subjectId,
        teacherId: v.teacherId || '',
        room: v.room || '',
        term: v.term || TERMS[0],
      };
      db.timetable = db.timetable || [];
      db.timetable.push(slot);
      audit(db, auth, 'create', 'timetable', slot.id, { advisory: false, classId: slot.classId }); saveDB(db);
      send(res, 201, { slot: timetableView(db, slot, { view: 'class' }) }); return;
    }
    if (req.method === 'POST' && pathname === '/api/admin/timetable/update') {
      if (!hasRole(auth, ['director','deputy','supervisor','admin'])) { send(res,403,{error:'forbidden'}); return; }
      const body = await parseBody(req);
      const slot = (db.timetable || []).find(s => s.id === body.id);
      if (!slot) { send(res,404,{error:'not_found'}); return; }
      if (body.remove) {
        db.timetable = db.timetable.filter(s => s.id !== slot.id);
        audit(db, auth, 'delete', 'timetable', slot.id, { advisory: false }); saveDB(db);
        send(res, 200, { removed: true }); return;
      }
      const checked = validateTimetableFields(db, body, true);
      if (checked.field) { send(res,400,{error:'validation_failed', field:checked.field}); return; }
      if (!Object.keys(checked.value).length) { send(res,400,{error:'validation_failed', field:'patch', message:'no editable fields'}); return; }
      Object.assign(slot, checked.value);
      audit(db, auth, 'update', 'timetable', slot.id, { advisory: false, fields: Object.keys(checked.value) }); saveDB(db);
      send(res, 200, { slot: timetableView(db, slot, { view: 'class' }) }); return;
    }

    // Two-way messaging: administrators get a global, read-only audit view.
    if (req.method === 'GET' && pathname === '/api/admin/threads') {
      const threads = (db.messageThreads || []).map(t => messageThreadView(db, t));
      const summary = {
        total: threads.length,
        open: threads.filter(t => t.status === 'open').length,
        closed: threads.filter(t => t.status === 'closed').length,
      };
      audit(db, auth, 'read', 'message_thread', actorId(auth) || 'all', { by: 'admin' }); saveDB(db);
      send(res, 200, { threads, summary }); return;
    }

    // ---- Moroccan primary grading (admin: config, oversight, approval, export) ----
    // Reads are open to every admin-portal role (supervisor included); changing
    // the policy and approving entries require a writing role.
    if (req.method === 'GET' && pathname === '/api/admin/grades/config') {
      audit(db, auth, 'read', 'grading_config', 'global', {}); saveDB(db);
      send(res, 200, { policy: gradingPolicy(db), subjects: db.subjects || [] }); return;
    }
    if (req.method === 'POST' && pathname === '/api/admin/grades/config') {
      if (!hasRole(auth, ['director', 'deputy', 'admin'])) { send(res,403,{error:'forbidden'}); return; }
      const body = await parseBody(req);
      const incoming = body.policy;
      if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
        send(res,400,{error:'validation_failed', field:'policy'}); return;
      }
      const base = DEFAULT_GRADING_POLICY;
      // Merge so a school can override only the fields its circular fixes.
      const policy = {
        ...base,
        ...incoming,
        subjectCoefficients: { ...base.subjectCoefficients, ...(incoming.subjectCoefficients || {}) },
        cycleWeights: { ...base.cycleWeights, ...(incoming.cycleWeights || {}) },
        sixthGradeWeights: { ...base.sixthGradeWeights, ...(incoming.sixthGradeWeights || {}) },
        mentionBands: (Array.isArray(incoming.mentionBands) && incoming.mentionBands.length)
          ? incoming.mentionBands : base.mentionBands,
      };
      const scale = Number(policy.scale);
      if (!Number.isFinite(scale) || scale <= 0) { send(res,400,{error:'validation_failed', field:'scale'}); return; }
      const threshold = Number(policy.successThreshold);
      if (!Number.isFinite(threshold) || threshold <= 0 || threshold > scale) {
        send(res,400,{error:'validation_failed', field:'successThreshold'}); return;
      }
      const cw1 = Number(policy.cycleWeights.cycle1), cw2 = Number(policy.cycleWeights.cycle2);
      if (!Number.isFinite(cw1) || !Number.isFinite(cw2) || Math.abs(cw1 + cw2 - 1) > 0.001) {
        send(res,400,{error:'validation_failed', field:'cycleWeights'}); return;
      }
      const sg = policy.sixthGradeWeights;
      const sgw = [Number(sg.continuous), Number(sg.localExam), Number(sg.regionalExam)];
      if (sgw.some((x) => !Number.isFinite(x) || x < 0) || Math.abs(sgw[0] + sgw[1] + sgw[2] - 1) > 0.001) {
        send(res,400,{error:'validation_failed', field:'sixthGradeWeights'}); return;
      }
      db.gradingPolicy = policy;
      audit(db, auth, 'update', 'grading_policy', 'global', { scale, successThreshold: threshold }); saveDB(db);
      send(res, 200, { policy }); return;
    }
    if (req.method === 'GET' && pathname === '/api/admin/grades/results') {
      const { classId, studentId, cycle } = parsed.query;
      if (cycle && !['cycle1','cycle2'].includes(cycle)) { send(res,400,{error:'validation_failed', field:'cycle'}); return; }
      if (studentId && !studentById(db, studentId)) { send(res,400,{error:'validation_failed', field:'studentId'}); return; }
      if (classId && !classById(db, classId)) { send(res,400,{error:'validation_failed', field:'classId'}); return; }
      const policy = gradingPolicy(db);
      const subjectNameById = (id) => (db.subjects || []).find((s) => s.id === id)?.name || id;
      const students = (db.students || []).filter((st) =>
        (!classId || st.classId === classId) && (!studentId || st.id === studentId));
      const results = students.map((st) => {
        const raw = computeStudentResult(gradeRecordFor(db, st.id, cycle, policy), policy);
        return {
          studentId: st.id,
          studentName: st.name,
          classId: st.classId,
          className: classById(db, st.classId)?.name || '',
          levelName: levelName(db, st.levelId),
          cycle1: raw.cycle1,
          cycle2: raw.cycle2,
          annualAverage: raw.annualAverage,
          mention: raw.mention,
          decision: raw.decision,
          failingSubjects: (raw.failingSubjects || []).map(subjectNameById),
          advisory: true,
          cycles: raw.cycles,
        };
      });
      const classIds = [...new Set(results.map((r) => r.classId))];
      const byClass = classIds.map((cid) => {
        const rows = results.filter((r) => r.classId === cid);
        const averages = rows.map((r) => r.annualAverage).filter((v) => Number.isFinite(v));
        return {
          classId: cid,
          className: classById(db, cid)?.name || '',
          average: averages.length
            ? gradingModule.round2(averages.reduce((a, b) => a + b, 0) / averages.length) : null,
          success: rows.filter((r) => r.decision === 'success').length,
          fail: rows.filter((r) => r.decision === 'fail').length,
        };
      });
      const summary = {
        total: results.length,
        success: results.filter((r) => r.decision === 'success').length,
        fail: results.filter((r) => r.decision === 'fail').length,
        byClass,
      };
      audit(db, auth, 'read', 'grade_result', (classId || studentId || cycle || 'all'), { count: results.length }); saveDB(db);
      send(res, 200, { results, summary }); return;
    }
    if (req.method === 'GET' && pathname === '/api/admin/grades/entries') {
      const status = parsed.query.status;
      if (status && !['draft','submitted','approved'].includes(status)) { send(res,400,{error:'validation_failed', field:'status'}); return; }
      const entries = (db.gradeEntries || [])
        .filter((e) => !status || e.status === status)
        .map((e) => ({
          ...e,
          studentName: studentById(db, e.studentId)?.name || e.studentId,
          subjectName: (db.subjects || []).find((s) => s.id === e.subjectId)?.name || e.subjectId,
        }));
      audit(db, auth, 'read', 'grade_entry', status || 'all', { count: entries.length }); saveDB(db);
      send(res, 200, { entries, meta: { statuses: ['draft','submitted','approved'] } }); return;
    }
    if (req.method === 'POST' && pathname === '/api/admin/grades/approve') {
      if (!hasRole(auth, ['director', 'deputy', 'admin'])) { send(res,403,{error:'forbidden'}); return; }
      const body = await parseBody(req);
      const entry = (db.gradeEntries || []).find((e) => e.id === body.id);
      if (!entry) { send(res,404,{error:'not_found'}); return; }
      if (entry.status !== 'submitted') { send(res,400,{error:'invalid_transition'}); return; }
      const now = new Date().toISOString();
      entry.status = 'approved';
      entry.approvedBy = actorId(auth);
      entry.approvedAt = now;
      audit(db, auth, 'approve', 'grade_entry', entry.id, { studentId: entry.studentId, by: actorId(auth) }); saveDB(db);
      send(res, 200, { entry }); return;
    }
    if (req.method === 'GET' && pathname === '/api/admin/grades/export') {
      const { classId, cycle, format } = parsed.query;
      const fmt = format === 'json' ? 'json' : 'pdf-data';
      if (cycle && !['cycle1','cycle2'].includes(cycle)) { send(res,400,{error:'validation_failed', field:'cycle'}); return; }
      const policy = gradingPolicy(db);
      const subjectNameById = (id) => (db.subjects || []).find((s) => s.id === id)?.name || id;
      const classes = (db.classes || []).filter((c) => !classId || c.id === classId).map((cls) => {
        const students = (db.students || []).filter((st) => st.classId === cls.id);
        return {
          name: cls.name,
          students: students.map((st) => {
            const rec = gradeRecordFor(db, st.id, cycle, policy);
            const raw = computeStudentResult(rec, policy);
            const chosen = cycle ? raw.cycles[cycle] : null;
            const bySubject = new Map();
            const relevant = cycle
              ? [...rec.cycle1, ...rec.cycle2].filter((e) => normalizeGradeCycle(e) === cycle)
              : [...rec.cycle1, ...rec.cycle2];
            for (const e of relevant) {
              const list = bySubject.get(e.subjectId) || [];
              list.push(computeSubjectAverage(e, policy));
              bySubject.set(e.subjectId, list);
            }
            return {
              name: st.name,
              subjects: [...bySubject.entries()].map(([sid, avgs]) => ({
                name: subjectNameById(sid),
                average: gradingModule.round2(avgs.reduce((a, b) => a + b, 0) / avgs.length),
                coefficient: Number(policy.subjectCoefficients && policy.subjectCoefficients[sid]) || 1,
              })),
              cycleAverage: chosen ? chosen.cycleAverage : raw.annualAverage,
              mention: raw.mention,
              mentionLabel: gradingModule.mentionLabel(raw.mention),
              decision: raw.decision,
            };
          }),
        };
      });
      const report = {
        institution: { name: 'Institut Ryad Al Aqsa', nameAr: 'معهد رياض الأقصى', city: 'الرباط', country: 'المغرب' },
        year: '2025-2026',
        cycle: cycle || 'all',
        classes,
        policy,
        generatedAt: new Date().toISOString(),
        advisory: true,
        note: policy.note,
      };
      audit(db, auth, 'export', 'grade_report', (classId || 'all'), { format: fmt, cycle: cycle || 'all', classes: classes.length }); saveDB(db);
      if (fmt === 'json') {
        const entries = (db.gradeEntries || []).filter((e) =>
          (!classId || e.classId === classId) && (!cycle || normalizeGradeCycle(e) === cycle));
        send(res, 200, { report, entries: entries.map((e) => gradeEntryView(db, e)) });
      } else {
        send(res, 200, report);
      }
      return;
    }

    send(res,404,{error:'not_found'}); return;
  }

  // TEACHER endpoints (private portal)
  if (pathname.startsWith('/api/teacher/')) {
    const auth = requireAuth(req,res); if(!auth) return;
    if (!requirePortal(auth,res,'private')) return;
    if (auth.role!=='teacher') { send(res,403,{error:'forbidden'}); return; }

    if (req.method==='GET' && pathname==='/api/teacher/classes') {
      const classes = db.classes.filter(c=> (auth.scope?.classes||[]).includes(c.id)).map(c=>({...c, level: levelById(db,c.levelId)?.name, students: db.students.filter(s=>s.classId===c.id)}));
      send(res,200,{classes}); return;
    }
    if (req.method==='GET' && pathname==='/api/teacher/student-report') {
      const sid = parsed.query.studentId;
      if (!canTeacherAccessStudent(auth,db,sid)) { send(res,403,{error:'forbidden', message:'خارج نطاق فصول المعلم'}); return; }
      const report = computeStudentReport(db,sid);
      audit(db,auth,'read','student_report',sid,{by:'teacher'}); saveDB(db);
      send(res,200,{report}); return;
    }
    if (req.method==='GET' && pathname==='/api/teacher/student-insights') {
      const sid = parsed.query.studentId;
      if (!canTeacherAccessStudent(auth,db,sid)) { send(res,403,{error:'forbidden', message:'خارج نطاق فصول المعلم'}); return; }
      const insights = computeStudentInsights(db,sid);
      audit(db,auth,'read','student_insights',sid,{by:'teacher', includeEvidence:true}); saveDB(db);
      send(res,200,{insights}); return;
    }
    if (req.method==='GET' && pathname==='/api/teacher/drafts') {
      const sid = parsed.query.studentId;
      if (sid && !canTeacherAccessStudent(auth,db,sid)) { send(res,403,{error:'forbidden'}); return; }
      const drafts = (db.drafts||[]).filter(d=>!sid || d.studentId===sid);
      audit(db,auth,'read','drafts',sid||'all',{}); saveDB(db);
      send(res,200,{drafts}); return;
    }
    if (req.method==='POST' && pathname==='/api/teacher/feedback-cards') {
      const body = await parseBody(req);
      if (!canTeacherAccessStudent(auth, db, body.studentId)) { send(res,403,{error:'forbidden'}); return; }
      if (body.status !== undefined && body.status !== 'proposed') { send(res,400,{error:'invalid_transition'}); return; }
      if (!isNonEmptyString(body.summary)) { send(res,400,{error:'validation_failed', errors:[{index:0, field:'summary', error:'invalid_summary'}]}); return; }
      const now = new Date().toISOString();
      const card = {
        id: 'fc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
        studentId: body.studentId,
        agent: isNonEmptyString(body.agent) ? body.agent : 'teacher',
        term: isNonEmptyString(body.term) ? body.term : 'الفصل 1',
        year: isNonEmptyString(body.year) ? body.year : '2025-2026',
        date: isNonEmptyString(body.date) ? body.date : now.slice(0, 10),
        priority: isNonEmptyString(body.priority) ? body.priority : 'medium',
        summary: body.summary.trim(),
        evidenceIds: Array.isArray(body.evidenceIds) ? body.evidenceIds : [],
        recommendations: Array.isArray(body.recommendations) ? body.recommendations : [],
        resources: Array.isArray(body.resources) ? body.resources : [],
        nextReview: isNonEmptyString(body.nextReview) ? body.nextReview : null,
        status: 'proposed',
        assignee: actorId(auth),
        reviewNotes: '',
        actions: Array.isArray(body.actions) ? body.actions : [],
        createdAt: now,
        createdBy: actorId(auth),
        history: [{ at: now, by: actorId(auth), action: 'created', note: 'بطاقة مقترحة من المعلم' }]
      };
      db.feedbackCards = db.feedbackCards || [];
      db.feedbackCards.push(card);
      audit(db, auth, 'create', 'feedback_card', card.id, { studentId: card.studentId, status: card.status });
      saveDB(db);
      send(res, 201, { ok: true, card }); return;
    }
    if (req.method==='GET' && pathname==='/api/teacher/feedback-cards') {
      const sid = parsed.query.studentId;
      if (sid && !canTeacherAccessStudent(auth,db,sid)) { send(res,403,{error:'forbidden'}); return; }
      const cards = (db.feedbackCards||[]).filter(c=> sid ? c.studentId===sid : canTeacherAccessStudent(auth,db,c.studentId));
      audit(db,auth,'read','feedback_cards',sid||'scoped',{}); saveDB(db);
      send(res,200,{feedbackCards: cards}); return;
    }
    if (req.method==='POST' && pathname==='/api/teacher/feedback-cards/update') {
      const body = await parseBody(req);
      const card = (db.feedbackCards||[]).find(c=>c.id===body.id);
      if (!card) { send(res,404,{error:'not_found'}); return; }
      if (!canTeacherAccessStudent(auth,db,card.studentId)) { send(res,403,{error:'forbidden'}); return; }
      if (body.status !== undefined && !feedbackTransitionAllowed(auth, card.status, body.status)) {
        send(res,400,{error:'invalid_transition'}); return; // no mutation
      }
      const before = card.status;
      if (body.status) card.status = body.status;
      if (body.reviewNotes !== undefined) card.reviewNotes = body.reviewNotes;
      if (body.nextReview) card.nextReview = body.nextReview;
      if (Array.isArray(body.actions)) card.actions = body.actions;
      card.updatedAt = new Date().toISOString();
      card.updatedBy = actorId(auth);
      card.history = card.history || [];
      card.history.push({at: card.updatedAt, by: actorId(auth), action: body.status ? `status:${before}->${body.status}` : 'updated', note: body.note || body.reviewNotes || ''});
      audit(db,auth,'update','feedback_card',card.id,{status:card.status,role:'teacher'}); saveDB(db);
      send(res,200,{ok:true, card}); return;
    }
    if (req.method==='POST' && pathname==='/api/teacher/cases') {
      const body = await parseBody(req);
      if (!canTeacherAccessStudent(auth, db, body.studentId)) { send(res,403,{error:'forbidden'}); return; }
      if (!isNonEmptyString(body.focus)) { send(res,400,{error:'validation_failed', errors:[{index:0, field:'focus', error:'invalid_focus'}]}); return; }
      const now = new Date().toISOString();
      const cs = {
        id: 'case_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
        studentId: body.studentId,
        year: isNonEmptyString(body.year) ? body.year : '2025-2026',
        status: isNonEmptyString(body.status) ? body.status : 'active',
        ownerRole: isNonEmptyString(body.ownerRole) ? body.ownerRole : 'teacher',
        ownerId: actorId(auth),
        focus: body.focus.trim(),
        openedAt: now.slice(0, 10),
        nextReview: isNonEmptyString(body.nextReview) ? body.nextReview : null,
        timeline: [],
        createdAt: now,
        createdBy: actorId(auth)
      };
      db.cases = db.cases || [];
      db.cases.push(cs);
      audit(db, auth, 'create', 'case', cs.id, { studentId: cs.studentId, status: cs.status });
      saveDB(db);
      send(res, 201, { ok: true, case: cs }); return;
    }
    if (req.method==='GET' && pathname==='/api/teacher/cases') {
      const sid = parsed.query.studentId;
      if (sid && !canTeacherAccessStudent(auth,db,sid)) { send(res,403,{error:'forbidden'}); return; }
      const cases = (db.cases||[]).filter(c=> sid ? c.studentId===sid : canTeacherAccessStudent(auth,db,c.studentId));
      audit(db,auth,'read','cases',sid||'scoped',{}); saveDB(db);
      send(res,200,{cases}); return;
    }
    if (req.method==='POST' && pathname==='/api/teacher/cases/timeline') {
      const body = await parseBody(req);
      const cs = (db.cases||[]).find(c=>c.id===body.id || c.studentId===body.studentId);
      if (!cs) { send(res,404,{error:'not_found'}); return; }
      if (!canTeacherAccessStudent(auth,db,cs.studentId)) { send(res,403,{error:'forbidden'}); return; }
      const entry = { term: body.term||'الفصل 1', date: body.date||new Date().toISOString().slice(0,10), event: body.event||'', by: actorId(auth), type: body.type||'note' };
      cs.timeline = cs.timeline || [];
      cs.timeline.push(entry);
      cs.updatedAt = new Date().toISOString();
      audit(db,auth,'append','case_timeline',cs.id,{event:entry.event,role:'teacher'}); saveDB(db);
      send(res,200,{ok:true, case: cs}); return;
    }
    // Intervention plans (teacher-authored, measurable, weekly review).
    if (req.method==='GET' && pathname==='/api/teacher/intervention-plans/warnings') {
      const warnings = ml.earlyWarningSystem(db)
        .filter(w => canTeacherAccessStudent(auth, db, w.studentId))
        .map(w => {
          const st = studentById(db, w.studentId);
          const existing = openInterventionPlan(db, w.studentId);
          return {
            studentId: w.studentId,
            studentName: w.studentName,
            className: classById(db, st?.classId)?.name || '',
            risk: w.risk,
            level: w.level,
            factors: w.factors,
            recommendedAction: w.recommendedAction,
            urgency: w.urgency,
            existingPlanId: existing ? existing.id : null
          };
        });
      // Advisory only: reading warnings never creates or edits a plan.
      audit(db,auth,'read','intervention_warnings','scoped',{count:warnings.length,advisory:true}); saveDB(db);
      send(res,200,{warnings}); return;
    }
    if (req.method==='GET' && pathname==='/api/teacher/intervention-plans') {
      const sid = parsed.query.studentId;
      if (sid && !canTeacherAccessStudent(auth,db,sid)) { send(res,403,{error:'forbidden'}); return; }
      const plans = (db.interventionPlans||[])
        .filter(p => sid ? p.studentId===sid : canTeacherAccessStudent(auth,db,p.studentId))
        .map(p => interventionPlanView(db, p));
      audit(db,auth,'read','intervention_plans',sid||'scoped',{count:plans.length}); saveDB(db);
      send(res,200,{plans, meta:{statuses:INTERVENTION_STATUSES, indicators:INTERVENTION_INDICATORS}}); return;
    }
    if (req.method==='POST' && pathname==='/api/teacher/intervention-plans') {
      const body = await parseBody(req);
      if (!canTeacherAccessStudent(auth, db, body.studentId)) { send(res,403,{error:'forbidden'}); return; }
      if (!isNonEmptyString(body.goal)) { send(res,400,{error:'validation_failed', field:'goal'}); return; }
      if (!INTERVENTION_INDICATORS.includes(body.indicator)) { send(res,400,{error:'validation_failed', field:'indicator'}); return; }
      if (typeof body.baseline !== 'number' || !Number.isFinite(body.baseline)) { send(res,400,{error:'validation_failed', field:'baseline'}); return; }
      if (typeof body.target !== 'number' || !Number.isFinite(body.target)) { send(res,400,{error:'validation_failed', field:'target'}); return; }
      if (!Array.isArray(body.actions) || !body.actions.some(isNonEmptyString)) { send(res,400,{error:'validation_failed', field:'actions'}); return; }
      if (!isValidDateValue(body.nextReview)) { send(res,400,{error:'validation_failed', field:'nextReview'}); return; }
      const st = studentById(db, body.studentId);
      const now = new Date().toISOString();
      // Advisory context only; ML text is never copied into goal/actions.
      let source = null;
      if (isNonEmptyString(body.sourceWarningId)) {
        const warning = ml.earlyWarningSystem(db).find(w => w.studentId === body.studentId);
        if (warning) {
          source = {
            warningId: body.sourceWarningId,
            level: warning.level,
            factors: warning.factors,
            recommendedAction: warning.recommendedAction,
            advisory: true
          };
        }
      }
      const actions = body.actions.filter(isNonEmptyString).map(a => a.trim());
      const plan = {
        id: 'ip_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
        studentId: body.studentId,
        classId: st.classId,
        source,
        goal: body.goal.trim(),
        indicator: body.indicator,
        baseline: body.baseline,
        target: body.target,
        current: body.baseline,
        unit: isNonEmptyString(body.unit) ? body.unit.trim() : '%',
        ownerId: actorId(auth),
        ownerRole: 'teacher',
        status: 'active',
        createdAt: now,
        nextReview: body.nextReview,
        closedAt: null,
        weeks: [],
        history: [{ at: now, by: actorId(auth), action: 'created', details: `خطة تدخل يدوية أنشأها المعلم: ${actions.join('؛ ')}` }]
      };
      db.interventionPlans = db.interventionPlans || [];
      db.interventionPlans.push(plan);
      audit(db,auth,'create','intervention_plan',plan.id,{studentId:plan.studentId, indicator:plan.indicator, advisorySource: source ? source.warningId : null}); saveDB(db);
      send(res,201,{plan}); return;
    }
    if (req.method==='POST' && pathname==='/api/teacher/intervention-plans/week') {
      const body = await parseBody(req);
      const plan = (db.interventionPlans||[]).find(p => p.id===body.id);
      if (!plan) { send(res,404,{error:'not_found'}); return; }
      if (!canTeacherAccessStudent(auth,db,plan.studentId)) { send(res,403,{error:'forbidden'}); return; }
      if (plan.status==='closed') { send(res,400,{error:'invalid_transition', message:'الخطة مغلقة ولا تقبل مراجعة جديدة'}); return; }
      if (!isNonEmptyString(body.reviewNotes)) { send(res,400,{error:'validation_failed', field:'reviewNotes'}); return; }
      if (typeof body.progress !== 'number' || !Number.isFinite(body.progress) || body.progress < 0 || body.progress > 100) {
        send(res,400,{error:'validation_failed', field:'progress'}); return;
      }
      const now = new Date().toISOString();
      const notes = body.reviewNotes.trim();
      const entry = {
        id: 'ipw_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
        week: interventionWeekStart(now),
        actions: Array.isArray(body.actions) ? body.actions.filter(isNonEmptyString).map(a => a.trim()) : [],
        reviewNotes: notes,
        progress: body.progress,
        reviewedAt: now,
        reviewedBy: actorId(auth)
      };
      plan.weeks = plan.weeks || [];
      plan.weeks.push(entry);
      plan.current = Math.round((plan.baseline + (plan.target - plan.baseline) * body.progress / 100) * 100) / 100;
      plan.status = 'reviewed';
      if (isValidDateValue(body.nextReview)) plan.nextReview = body.nextReview;
      plan.history = plan.history || [];
      plan.history.push({ at: now, by: actorId(auth), action: 'weekly_review', details: `مراجعة أسبوعية: تقدم ${body.progress}% — ${notes}` });
      audit(db,auth,'weekly_review','intervention_plan',plan.id,{progress:body.progress,current:plan.current}); saveDB(db);
      send(res,200,{plan}); return;
    }
    if (req.method==='POST' && pathname==='/api/teacher/intervention-plans/update') {
      const body = await parseBody(req);
      const plan = (db.interventionPlans||[]).find(p => p.id===body.id);
      if (!plan) { send(res,404,{error:'not_found'}); return; }
      if (!canTeacherAccessStudent(auth,db,plan.studentId)) { send(res,403,{error:'forbidden'}); return; }
      if (body.status !== undefined && !INTERVENTION_STATUSES.includes(body.status)) {
        send(res,400,{error:'validation_failed', field:'status'}); return;
      }
      if (body.status === 'closed' && !isNonEmptyString(body.reviewNotes)) {
        send(res,400,{error:'validation_failed', field:'reviewNotes'}); return;
      }
      if (body.target !== undefined && (typeof body.target !== 'number' || !Number.isFinite(body.target))) {
        send(res,400,{error:'validation_failed', field:'target'}); return;
      }
      if (body.nextReview !== undefined && !isValidDateValue(body.nextReview)) {
        send(res,400,{error:'validation_failed', field:'nextReview'}); return;
      }
      const now = new Date().toISOString();
      const closing = body.status === 'closed';
      if (body.status) plan.status = body.status;
      if (body.target !== undefined) plan.target = body.target;
      if (body.nextReview !== undefined) plan.nextReview = body.nextReview;
      if (closing) plan.closedAt = now;
      plan.history = plan.history || [];
      plan.history.push({
        at: now,
        by: actorId(auth),
        action: closing ? 'closed' : 'updated',
        details: closing ? `إغلاق الخطة: ${body.reviewNotes.trim()}` : 'تحديث يدوي للخطة'
      });
      audit(db,auth,closing?'close':'update','intervention_plan',plan.id,{status:plan.status}); saveDB(db);
      send(res,200,{plan}); return;
    }
    if (req.method==='GET' && pathname==='/api/teacher/search') {
      const q = (parsed.query.q || '').toLowerCase().trim();
      if (!q) { send(res,200,{results:[],total:0}); return; }
      const results = [];
      (db.students||[]).forEach(s => {
        if (!canTeacherAccessStudent(auth,db,s.id)) return;
        if (s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)) {
          const lvl = (db.levels||[]).find(l=>l.id===s.levelId);
          results.push({ type:'student', id:s.id, title:s.name, subtitle: lvl?lvl.name:'', relevance: s.name.toLowerCase().startsWith(q)?1:0.5 });
        }
      });
      (db.feedbackCards||[]).forEach(f => {
        if (!canTeacherAccessStudent(auth,db,f.studentId)) return;
        const st = (db.students||[]).find(s=>s.id===f.studentId);
        if ((st && st.name.toLowerCase().includes(q)) || (f.summary||'').toLowerCase().includes(q)) {
          results.push({ type:'feedback_card', id:f.id, title: (st?st.name:f.id), subtitle: f.summary||'', relevance: 0.5 });
        }
      });
      results.sort((a,b) => b.relevance - a.relevance);
      audit(db,auth,'search','scoped',q,{results:results.length}); saveDB(db);
      send(res,200,{results: results.slice(0,50), total: results.length, query: q}); return;
    }
    if (req.method==='GET' && pathname==='/api/teacher/competency-refs') {
      const level = parsed.query.level;
      const refs = (db.competencyReferences||[]).filter(r=>!level || r.level===level);
      send(res,200,{competencyReferences: refs}); return;
    }
    if (req.method==='POST' && pathname==='/api/teacher/grades/bulk') {
      const body = await parseBody(req);
      const entries = Array.isArray(body.entries) ? body.entries : [];
      // Validate required fields, types and ranges before any row is written.
      const checked = entries.map((e, index) => {
        const row = { index, studentId: e && e.studentId, ok: false };
        if (!e || typeof e !== 'object' || Array.isArray(e)) { row.error = 'invalid_row'; return row; }
        if (!isNonEmptyString(e.studentId)) { row.error = 'invalid_studentId'; row.field = 'studentId'; return row; }
        if (!canTeacherAccessStudent(auth, db, e.studentId)) { row.error = 'forbidden'; row.field = 'studentId'; return row; }
        if (!isNonEmptyString(e.subjectId)) { row.error = 'invalid_subjectId'; row.field = 'subjectId'; return row; }
        if (typeof e.score !== 'number' || !Number.isFinite(e.score)) { row.error = 'invalid_score'; row.field = 'score'; return row; }
        const scale = e.scale === undefined ? 20 : e.scale;
        if (typeof scale !== 'number' || !Number.isFinite(scale) || scale <= 0) { row.error = 'invalid_scale'; row.field = 'scale'; return row; }
        if (e.score < 0 || e.score > scale) { row.error = 'score_out_of_range'; row.field = 'score'; return row; }
        if (e.term !== undefined && !isNonEmptyString(e.term)) { row.error = 'invalid_term'; row.field = 'term'; return row; }
        row.ok = true; return row;
      });
      if (checked.some(r => !r.ok)) { bulkValidationFailed(res, entries.length, checked); return; }
      const results = [];
      for (const e of entries) {
        const grade = { id: 'g_bulk_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6), studentId: e.studentId, subjectId: e.subjectId, score: e.score, scale: e.scale === undefined ? 20 : e.scale, term: e.term || 'الفصل 1', teacherId: actorId(auth), createdAt: new Date().toISOString() };
        db.grades.push(grade);
        results.push({ studentId: e.studentId, ok: true, gradeId: grade.id });
      }
      audit(db, auth, 'bulk_create', 'grades', 'bulk', { count: entries.length, success: results.length });
      saveDB(db);
      send(res, 200, { results, total: entries.length, success: results.length }); return;
    }
    if (req.method === 'GET' && pathname === '/api/teacher/attendance') {
      const studentId = parsed.query.studentId;
      const date = parsed.query.date;
      const classId = parsed.query.classId;
      let items = (db.attendance || []);
      if (studentId) {
        if (!canTeacherAccessStudent(auth, db, studentId)) { send(res, 403, { error: 'forbidden' }); return; }
        items = items.filter(a => a.studentId === studentId);
      } else {
        items = items.filter(a => canTeacherAccessStudent(auth, db, a.studentId));
      }
      if (date) items = items.filter(a => a.date === date);
      if (classId) items = items.filter(a => a.classId === classId);
      send(res, 200, { attendance: items }); return;
    }
    if (req.method === 'POST' && pathname === '/api/teacher/attendance') {
      const body = await parseBody(req);
      const entries = Array.isArray(body.entries) ? body.entries : [];
      const valid = ['present', 'late', 'absent', 'excused'];
      const checked = entries.map((entry, index) => {
        const row = { index, studentId: entry && entry.studentId, ok: false };
        if (!entry || typeof entry !== 'object' || Array.isArray(entry)) { row.error = 'invalid_row'; return row; }
        if (!isNonEmptyString(entry.studentId)) { row.error = 'invalid_studentId'; row.field = 'studentId'; return row; }
        if (!canTeacherAccessStudent(auth, db, entry.studentId)) { row.error = 'forbidden'; row.field = 'studentId'; return row; }
        if (!valid.includes(entry.status)) { row.error = 'invalid_status'; row.field = 'status'; return row; }
        if (entry.date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) { row.error = 'invalid_date'; row.field = 'date'; return row; }
        row.ok = true; return row;
      });
      if (checked.some(r => !r.ok)) { bulkValidationFailed(res, entries.length, checked); return; }
      const results = [];
      for (const entry of entries) {
        const student = studentById(db, entry.studentId);
        const date = entry.date || new Date().toISOString().slice(0, 10);
        const existing = (db.attendance || []).find(a => a.studentId === entry.studentId && a.date === date);
        const record = existing || { id: 'att_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6), studentId: entry.studentId, classId: student?.classId, date };
        record.status = entry.status;
        record.note = entry.note || null;
        record.recordedBy = actorId(auth);
        if (!existing) { db.attendance = db.attendance || []; db.attendance.push(record); }
        results.push({ studentId: entry.studentId, ok: true, attendanceId: record.id, status: record.status });
      }
      audit(db, auth, 'bulk_create', 'attendance', 'bulk', { count: entries.length, success: results.length });
      saveDB(db);
      send(res, 200, { results, total: entries.length, success: results.length }); return;
    }
    if (req.method==='GET' && pathname==='/api/teacher/engagement') {
      const studentId = parsed.query.studentId;
      if (studentId && !canTeacherAccessStudent(auth, db, studentId)) { send(res,403,{error:'forbidden'}); return; }
      const students = studentId
        ? [studentById(db, studentId)].filter(Boolean)
        : (db.students||[]).filter(st=>canTeacherAccessStudent(auth, db, st.id));
      const rows = students.map((st)=>({
        studentId: st.id, name: st.name,
        engagement: engagementSummary(db, st.id),
        assignments: studentAssignments(db, st.id),
        lessons: lessonProgressSummary(db, st.id),
      }));
      send(res,200,{students: rows, note:'زمن المنصة والتقدم التفاعلي منفصلان عن حضور القسم.'}); return;
    }
    if (req.method==='GET' && pathname==='/api/teacher/curriculum') {
      const classIds = auth.scope?.classes || [];
      const levelIds = [...new Set((db.classes||[]).filter(c=>classIds.includes(c.id)).map(c=>c.levelId))];
      const levelId = parsed.query.levelId;
      if (levelId && !levelIds.includes(levelId)) { send(res,403,{error:'forbidden', message:'خارج نطاق مستويات المعلم'}); return; }
      const items = curriculumList(db, { levelId, term: parsed.query.term, subjectId: parsed.query.subjectId })
        .filter(item=>levelIds.includes(item.levelId));
      send(res,200,{items, terms: TERMS, subjects: db.subjects, levels: (db.levels||[]).filter(l=>levelIds.includes(l.id))}); return;
    }

    // --- Structured lesson editor (teacher, scoped to the teacher's levels) ---
    // Every route resolves the plan and verifies its levelId is inside the
    // teacher's level scope. Out-of-scope reads/writes are 403 (never a 404 leak).
    if (req.method === 'GET' && pathname === '/api/teacher/lesson-plans') {
      const levelIds = teacherLevelIds(auth, db);
      const filters = { levelId: parsed.query.levelId, subjectId: parsed.query.subjectId, term: parsed.query.term, status: parsed.query.status };
      if (filters.levelId && !levelIds.includes(filters.levelId)) { send(res,403,{error:'forbidden', message:'خارج نطاق مستويات المعلم'}); return; }
      const plans = lessonPlansFiltered(db, filters).filter((p) => levelIds.includes(p.levelId));
      audit(db, auth, 'read', 'lesson_plan', filters.levelId || 'scoped', { ...filters, count: plans.length }); saveDB(db);
      send(res, 200, { plans, meta: { statuses: LESSON_PLAN_STATUSES, terms: TERMS } }); return;
    }
    if (req.method === 'GET' && pathname === '/api/teacher/lesson-plans/view') {
      const plan = (db.lessonPlans || []).find((p) => p.id === parsed.query.id);
      if (!plan) { send(res,404,{error:'not_found'}); return; }
      if (!teacherLevelIds(auth, db).includes(plan.levelId)) { send(res,403,{error:'forbidden', message:'خارج نطاق مستويات المعلم'}); return; }
      audit(db, auth, 'read', 'lesson_plan', plan.id, { by: 'teacher' }); saveDB(db);
      send(res, 200, { plan: lessonPlanView(db, plan) }); return;
    }
    if (req.method === 'POST' && pathname === '/api/teacher/lesson-plans') {
      const body = await parseBody(req);
      const curriculum = (db.curriculum || []).find((c) => c.id === body.curriculumId);
      if (!curriculum) { send(res,404,{error:'not_found'}); return; }
      if (!teacherLevelIds(auth, db).includes(curriculum.levelId)) { send(res,403,{error:'forbidden', message:'خارج نطاق مستويات المعلم'}); return; }
      const checked = validateLessonPlanFields(body, false);
      if (checked.field) { send(res,400,{error:'validation_failed', field:checked.field}); return; }
      const v = checked.value;
      const now = new Date().toISOString();
      const plan = {
        id: lessonPlanId('lp'),
        curriculumId: curriculum.id,
        levelId: curriculum.levelId,
        subjectId: curriculum.subjectId,
        unit: curriculum.unit,
        lessonTitle: v.lessonTitle,
        term: v.term,
        status: 'draft',
        objectives: v.objectives,
        activities: v.activities,
        differentiation: v.differentiation,
        resources: v.resources,
        competencyIds: v.competencyIds || [],
        ownerId: actorId(auth),
        ownerRole: 'teacher',
        createdAt: now,
        updatedAt: now,
        publishedAt: null,
        reviewedBy: null,
        history: [{ at: now, by: actorId(auth), action: 'created', details: `خطة درس أنشأها المعلم: ${v.lessonTitle}` }],
      };
      db.lessonPlans = db.lessonPlans || [];
      db.lessonPlans.push(plan);
      audit(db, auth, 'create', 'lesson_plan', plan.id, { curriculumId: curriculum.id, levelId: curriculum.levelId, subjectId: curriculum.subjectId }); saveDB(db);
      send(res, 201, { plan: lessonPlanView(db, plan) }); return;
    }
    if (req.method === 'POST' && pathname === '/api/teacher/lesson-plans/update') {
      const body = await parseBody(req);
      const plan = (db.lessonPlans || []).find((p) => p.id === body.id);
      if (!plan) { send(res,404,{error:'not_found'}); return; }
      if (!teacherLevelIds(auth, db).includes(plan.levelId)) { send(res,403,{error:'forbidden', message:'خارج نطاق مستويات المعلم'}); return; }
      if (plan.status === 'published') { send(res,400,{error:'invalid_transition', message:'الخطة منشورة ولا يمكن تعديلها'}); return; }
      const checked = validateLessonPlanFields(body, true);
      if (checked.field) { send(res,400,{error:'validation_failed', field:checked.field}); return; }
      const v = checked.value;
      const fields = ['lessonTitle','objectives','activities','differentiation','resources','competencyIds'];
      const changed = fields.filter((f) => v[f] !== undefined);
      if (!changed.length) { send(res,400,{error:'validation_failed', field:'patch', message:'no editable fields'}); return; }
      changed.forEach((f) => { plan[f] = v[f]; });
      const now = new Date().toISOString();
      plan.updatedAt = now;
      plan.history = plan.history || [];
      plan.history.push({ at: now, by: actorId(auth), action: 'updated', details: `تحديث يدوي: ${changed.join('، ')}` });
      audit(db, auth, 'update', 'lesson_plan', plan.id, { fields: changed, status: plan.status }); saveDB(db);
      send(res, 200, { plan: lessonPlanView(db, plan) }); return;
    }
    if (req.method === 'POST' && pathname === '/api/teacher/lesson-plans/submit') {
      const body = await parseBody(req);
      const plan = (db.lessonPlans || []).find((p) => p.id === body.id);
      if (!plan) { send(res,404,{error:'not_found'}); return; }
      if (!teacherLevelIds(auth, db).includes(plan.levelId)) { send(res,403,{error:'forbidden', message:'خارج نطاق مستويات المعلم'}); return; }
      if (plan.status !== 'draft') { send(res,400,{error:'invalid_transition', message:'يمكن إرسال المسودات فقط للمراجعة'}); return; }
      const now = new Date().toISOString();
      plan.status = 'in_review';
      plan.updatedAt = now;
      plan.history = plan.history || [];
      plan.history.push({ at: now, by: actorId(auth), action: 'submitted', details: 'إرسال الخطة للمراجعة' });
      audit(db, auth, 'submit', 'lesson_plan', plan.id, { status: plan.status }); saveDB(db);
      send(res, 200, { plan: lessonPlanView(db, plan) }); return;
    }
    if (req.method==='GET' && pathname==='/api/teacher/report-card') {
      const sid = parsed.query.studentId;
      if (!sid || !canTeacherAccessStudent(auth,db,sid)) { send(res,403,{error:'forbidden', message:'خارج نطاق فصول المعلم'}); return; }
      const reportCard = computeReportCard(db, sid, parsed.query.term);
      audit(db,auth,'read','report_card',sid,{term:reportCard.term,by:'teacher'}); saveDB(db);
      send(res,200,{reportCard}); return;
    }
    if (req.method==='GET' && pathname==='/api/teacher/content-samples') {
      const level = parsed.query.level;
      const samples = (db.contentSamples||[]).filter(s=>!level || s.levelId===level);
      const items = (db.curriculum||[]).filter(c=>!level || c.levelId===level);
      send(res,200,{samples, items, languageConfig: db.languageConfig||{}}); return;
    }
    if (req.method==='GET' && pathname==='/api/teacher/assessments') {
      const sid = parsed.query.studentId;
      if (sid && !canTeacherAccessStudent(auth,db,sid)) { send(res,403,{error:'forbidden'}); return; }
      const items = (db.assessments||[]).filter(a=> sid ? a.studentId===sid : canTeacherAccessStudent(auth,db,a.studentId));
      send(res,200,{assessments: items}); return;
    }
    if (req.method==='POST' && pathname==='/api/teacher/assessments') {
      const body = await parseBody(req);
      if (!canTeacherAccessStudent(auth,db,body.studentId)) { send(res,403,{error:'forbidden'}); return; }
      const item = { id:'asmt_'+Date.now(), ...body, createdAt: new Date().toISOString(), createdBy: actorId(auth) };
      db.assessments = db.assessments || []; db.assessments.push(item);
      audit(db,auth,'create','assessment',item.id,{studentId:item.studentId,role:'teacher'}); saveDB(db);
      send(res,201,{assessment:item}); return;
    }

    // --- Question bank & formative assessments (teacher) ---
    if (req.method==='GET' && pathname==='/api/teacher/question-bank') {
      const levelIds = teacherLevelIds(auth, db);
      const includeArchived = parsed.query.includeArchived === 'true';
      let questions = (db.questionBank || []).filter(q => levelIds.includes(q.levelId));
      if (!includeArchived) questions = questions.filter(q => (q.status || 'active') !== 'archived');
      if (parsed.query.subjectId) questions = questions.filter(q => q.subjectId === parsed.query.subjectId);
      if (parsed.query.levelId) {
        if (!levelIds.includes(parsed.query.levelId)) { send(res,403,{error:'forbidden'}); return; }
        questions = questions.filter(q => q.levelId === parsed.query.levelId);
      }
      if (parsed.query.term) questions = questions.filter(q => q.term === parsed.query.term);
      if (parsed.query.difficulty) questions = questions.filter(q => q.difficulty === parsed.query.difficulty);
      if (parsed.query.search) {
        const needle = String(parsed.query.search).trim().toLowerCase();
        questions = questions.filter(q => (q.prompt || '').toLowerCase().includes(needle) || (q.skill || '').toLowerCase().includes(needle));
      }
      send(res,200, {
        questions: questions.map(q => questionView(db, q)),
        subjects: db.subjects || [],
        levels: (db.levels || []).filter(l => levelIds.includes(l.id)),
        terms: TERMS,
      }); return;
    }
    if (req.method==='POST' && pathname==='/api/teacher/question-bank') {
      const body = await parseBody(req);
      const levelIds = teacherLevelIds(auth, db);
      const options = normalizeQuestionOptions(body.options);
      const correctIndex = Number(body.correctIndex);
      if (!levelIds.includes(body.levelId) || !body.subjectId || !isNonEmptyString(body.prompt)
        || options.length < 2 || !Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
        send(res,400,{error:'validation_failed', message:'معطيات السؤال غير صالحة'}); return;
      }
      const q = {
        id: 'qb_' + Date.now() + '_' + Math.random().toString(36).slice(2,6),
        levelId: body.levelId, subjectId: body.subjectId,
        term: TERMS.includes(body.term) ? body.term : TERMS[0],
        difficulty: ['easy','medium','hard'].includes(body.difficulty) ? body.difficulty : 'medium',
        prompt: String(body.prompt).trim(), options, correctIndex,
        skill: String(body.skill || '').slice(0,200), explanation: String(body.explanation || '').slice(0,1000),
        status: 'active', createdAt: new Date().toISOString(), createdBy: actorId(auth),
      };
      db.questionBank = db.questionBank || []; db.questionBank.push(q);
      audit(db, auth, 'create', 'question', q.id, { subjectId: q.subjectId, levelId: q.levelId }); saveDB(db);
      send(res,201,{question: questionView(db, q)}); return;
    }
    if (req.method==='POST' && pathname==='/api/teacher/question-bank/update') {
      const body = await parseBody(req);
      const q = (db.questionBank || []).find(x => x.id === body.id);
      if (!q || !teacherLevelIds(auth, db).includes(q.levelId)) { send(res,404,{error:'not_found'}); return; }
      if (!['active','archived'].includes(body.status)) { send(res,400,{error:'validation_failed'}); return; }
      q.status = body.status;
      audit(db, auth, 'update', 'question', q.id, { status: q.status }); saveDB(db);
      send(res,200,{question: questionView(db, q)}); return;
    }
    if (req.method==='GET' && pathname==='/api/teacher/formative-assessments') {
      const levelIds = teacherLevelIds(auth, db);
      send(res,200, {
        assessments: (db.formativeAssessments || []).filter(f => levelIds.includes(f.levelId)).map(f => formativeView(db, f)),
        questions: (db.questionBank || []).filter(q => levelIds.includes(q.levelId) && (q.status || 'active') !== 'archived').map(q => questionView(db, q)),
      }); return;
    }
    if (req.method==='POST' && pathname==='/api/teacher/formative-assessments') {
      const body = await parseBody(req);
      const levelIds = teacherLevelIds(auth, db);
      const questionIds = Array.isArray(body.questionIds) ? body.questionIds.filter(Boolean) : [];
      const questions = (db.questionBank || []).filter(q => questionIds.includes(q.id)
        && levelIds.includes(q.levelId) && (q.status || 'active') !== 'archived' && q.subjectId === body.subjectId);
      if (!levelIds.includes(body.levelId) || !body.subjectId || !isNonEmptyString(body.title) || questions.length === 0) {
        send(res,400,{error:'validation_failed', message:'معطيات التقييم غير صالحة'}); return;
      }
      const f = {
        id: 'fa_' + Date.now() + '_' + Math.random().toString(36).slice(2,6),
        title: String(body.title).trim(), levelId: body.levelId, subjectId: body.subjectId,
        term: TERMS.includes(body.term) ? body.term : TERMS[0],
        questionIds: questions.map(q => q.id),
        status: body.status === 'published' ? 'published' : 'draft',
        createdAt: new Date().toISOString(), createdBy: actorId(auth),
      };
      db.formativeAssessments = db.formativeAssessments || []; db.formativeAssessments.push(f);
      audit(db, auth, 'create', 'formative_assessment', f.id, { subjectId: f.subjectId, levelId: f.levelId, status: f.status }); saveDB(db);
      send(res,201,{assessment: formativeView(db, f)}); return;
    }
    if (req.method==='POST' && pathname==='/api/teacher/formative-assessments/update') {
      const body = await parseBody(req);
      const f = (db.formativeAssessments || []).find(x => x.id === body.id);
      if (!f || !teacherLevelIds(auth, db).includes(f.levelId)) { send(res,404,{error:'not_found'}); return; }
      if (!['draft','published'].includes(body.status)) { send(res,400,{error:'validation_failed'}); return; }
      f.status = body.status;
      audit(db, auth, 'update', 'formative_assessment', f.id, { status: f.status }); saveDB(db);
      send(res,200,{assessment: formativeView(db, f)}); return;
    }
    if (req.method==='GET' && pathname.startsWith('/api/teacher/formative-assessments/') && pathname.endsWith('/analysis')) {
      const assessmentId = pathname.split('/')[4];
      const f = (db.formativeAssessments || []).find(x => x.id === assessmentId);
      if (!f || !teacherLevelIds(auth, db).includes(f.levelId)) { send(res,404,{error:'not_found'}); return; }
      send(res,200, { assessment: formativeView(db, f), attempts: attemptsFor(db, f.id).length, items: itemAnalysis(db, f) }); return;
    }
    if (req.method==='GET' && pathname==='/api/teacher/lesson-contents') {
      const levelIds = teacherLevelIds(auth, db);
      let contents = (db.lessonContents || []).filter(c => levelIds.includes(c.levelId));
      if (parsed.query.levelId) contents = contents.filter(c => c.levelId === parsed.query.levelId);
      audit(db, auth, 'read', 'lesson_content', parsed.query.levelId || 'all', { by:'teacher', count: contents.length }); saveDB(db);
      send(res, 200, { contents }); return;
    }

    if (req.method==='POST' && pathname==='/api/teacher/communications') {
      const body = await parseBody(req);
      if (body.studentId && !canTeacherAccessStudent(auth, db, body.studentId)) { send(res,403,{error:'forbidden'}); return; }
      const created = commService.createDraft(body, actorId(auth));
      if (!created.ok) { send(res,400,{error:created.error}); return; }
      db.communications = db.communications || [];
      db.drafts = db.drafts || [];
      if (created.draft) db.drafts.push(created.draft);
      db.communications.push(created.communication);
      audit(db, auth, 'create', 'communication', created.communication.id, { studentId: created.communication.studentId, channel: created.communication.channel });
      saveDB(db);
      send(res, 201, { ok: true, communication: created.communication, draft: created.draft }); return;
    }
    if (req.method==='GET' && pathname==='/api/teacher/communications') {
      const sid = parsed.query.studentId;
      let items = (db.communications||[]);
      if (sid) { if(!canTeacherAccessStudent(auth,db,sid)) { send(res,403,{error:'forbidden'}); return; } items = items.filter(c=>c.studentId===sid); }
      else items = items.filter(c=>!c.studentId || canTeacherAccessStudent(auth,db,c.studentId));
      send(res,200,{communications: items, drafts: db.drafts||[]}); return;
    }
    if (req.method==='POST' && pathname==='/api/teacher/communications/update') {
      const body = await parseBody(req);
      const c = (db.communications||[]).find(x=>x.id===body.id);
      if (!c) { send(res,404,{error:'not_found'}); return; }
      if (c.studentId && !canTeacherAccessStudent(auth,db,c.studentId)) { send(res,403,{error:'forbidden'}); return; }
      if (body.status) c.status = body.status;
      c.governance = c.governance || {requiresApproval:true};
      if (body.status==='approved') { c.governance.approvedBy = actorId(auth); c.governance.approvedAt = new Date().toISOString(); }
      if (body.status==='sent') {
        if (!c.governance.approvedBy) { send(res,400,{error:'governance', message:'يتطلب اعتمادًا قبل الإرسال'}); return; }
        c.sentAt = new Date().toISOString(); c.sentBy = actorId(auth);
      }
      if (body.notes !== undefined) c.notes = body.notes;
      c.updatedAt = new Date().toISOString();
      audit(db,auth,'update','communication',c.id,{status:c.status,role:'teacher'}); saveDB(db);
      send(res,200,{ok:true, communication:c}); return;
    }
    if (req.method==='GET' && pathname==='/api/teacher/alerts') {
      const today = new Date().toISOString().slice(0,10);
      const alerts = (db.alerts||[]).filter(a=>a.studentId ? canTeacherAccessStudent(auth,db,a.studentId) : false);
      (db.learningPaths||[]).forEach(p=>{ if (canTeacherAccessStudent(auth,db,p.studentId) && p.reassessDate && p.reassessDate <= today) alerts.push({kind:'reassessment', level:'warn', studentId:p.studentId, message:`إعادة تقييم مستحقة (${p.reassessDate})`}); });
      send(res,200,{alerts}); return;
    }
    if (req.method==='GET' && pathname==='/api/teacher/ml/gap-prediction') {
      const sid = parsed.query.studentId;
      if (sid && !canTeacherAccessStudent(auth,db,sid)) { send(res,403,{error:'forbidden'}); return; }
      if (sid) {
        const st = studentById(db, sid);
        if (!st) { send(res,404,{error:'not_found'}); return; }
        const risk = ml.predictGapRisk(st, db);
        const anomalies = ml.detectAnomalies(st, db);
        const recommendations = ml.generateRecommendations(st, db);
        send(res,200,{student: st.name, risk, anomalies, recommendations}); return;
      }
      const predictions = (db.students||[]).filter(s=>canTeacherAccessStudent(auth,db,s.id)).map(s => ({ id: s.id, name: s.name, ...ml.predictGapRisk(s, db) }));
      send(res,200,{predictions}); return;
    }
    if (req.method==='GET' && pathname==='/api/teacher/ml/early-warning') {
      const warnings = ml.earlyWarningSystem(db).filter(w => canTeacherAccessStudent(auth,db,w.studentId));
      send(res,200,{warnings, total: warnings.length }); return;
    }
    if (req.method==='GET' && pathname==='/api/teacher/impact-report') {
      const scopedStudents = (db.students||[]).filter(s=>canTeacherAccessStudent(auth,db,s.id));
      const report = analytics.impactReport(db);
      // filter to scoped
      report.reassessmentDue = report.reassessmentDue.filter(r=>canTeacherAccessStudent(auth,db,r.studentId));
      audit(db,auth,'read','impact_report','scoped',{}); saveDB(db);
      send(res,200,{report, scopedStudents: scopedStudents.length}); return;
    }
    if (req.method==='POST' && pathname==='/api/teacher/communications/send') {
      const body = await parseBody(req);
      const c = (db.communications||[]).find(x=>x.id===body.id);
      if (!c) { send(res,404,{error:'not_found'}); return; }
      if (c.studentId && !canTeacherAccessStudent(auth,db,c.studentId)) { send(res,403,{error:'forbidden'}); return; }
      const gate = commService.canSend(c);
      if (!gate.ok) { send(res,400,{error:'governance', reason:gate.reason}); return; }
      const addr = body.recipientAddress || 'parent@ryad.ma';
      const text = body.body || (db.drafts||[]).find(d=>d.id===c.draftId)?.body || c.notes || '';
      const result = await commService.sendCommunication(c, addr, text);
      if (result.ok) { c.status='sent'; c.sentAt=new Date().toISOString(); c.sentBy=actorId(auth); c.delivery=result; audit(db,auth,'send','communication',c.id,{channel:c.channel,role:'teacher'}); saveDB(db); send(res,200,{ok:true,communication:c,delivery:result}); return; }
      send(res,500,{error:'send_failed'}); return;
    }

    // --- Weekly school timetable (scoped to the teacher's classes) ---
    if (req.method === 'GET' && pathname === '/api/teacher/timetable') {
      const scopedClasses = auth.scope?.classes || [];
      if (parsed.query.classId && !scopedClasses.includes(parsed.query.classId)) { send(res,403,{error:'forbidden', message:'خارج نطاق فصول المعلم'}); return; }
      let slots = (db.timetable || []).filter(s => scopedClasses.includes(s.classId));
      if (parsed.query.classId) slots = slots.filter(s => s.classId === parsed.query.classId);
      if (parsed.query.day) slots = slots.filter(s => s.day === parsed.query.day);
      if (parsed.query.term) slots = slots.filter(s => (s.term || TERMS[0]) === parsed.query.term);
      const classes = (db.classes || []).filter(c => scopedClasses.includes(c.id));
      audit(db, auth, 'read', 'timetable', 'scoped', { classId: parsed.query.classId || null }); saveDB(db);
      send(res, 200, {
        slots: slots.map(s => timetableView(db, s, { view: 'class' })),
        meta: timetableMeta(db, 'teacher', classes),
      }); return;
    }

    // Two-way messaging (teacher side): class-scoped replies to parent threads,
    // gated by communication governance and the parent's privacy preference.
    if (req.method === 'GET' && pathname === '/api/teacher/threads') {
      const sid = parsed.query.studentId;
      if (sid && !canTeacherAccessStudent(auth, db, sid)) { send(res,403,{error:'forbidden'}); return; }
      let threads = (db.messageThreads || []).filter(t => canTeacherAccessStudent(auth, db, t.studentId));
      if (sid) threads = threads.filter(t => t.studentId === sid);
      const enriched = threads.map(t => messageThreadView(db, t));
      audit(db, auth, 'read', 'message_thread', sid || actorId(auth) || 'all', { by: 'teacher' }); saveDB(db);
      send(res, 200, { threads: enriched, meta: { statuses: ['open','closed'] } }); return;
    }
    if (req.method === 'POST' && pathname === '/api/teacher/threads/reply') {
      const body = await parseBody(req);
      const thread = (db.messageThreads || []).find(t => t.id === body.id);
      if (!thread) { send(res,404,{error:'not_found'}); return; }
      if (!canTeacherAccessStudent(auth, db, thread.studentId)) { send(res,403,{error:'forbidden'}); return; }
      if (thread.status === 'closed') { send(res,400,{error:'invalid_transition', message:'المحادثة مغلقة'}); return; }
      if (!isNonEmptyString(body.body)) { send(res,400,{error:'validation_failed', field:'body'}); return; }
      const comm = (db.communications || []).find(c => c.id === thread.communicationId);
      // Defensive fallback keeps a broken link from turning into a 500.
      const gate = comm ? commService.canSend(comm) : { ok: false, reason: 'communication_missing' };
      if (!gate.ok) {
        const reasonMessage = gate.reason === 'requires_approval' ? 'يتطلب اعتمادًا قبل الإرسال'
          : gate.reason === 'consent_pending' ? 'موافقة ولي الأمر معلقة'
          : gate.reason === 'consent_declined' ? 'تم رفض موافقة ولي الأمر'
          : 'غير مسموح بالإرسال لهذه المحادثة';
        send(res, 400, { error: 'governance', reason: gate.reason, message: reasonMessage }); return;
      }
      const parentId = thread.createdBy;
      if (parentId && (db.parentPreferences || {})[parentId]?.allowCommunications === false) {
        send(res, 400, { error: 'governance', reason: 'communications_disabled', message: 'أرسل ولي الأمر إشعارًا بتعطيل المراسلات' }); return;
      }
      const now = new Date().toISOString();
      thread.messages.push({ id: 'msg_'+Date.now()+'_'+Math.random().toString(36).slice(2,8), from: actorId(auth), fromRole: 'teacher', body: body.body.trim(), at: now });
      thread.lastActivityAt = now;
      // The in-app thread is the delivery channel itself: no mock provider call.
      comm.status = 'sent'; comm.sentAt = now; comm.sentBy = actorId(auth);
      audit(db, auth, 'reply', 'message_thread', thread.id, { role: 'teacher', caseId: thread.caseId, cardId: thread.cardId }); saveDB(db);
      send(res, 200, { thread }); return;
    }
    if (req.method === 'POST' && pathname === '/api/teacher/threads/close') {
      const body = await parseBody(req);
      const thread = (db.messageThreads || []).find(t => t.id === body.id);
      if (!thread) { send(res,404,{error:'not_found'}); return; }
      if (!canTeacherAccessStudent(auth, db, thread.studentId)) { send(res,403,{error:'forbidden'}); return; }
      if (thread.status === 'closed') { send(res,400,{error:'invalid_transition', message:'المحادثة مغلقة بالفعل'}); return; }
      const now = new Date().toISOString();
      thread.status = 'closed'; thread.lastActivityAt = now;
      audit(db, auth, 'close', 'message_thread', thread.id, { role: 'teacher' }); saveDB(db);
      send(res, 200, { thread }); return;
    }
    // ---- Moroccan primary grading (teacher: class-scoped entry workflow) ----
    if (req.method === 'GET' && pathname === '/api/teacher/grades/config') {
      audit(db, auth, 'read', 'grading_config', 'scoped', {}); saveDB(db);
      send(res, 200, { policy: gradingPolicy(db), subjects: db.subjects || [] }); return;
    }
    if (req.method === 'GET' && pathname === '/api/teacher/grades/entries') {
      const sid = parsed.query.studentId;
      const cycle = parsed.query.cycle;
      if (sid && !canTeacherAccessStudent(auth, db, sid)) { send(res,403,{error:'forbidden', message:'خارج نطاق فصول المعلم'}); return; }
      if (cycle && !['cycle1','cycle2'].includes(cycle)) { send(res,400,{error:'validation_failed', field:'cycle'}); return; }
      const entries = (db.gradeEntries || []).filter((e) =>
        (sid ? e.studentId === sid : canTeacherAccessStudent(auth, db, e.studentId))
        && (!cycle || normalizeGradeCycle(e) === cycle)).map((e) => gradeEntryView(db, e));
      audit(db, auth, 'read', 'grade_entry', sid || 'scoped', { cycle: cycle || null, count: entries.length }); saveDB(db);
      send(res, 200, { entries, meta: { cycles: ['cycle1','cycle2'], statuses: ['draft','submitted','approved'] } }); return;
    }
    if (req.method === 'POST' && pathname === '/api/teacher/grades/entries') {
      const body = await parseBody(req);
      if (!canTeacherAccessStudent(auth, db, body.studentId)) { send(res,403,{error:'forbidden', message:'خارج نطاق فصول المعلم'}); return; }
      const policy = gradingPolicy(db);
      if (body.subjectCoefficient === undefined && policy.subjectCoefficients
        && policy.subjectCoefficients[body.subjectId] !== undefined) {
        body.subjectCoefficient = policy.subjectCoefficients[body.subjectId];
      }
      const checked = validateGradeEntry(body, policy, {
        subjectIds: (db.subjects || []).map((s) => s.id), scale: policy.scale,
      });
      if (!checked.valid) { send(res,400,{error:'validation_failed', field: checked.field}); return; }
      const v = checked.value;
      const st = studentById(db, v.studentId);
      const now = new Date().toISOString();
      const entry = {
        id: 'gr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
        studentId: v.studentId,
        classId: st?.classId || '',
        term: v.cycle === 'cycle2' ? 'الفصل 2' : 'الفصل 1',
        cycle: v.cycle,
        year: '2025-2026',
        subjectId: v.subjectId,
        tests: v.tests,
        participationScore: v.participationScore,
        subjectCoefficient: v.subjectCoefficient,
        enteredBy: actorId(auth),
        enteredAt: now,
        status: 'draft',
        approvedBy: null,
        approvedAt: null,
      };
      db.gradeEntries = db.gradeEntries || [];
      db.gradeEntries.push(entry);
      const derived = gradeDerived(entry, policy);
      audit(db, auth, 'create', 'grade_entry', entry.id, { studentId: entry.studentId, subjectId: entry.subjectId, cycle: entry.cycle }); saveDB(db);
      send(res, 201, { entry, derived }); return;
    }
    if (req.method === 'POST' && pathname === '/api/teacher/grades/entries/update') {
      const body = await parseBody(req);
      const entry = (db.gradeEntries || []).find((e) => e.id === body.id);
      if (!entry) { send(res,404,{error:'not_found'}); return; }
      if (!canTeacherAccessStudent(auth, db, entry.studentId)) { send(res,403,{error:'forbidden', message:'خارج نطاق فصول المعلم'}); return; }
      if (entry.status !== 'draft') { send(res,400,{error:'invalid_transition'}); return; }
      const policy = gradingPolicy(db);
      const candidate = { ...entry };
      if (body.tests !== undefined) candidate.tests = body.tests;
      if (body.participationScore !== undefined) candidate.participationScore = body.participationScore;
      if (body.subjectCoefficient !== undefined) candidate.subjectCoefficient = body.subjectCoefficient;
      const checked = validateGradeEntry(candidate, policy, {
        subjectIds: (db.subjects || []).map((s) => s.id), scale: policy.scale,
      });
      if (!checked.valid) { send(res,400,{error:'validation_failed', field: checked.field}); return; }
      entry.tests = checked.value.tests;
      entry.participationScore = checked.value.participationScore;
      entry.subjectCoefficient = checked.value.subjectCoefficient;
      const derived = gradeDerived(entry, policy);
      audit(db, auth, 'update', 'grade_entry', entry.id, {
        fields: ['tests','participationScore','subjectCoefficient'].filter((f) => body[f] !== undefined),
      }); saveDB(db);
      send(res, 200, { entry, derived }); return;
    }
    if (req.method === 'POST' && pathname === '/api/teacher/grades/entries/submit') {
      const body = await parseBody(req);
      const entry = (db.gradeEntries || []).find((e) => e.id === body.id);
      if (!entry) { send(res,404,{error:'not_found'}); return; }
      if (!canTeacherAccessStudent(auth, db, entry.studentId)) { send(res,403,{error:'forbidden', message:'خارج نطاق فصول المعلم'}); return; }
      if (entry.status !== 'draft') { send(res,400,{error:'invalid_transition'}); return; }
      entry.status = 'submitted';
      audit(db, auth, 'submit', 'grade_entry', entry.id, { studentId: entry.studentId }); saveDB(db);
      send(res, 200, { entry }); return;
    }
    if (req.method === 'POST' && pathname === '/api/teacher/grades/compute') {
      const body = await parseBody(req);
      if (!canTeacherAccessStudent(auth, db, body.studentId)) { send(res,403,{error:'forbidden', message:'خارج نطاق فصول المعلم'}); return; }
      if (body.cycle && !['cycle1','cycle2'].includes(body.cycle)) { send(res,400,{error:'validation_failed', field:'cycle'}); return; }
      const policy = gradingPolicy(db);
      const result = computeStudentResult(gradeRecordFor(db, body.studentId, body.cycle, policy), policy);
      audit(db, auth, 'read', 'grade_result', body.studentId, { cycle: body.cycle || null }); saveDB(db);
      send(res, 200, { result }); return;
    }

    send(res,404,{error:'not_found'}); return;
  }

  // PARENT endpoints
  if (pathname.startsWith('/api/parent/')) {
    const auth = requireAuth(req,res); if(!auth) return;
    if (!requirePortal(auth,res,'private')) return;
    if (auth.role!=='parent') { send(res,403,{error:'forbidden'}); return; }

    if (req.method==='GET' && pathname==='/api/parent/engagement') {
      const entries = (db.engagementLog||[]).filter(e=>e.parentId===actorId(auth));
      send(res,200,{entries: entries.slice().reverse().slice(0,50), total: entries.length}); return;
    }

    if (req.method==='GET' && pathname==='/api/parent/children') {
      const kids = (auth.scope?.children||[]).map(id=>{ const st=studentById(db,id); const c=classById(db,st.classId); const l=levelById(db,st.levelId); return {id:st.id,name:st.name,level:l?.name,class:c?.name}; });
      send(res,200,{children:kids}); return;
    }
    if (req.method==='GET' && pathname==='/api/parent/child-report') {
      const sid = parsed.query.studentId;
      if (!canParentAccessStudent(auth,sid)) { send(res,403,{error:'forbidden', message:'يمكنك الوصول لتقارير أبنائك فقط (خصوصية)'}); return; }
      const report = computeStudentReport(db,sid);
      audit(db,auth,'read','child_report',sid,{by:'parent'}); saveDB(db);
      send(res,200,{report}); return;
    }
    if (req.method==='GET' && pathname==='/api/parent/child-report-card') {
      const sid = parsed.query.studentId;
      if (!sid || !canParentAccessStudent(auth,sid)) { send(res,403,{error:'forbidden', message:'يمكنك الوصول لبطاقات أبنائك فقط (خصوصية)'}); return; }
      const reportCard = computeReportCard(db, sid, parsed.query.term);
      audit(db,auth,'read','report_card',sid,{term:reportCard.term,by:'parent'}); saveDB(db);
      send(res,200,{reportCard}); return;
    }
    if (req.method==='GET' && pathname==='/api/parent/child-engagement') {
      const sid = parsed.query.studentId;
      if (!sid || !canParentAccessStudent(auth,sid)) { send(res,403,{error:'forbidden', message:'يمكنك الوصول لبيانات أبنائك فقط (خصوصية)'}); return; }
      send(res,200,{
        summary: engagementSummary(db,sid),
        assignments: studentAssignments(db,sid),
        lessons: lessonProgressSummary(db,sid),
        note:'زمن المنصة داخل الفضاء الموازي منفصل عن حضور القسم.'
      }); return;
    }
    if (req.method==='GET' && pathname==='/api/parent/child-insights') {
      const sid = parsed.query.studentId;
      if (!canParentAccessStudent(auth,sid)) { send(res,403,{error:'forbidden', message:'يمكنك الوصول لبيانات أبنائك فقط (خصوصية)'}); return; }
      const insights = computeStudentInsights(db,sid);
      audit(db,auth,'read','child_insights',sid,{by:'parent'}); saveDB(db);
      send(res,200,{insights}); return;
    }
    if (req.method==='GET' && pathname==='/api/parent/child-content') {
      const sid = parsed.query.studentId;
      if (!canParentAccessStudent(auth,sid)) { send(res,403,{error:'forbidden', message:'يمكنك الوصول لبيانات أبنائك فقط (خصوصية)'}); return; }
      const st = studentById(db,sid);
      const items = (db.curriculum||[]).filter(c=>c.levelId===st.levelId && c.status==='published').map(c=>({...c, subject: db.subjects.find(s=>s.id===c.subjectId)?.name}));
      send(res,200,{level: levelById(db,st.levelId)?.name, items, languageConfig: db.languageConfig||{}}); return;
    }
    if (req.method==='GET' && pathname==='/api/parent/dashboard') {
      const children = (auth.scope?.children || []).map(id => {
        const st = studentById(db, id);
        const cls = classById(db, st?.classId);
        const lvl = levelById(db, st?.levelId);
        const report = computeStudentReport(db, id);
        const insights = computeStudentInsights(db, id);
        const caseFile = (db.cases||[]).find(c=>c.studentId===id);
        const feedbackCards = (db.feedbackCards||[]).filter(c=>c.studentId===id);
        const talents = (db.talents||[]).filter(t=>t.studentId===id);
        return { id, name: st?.name, level: lvl?.name, class: cls?.name, attendance: report?.attendance, average: report?.average, classification: insights?.classification, gaps: insights?.gaps?.length || 0, talents: insights?.talents?.length || 0, nextReview: insights?.learningPath?.reassessDate, caseStatus: caseFile?.status, feedbackCards: feedbackCards.length, talentDomains: talents.map(t=>t.domain), interventions: (db.interventions||[]).filter(i=>i.studentId===id).length };
      });
      audit(db, auth, 'read', 'parent_dashboard', 'all', {}); saveDB(db);
      send(res, 200, { children }); return;
    }
    // Parent: notifications for their children
    if (req.method==='GET' && pathname==='/api/parent/notifications') {
      const alerts = (db.alerts||[]).filter(a => (auth.scope?.children||[]).includes(a.studentId));
      const due = [];
      (db.learningPaths||[]).forEach(p => { if ((auth.scope?.children||[]).includes(p.studentId) && p.reassessDate) due.push({ type:'reassessment', studentId: p.studentId, due: p.reassessDate, message: 'إعادة تقييم مسار التعلم' }); });
      (db.feedbackCards||[]).forEach(f => { if ((auth.scope?.children||[]).includes(f.studentId) && f.nextReview && !['completed','rejected'].includes(f.status)) due.push({ type:'feedback_review', id: f.id, studentId: f.studentId, due: f.nextReview, message: 'مراجعة بطاقة تغذية راجعة' }); });
      send(res, 200, { alerts, due, total: alerts.length + due.length }); return;
    }
    // Parent: child activities
    if (req.method==='GET' && pathname==='/api/parent/child-activities') {
      const sid = parsed.query.studentId;
      if (!canParentAccessStudent(auth, sid)) { send(res,403,{error:'forbidden'}); return; }
      const st = studentById(db, sid);
      const acts = (db.activities||[]).filter(a => a.audience === 'all' || a.outreach);
      const enrolled = (db.activityEnrollments||[]).filter(e => e.studentId === sid);
      send(res, 200, { activities: acts, enrolled, studentName: st?.name }); return;
    }
    // Parent: child case timeline
    if (req.method==='GET' && pathname==='/api/parent/child-case') {
      const sid = parsed.query.studentId;
      if (!canParentAccessStudent(auth, sid)) { send(res,403,{error:'forbidden'}); return; }
      const caseFile = (db.cases||[]).find(c => c.studentId === sid);
      send(res, 200, { case: caseFile || null }); return;
    }
    // Parent: child talents
    if (req.method==='GET' && pathname==='/api/parent/child-talents') {
      const sid = parsed.query.studentId;
      if (!canParentAccessStudent(auth, sid)) { send(res,403,{error:'forbidden'}); return; }
      const talents = (db.talents||[]).filter(t => t.studentId === sid);
      send(res, 200, { talents }); return;
    }
    // Parent: child assessments
    if (req.method==='GET' && pathname==='/api/parent/child-assessments') {
      const sid = parsed.query.studentId;
      if (!canParentAccessStudent(auth, sid)) { send(res,403,{error:'forbidden'}); return; }
      const assessments = (db.assessments||[]).filter(a => a.studentId === sid);
      send(res, 200, { assessments }); return;
    }
    // Parent: engagement tracking
    if (req.method==='POST' && pathname==='/api/parent/engagement') {
      const body = await parseBody(req);
      const entry = { id: 'eng_' + Date.now(), parentId: auth.sub, action: body.action || 'view', studentId: body.studentId, at: new Date().toISOString() };
      db.engagementLog = db.engagementLog || [];
      db.engagementLog.push(entry);
      audit(db, auth, 'engagement', 'parent', auth.sub, { action: body.action, studentId: body.studentId });
      saveDB(db);
      send(res, 200, { ok: true, entry }); return;
    }
    if (req.method==='GET' && pathname==='/api/parent/dashboard') {
      const children = (auth.scope?.children || []).map(id => {
        const st = studentById(db, id);
        const cls = classById(db, st?.classId);
        const lvl = levelById(db, st?.levelId);
        const report = computeStudentReport(db, id);
        const insights = computeStudentInsights(db, id);
        const caseFile = (db.cases||[]).find(c=>c.studentId===id);
        const feedbackCards = (db.feedbackCards||[]).filter(c=>c.studentId===id);
        const talents = (db.talents||[]).filter(t=>t.studentId===id);
        return { id, name: st?.name, level: lvl?.name, class: cls?.name, attendance: report?.attendance, average: report?.average, classification: insights?.classification, gaps: insights?.gaps?.length || 0, talents: insights?.talents?.length || 0, nextReview: insights?.learningPath?.reassessDate, caseStatus: caseFile?.status, feedbackCards: feedbackCards.length, talentDomains: talents.map(t=>t.domain), interventions: (db.interventions||[]).filter(i=>i.studentId===id).length };
      });
      audit(db, auth, 'read', 'parent_dashboard', 'all', {}); saveDB(db);
      send(res, 200, { children }); return;
    }
    // Parent: notifications for their children
    if (req.method==='GET' && pathname==='/api/parent/notifications') {
      const alerts = (db.alerts||[]).filter(a => (auth.scope?.children||[]).includes(a.studentId));
      const due = [];
      (db.learningPaths||[]).forEach(p => { if ((auth.scope?.children||[]).includes(p.studentId) && p.reassessDate) due.push({ type:'reassessment', studentId: p.studentId, due: p.reassessDate, message: 'إعادة تقييم مسار التعلم' }); });
      (db.feedbackCards||[]).forEach(f => { if ((auth.scope?.children||[]).includes(f.studentId) && f.nextReview && !['completed','rejected'].includes(f.status)) due.push({ type:'feedback_review', id: f.id, studentId: f.studentId, due: f.nextReview, message: 'مراجعة بطاقة تغذية راجعة' }); });
      send(res, 200, { alerts, due, total: alerts.length + due.length }); return;
    }
    // Parent: child activities
    if (req.method==='GET' && pathname==='/api/parent/child-activities') {
      const sid = parsed.query.studentId;
      if (!canParentAccessStudent(auth, sid)) { send(res,403,{error:'forbidden'}); return; }
      const st = studentById(db, sid);
      const acts = (db.activities||[]).filter(a => a.audience === 'all' || a.outreach);
      const enrolled = (db.activityEnrollments||[]).filter(e => e.studentId === sid);
      send(res, 200, { activities: acts, enrolled, studentName: st?.name }); return;
    }
    // Parent: child case timeline
    if (req.method==='GET' && pathname==='/api/parent/child-case') {
      const sid = parsed.query.studentId;
      if (!canParentAccessStudent(auth, sid)) { send(res,403,{error:'forbidden'}); return; }
      const caseFile = (db.cases||[]).find(c => c.studentId === sid);
      send(res, 200, { case: caseFile || null }); return;
    }
    // Parent: child talents
    if (req.method==='GET' && pathname==='/api/parent/child-talents') {
      const sid = parsed.query.studentId;
      if (!canParentAccessStudent(auth, sid)) { send(res,403,{error:'forbidden'}); return; }
      const talents = (db.talents||[]).filter(t => t.studentId === sid);
      send(res, 200, { talents }); return;
    }
    // Parent: child assessments
    if (req.method==='GET' && pathname==='/api/parent/child-assessments') {
      const sid = parsed.query.studentId;
      if (!canParentAccessStudent(auth, sid)) { send(res,403,{error:'forbidden'}); return; }
      const assessments = (db.assessments||[]).filter(a => a.studentId === sid);
      send(res, 200, { assessments }); return;
    }
    // Parent: engagement tracking
    if (req.method==='POST' && pathname==='/api/parent/engagement') {
      const body = await parseBody(req);
      const entry = { id: 'eng_' + Date.now(), parentId: auth.sub, action: body.action || 'view', studentId: body.studentId, at: new Date().toISOString() };
      db.engagementLog = db.engagementLog || [];
      db.engagementLog.push(entry);
      audit(db, auth, 'engagement', 'parent', auth.sub, { action: body.action, studentId: body.studentId });
      saveDB(db);
      send(res, 200, { ok: true, entry }); return;
    }
    if (req.method==='GET' && pathname==='/api/parent/dashboard') {
      const children = (auth.scope?.children || []).map(id => {
        const st = studentById(db, id);
        const cls = classById(db, st?.classId);
        const lvl = levelById(db, st?.levelId);
        const report = computeStudentReport(db, id);
        const insights = computeStudentInsights(db, id);
        const caseFile = (db.cases||[]).find(c=>c.studentId===id);
        const feedbackCards = (db.feedbackCards||[]).filter(c=>c.studentId===id);
        const talents = (db.talents||[]).filter(t=>t.studentId===id);
        return { id, name: st?.name, level: lvl?.name, class: cls?.name, attendance: report?.attendance, average: report?.average, classification: insights?.classification, gaps: insights?.gaps?.length || 0, talents: insights?.talents?.length || 0, nextReview: insights?.learningPath?.reassessDate, caseStatus: caseFile?.status, feedbackCards: feedbackCards.length, talentDomains: talents.map(t=>t.domain), interventions: (db.interventions||[]).filter(i=>i.studentId===id).length };
      });
      audit(db, auth, 'read', 'parent_dashboard', 'all', {}); saveDB(db);
      send(res, 200, { children }); return;
    }
    // Parent: notifications for their children
    if (req.method==='GET' && pathname==='/api/parent/notifications') {
      const alerts = (db.alerts||[]).filter(a => (auth.scope?.children||[]).includes(a.studentId));
      const due = [];
      (db.learningPaths||[]).forEach(p => { if ((auth.scope?.children||[]).includes(p.studentId) && p.reassessDate) due.push({ type:'reassessment', studentId: p.studentId, due: p.reassessDate, message: 'إعادة تقييم مسار التعلم' }); });
      (db.feedbackCards||[]).forEach(f => { if ((auth.scope?.children||[]).includes(f.studentId) && f.nextReview && !['completed','rejected'].includes(f.status)) due.push({ type:'feedback_review', id: f.id, studentId: f.studentId, due: f.nextReview, message: 'مراجعة بطاقة تغذية راجعة' }); });
      send(res, 200, { alerts, due, total: alerts.length + due.length }); return;
    }
    // Parent: child activities
    if (req.method==='GET' && pathname==='/api/parent/child-activities') {
      const sid = parsed.query.studentId;
      if (!canParentAccessStudent(auth, sid)) { send(res,403,{error:'forbidden'}); return; }
      const st = studentById(db, sid);
      const acts = (db.activities||[]).filter(a => a.audience === 'all' || a.outreach);
      const enrolled = (db.activityEnrollments||[]).filter(e => e.studentId === sid);
      send(res, 200, { activities: acts, enrolled, studentName: st?.name }); return;
    }
    // Parent: child case timeline
    if (req.method==='GET' && pathname==='/api/parent/child-case') {
      const sid = parsed.query.studentId;
      if (!canParentAccessStudent(auth, sid)) { send(res,403,{error:'forbidden'}); return; }
      const caseFile = (db.cases||[]).find(c => c.studentId === sid);
      send(res, 200, { case: caseFile || null }); return;
    }
    // Parent: child talents
    if (req.method==='GET' && pathname==='/api/parent/child-talents') {
      const sid = parsed.query.studentId;
      if (!canParentAccessStudent(auth, sid)) { send(res,403,{error:'forbidden'}); return; }
      const talents = (db.talents||[]).filter(t => t.studentId === sid);
      send(res, 200, { talents }); return;
    }
    // Parent: child assessments
    if (req.method==='GET' && pathname==='/api/parent/child-assessments') {
      const sid = parsed.query.studentId;
      if (!canParentAccessStudent(auth, sid)) { send(res,403,{error:'forbidden'}); return; }
      const assessments = (db.assessments||[]).filter(a => a.studentId === sid);
      send(res, 200, { assessments }); return;
    }
    // Parent: engagement tracking
    if (req.method==='POST' && pathname==='/api/parent/engagement') {
      const body = await parseBody(req);
      const entry = { id: 'eng_' + Date.now(), parentId: auth.sub, action: body.action || 'view', studentId: body.studentId, at: new Date().toISOString() };
      db.engagementLog = db.engagementLog || [];
      db.engagementLog.push(entry);
      audit(db, auth, 'engagement', 'parent', auth.sub, { action: body.action, studentId: body.studentId });
      saveDB(db);
      send(res, 200, { ok: true, entry }); return;
    }

    // --- Weekly school timetable (scoped to the parent's children) ---
    if (req.method === 'GET' && pathname === '/api/parent/timetable') {
      const childId = parsed.query.childId;
      if (childId && !canParentAccessStudent(auth, childId)) { send(res,403,{error:'forbidden', message:'يمكنك الوصول لجدول أبنائك فقط (خصوصية)'}); return; }
      const children = (childId ? [studentById(db, childId)] : (auth.scope?.children || []).map(id => studentById(db, id))).filter(Boolean);
      const classIds = [...new Set(children.map(st => st.classId).filter(Boolean))];
      let slots = (db.timetable || []).filter(s => classIds.includes(s.classId));
      if (parsed.query.day) slots = slots.filter(s => s.day === parsed.query.day);
      if (parsed.query.term) slots = slots.filter(s => (s.term || TERMS[0]) === parsed.query.term);
      const classes = (db.classes || []).filter(c => classIds.includes(c.id));
      audit(db, auth, 'read', 'timetable', childId || 'scoped', { childId: childId || null }); saveDB(db);
      send(res, 200, {
        slots: slots.map(s => timetableView(db, s, {
          view: 'student',
          studentId: childId || children.find(st => st.classId === s.classId)?.id || '',
        })),
        meta: timetableMeta(db, 'parent', classes),
      }); return;
    }

    // --- Family approval & privacy center (advisory only, parent decides) ---
    if (req.method === 'GET' && pathname === '/api/parent/requests') {
      const sid = parsed.query.studentId;
      if (sid && !canParentAccessStudent(auth, sid)) { send(res,403,{error:'forbidden', message:'يمكنك الوصول لطلبات أبنائك فقط (خصوصية)'}); return; }
      let rows = (db.parentRequests || []).filter(r => canParentAccessStudent(auth, r.studentId));
      if (sid) rows = rows.filter(r => r.studentId === sid);
      if (parsed.query.status) rows = rows.filter(r => r.status === parsed.query.status);
      audit(db, auth, 'read', 'parent_request', 'all', {}); saveDB(db);
      send(res, 200, {
        requests: rows.map(r => parentRequestView(db, r)),
        meta: { statuses: ['pending','approved','declined','acknowledged'], types: ['consent','acknowledgement','privacy'] },
      }); return;
    }
    if (req.method === 'POST' && pathname === '/api/parent/requests/decide') {
      const body = await parseBody(req);
      const decisions = ['approved','declined','acknowledged'];
      if (!body.id || !decisions.includes(body.decision)) { send(res,400,{error:'validation_failed', field: decisions.includes(body.decision) ? 'id' : 'decision'}); return; }
      const row = (db.parentRequests || []).find(r => r.id === body.id);
      if (!row) { send(res,404,{error:'not_found'}); return; }
      if (!canParentAccessStudent(auth, row.studentId)) { send(res,403,{error:'forbidden', message:'يمكنك البتّ في طلبات أبنائك فقط (خصوصية)'}); return; }
      if (row.status !== 'pending') { send(res,400,{error:'invalid_transition'}); return; }
      const now = new Date().toISOString();
      row.status = body.decision;
      row.decidedAt = now;
      row.decidedBy = actorId(auth);
      row.decisionNote = body.note || '';
      if (row.entityType === 'communication') {
        const communication = (db.communications || []).find(c => c.id === row.entityId);
        if (communication) {
          communication.governance = communication.governance || {};
          if (body.decision === 'approved') communication.governance.consent = 'granted';
          if (body.decision === 'declined') communication.governance.consent = 'declined';
          communication.governance.parentDecision = body.decision;
          communication.governance.parentDecidedAt = now;
          communication.governance.parentDecidedBy = actorId(auth);
        }
      }
      audit(db, auth, 'decide', 'parent_request', row.id, { decision: body.decision, entityType: row.entityType }); saveDB(db);
      send(res, 200, { request: parentRequestView(db, row) }); return;
    }
    if (req.method === 'GET' && pathname === '/api/parent/privacy') {
      const sid = parsed.query.studentId;
      if (sid && !canParentAccessStudent(auth, sid)) { send(res,403,{error:'forbidden', message:'يمكنك الوصول لبيانات الخصوصية الخاصة بأبنائك فقط (خصوصية)'}); return; }
      const defaults = { allowAnalytics: true, allowCommunications: true, language: 'ar', updatedAt: null, updatedBy: null };
      const preferences = { ...defaults, ...((db.parentPreferences || {})[actorId(auth)] || {}) };
      const policy = db.retentionPolicy || {};
      const sources = [
        { key: 'attendance', label: 'حضور القسم', purpose: 'يُسجَّل الحضور والغياب والتأخر داخل القسم من طرف المعلّم.', retentionDays: policy.auditDays ?? 365, separate: true },
        { key: 'platform_time', label: 'زمن المنصة الموازية', purpose: 'فضاء تعلّم اختياري موازٍ، يُقاس منفصلًا عن حضور القسم.', retentionDays: policy.sessionsDays ?? 30, separate: true },
        { key: 'assessments', label: 'التقييمات التكوينية', purpose: 'محاولات تدريبية استرشادية لا تُدرج في بطاقة التقرير.', retentionDays: policy.auditDays ?? 365, separate: false },
        { key: 'communications', label: 'المراسلات', purpose: 'مراسلات تربوية تخضع لموافقة ولي الأمر والحوكمة.', retentionDays: policy.communicationsDays ?? 365, separate: false },
      ];
      const recentAudit = (db.auditLogs || [])
        .filter(log => log.actorId === actorId(auth))
        .slice(-10)
        .map(log => ({ id: log.id, action: log.action, entityType: log.entityType, entityId: log.entityId, at: log.at }));
      audit(db, auth, 'read', 'parent_privacy', actorId(auth) || 'all', {}); saveDB(db);
      send(res, 200, { preferences, policy, sources, audit: recentAudit }); return;
    }
    if (req.method === 'POST' && pathname === '/api/parent/privacy/preferences') {
      const body = await parseBody(req);
      if (body.allowAnalytics !== undefined && typeof body.allowAnalytics !== 'boolean') { send(res,400,{error:'validation_failed', field:'allowAnalytics'}); return; }
      if (body.allowCommunications !== undefined && typeof body.allowCommunications !== 'boolean') { send(res,400,{error:'validation_failed', field:'allowCommunications'}); return; }
      if (body.language !== undefined && !['ar','fr','en','amz'].includes(body.language)) { send(res,400,{error:'validation_failed', field:'language'}); return; }
      db.parentPreferences = db.parentPreferences || {};
      const id = actorId(auth);
      const previous = { allowAnalytics: true, allowCommunications: true, language: 'ar', updatedAt: null, updatedBy: null, ...(db.parentPreferences[id] || {}) };
      const preferences = {
        ...previous,
        ...(body.allowAnalytics !== undefined ? { allowAnalytics: body.allowAnalytics } : {}),
        ...(body.allowCommunications !== undefined ? { allowCommunications: body.allowCommunications } : {}),
        ...(body.language !== undefined ? { language: body.language } : {}),
        updatedAt: new Date().toISOString(),
        updatedBy: id,
      };
      db.parentPreferences[id] = preferences;
      audit(db, auth, 'update', 'parent_preferences', id, { allowAnalytics: preferences.allowAnalytics, allowCommunications: preferences.allowCommunications, language: preferences.language }); saveDB(db);
      send(res, 200, { preferences }); return;
    }
    if (req.method === 'GET' && pathname === '/api/parent/weekly-summary') {
      const sid = parsed.query.studentId || (auth.scope?.children || [])[0];
      if (!sid || !canParentAccessStudent(auth, sid)) { send(res,403,{error:'forbidden', message:'يمكنك الوصول لملخّص أبنائك فقط (خصوصية)'}); return; }
      const summary = weeklySummaryFor(db, sid);
      audit(db, auth, 'read', 'weekly_summary', sid, {}); saveDB(db);
      send(res, 200, { summary }); return;
    }

    // Two-way messaging: a parent opens one thread per child, optionally linked
    // to that child's case and/or feedback card. Human-only and fully audited.
    if (req.method === 'GET' && pathname === '/api/parent/threads') {
      const sid = parsed.query.studentId;
      if (sid && !canParentAccessStudent(auth, sid)) { send(res,403,{error:'forbidden', message:'يمكنك الوصول لمحادثات أبنائك فقط (خصوصية)'}); return; }
      let threads = (db.messageThreads || []).slice();
      if (sid) threads = threads.filter(t => t.studentId === sid);
      else threads = threads.filter(t => canParentAccessStudent(auth, t.studentId));
      const enriched = threads.map(t => messageThreadView(db, t));
      audit(db, auth, 'read', 'message_thread', sid || actorId(auth) || 'all', { by: 'parent' }); saveDB(db);
      send(res, 200, { threads: enriched, meta: { statuses: ['open','closed'] } }); return;
    }
    if (req.method === 'POST' && pathname === '/api/parent/threads') {
      const body = await parseBody(req);
      if (!canParentAccessStudent(auth, body.studentId)) { send(res,403,{error:'forbidden', message:'يمكنك فتح محادثة لأبنائك فقط (خصوصية)'}); return; }
      if (!isNonEmptyString(body.subject)) { send(res,400,{error:'validation_failed', field:'subject'}); return; }
      if (!isNonEmptyString(body.body)) { send(res,400,{error:'validation_failed', field:'body'}); return; }
      if (body.caseId) {
        const linkedCase = (db.cases || []).find(c => c.id === body.caseId);
        if (!linkedCase || linkedCase.studentId !== body.studentId) { send(res,400,{error:'invalid_reference', field:'caseId'}); return; }
      }
      if (body.cardId) {
        const card = (db.feedbackCards || []).find(c => c.id === body.cardId);
        if (!card || card.studentId !== body.studentId) { send(res,400,{error:'invalid_reference', field:'cardId'}); return; }
      }
      const now = new Date().toISOString();
      const by = actorId(auth);
      // A parent-initiated in-app thread is itself explicit consent: the linked
      // communication is born approved and needs no separate human approval.
      const created = commService.createDraft({ studentId: body.studentId, type: 'parent_message', channel: 'in_app', subject: body.subject.trim() }, by);
      if (!created.ok) { send(res,400,{error:created.error}); return; }
      const comm = created.communication;
      comm.governance = { requiresApproval: false, consent: 'granted', initiator: 'parent', parentInitiatedAt: now };
      comm.status = 'approved';
      db.communications = db.communications || [];
      db.drafts = db.drafts || [];
      if (created.draft) db.drafts.push(created.draft);
      db.communications.push(comm);
      const thread = {
        id: 'mt_'+Date.now()+'_'+Math.random().toString(36).slice(2,8),
        studentId: body.studentId,
        classId: studentById(db, body.studentId)?.classId || null,
        caseId: body.caseId || null,
        cardId: body.cardId || null,
        subject: body.subject.trim(),
        status: 'open',
        createdAt: now,
        createdBy: by,
        createdByRole: 'parent',
        lastActivityAt: now,
        communicationId: comm.id,
        governance: { requiresApproval: false, consent: 'granted', initiator: 'parent', parentInitiatedAt: now },
        messages: [{ id: 'msg_'+Date.now()+'_'+Math.random().toString(36).slice(2,8), from: by, fromRole: 'parent', body: body.body.trim(), at: now }],
      };
      db.messageThreads = db.messageThreads || [];
      db.messageThreads.push(thread);
      audit(db, auth, 'create', 'message_thread', thread.id, { studentId: thread.studentId, caseId: thread.caseId, cardId: thread.cardId, channel: 'in_app', initiator: 'parent' });
      saveDB(db);
      send(res, 201, { thread }); return;
    }
    if (req.method === 'POST' && pathname === '/api/parent/threads/reply') {
      const body = await parseBody(req);
      const thread = (db.messageThreads || []).find(t => t.id === body.id);
      if (!thread) { send(res,404,{error:'not_found'}); return; }
      if (!canParentAccessStudent(auth, thread.studentId)) { send(res,403,{error:'forbidden', message:'خصوصية: هذه المحادثة ليست لأبنائك'}); return; }
      if (thread.status === 'closed') { send(res,400,{error:'invalid_transition', message:'المحادثة مغلقة'}); return; }
      if (!isNonEmptyString(body.body)) { send(res,400,{error:'validation_failed', field:'body'}); return; }
      const now = new Date().toISOString();
      thread.messages.push({ id: 'msg_'+Date.now()+'_'+Math.random().toString(36).slice(2,8), from: actorId(auth), fromRole: 'parent', body: body.body.trim(), at: now });
      thread.lastActivityAt = now;
      audit(db, auth, 'reply', 'message_thread', thread.id, { role: 'parent' }); saveDB(db);
      send(res, 200, { thread }); return;
    }
    if (req.method === 'POST' && pathname === '/api/parent/threads/close') {
      const body = await parseBody(req);
      const thread = (db.messageThreads || []).find(t => t.id === body.id);
      if (!thread) { send(res,404,{error:'not_found'}); return; }
      if (!canParentAccessStudent(auth, thread.studentId)) { send(res,403,{error:'forbidden', message:'خصوصية: هذه المحادثة ليست لأبنائك'}); return; }
      if (thread.status === 'closed') { send(res,400,{error:'invalid_transition', message:'المحادثة مغلقة بالفعل'}); return; }
      const now = new Date().toISOString();
      thread.status = 'closed'; thread.lastActivityAt = now;
      audit(db, auth, 'close', 'message_thread', thread.id, { role: 'parent' }); saveDB(db);
      send(res, 200, { thread }); return;
    }
    send(res,404,{error:'not_found'}); return;
  }

  // STUDENT endpoints
  if (pathname.startsWith('/api/student/')) {
    const auth = requireAuth(req,res); if(!auth) return;
    if (!requirePortal(auth,res,'private')) return;
    if (auth.role!=='student') { send(res,403,{error:'forbidden'}); return; }
    const sid = auth.scope?.studentId;
    if (req.method==='GET' && pathname==='/api/student/profile') {
      send(res,200,{report: computeStudentReport(db,sid)}); return;
    }
    if (req.method==='GET' && pathname==='/api/student/insights') {
      const insights = computeStudentInsights(db,sid);
      audit(db,auth,'read','student_insights',sid,{by:'student'}); saveDB(db);
      send(res,200,{insights}); return;
    }
    if (req.method==='GET' && pathname==='/api/student/curriculum') {
      const st = studentById(db,sid);
      const items = db.curriculum.filter(c=>c.levelId===st.levelId && c.status==='published').map(c=>({...c, subject: db.subjects.find(s=>s.id===c.subjectId)?.name}));
      send(res,200,{level: levelById(db,st.levelId)?.name, items, subjects: db.subjects, languageConfig: db.languageConfig||{}}); return;
    }
    if (req.method==='GET' && pathname==='/api/student/content') {
      const st = studentById(db,sid);
      const lvl = levelById(db,st.levelId)?.name;
      const items = (db.curriculum||[]).filter(c=>c.levelId===st.levelId && c.status==='published')
        .map(c=>({...c, term: c.term||'الفصل 1', subject: db.subjects.find(s=>s.id===c.subjectId)?.name}));
      send(res,200,{level: lvl, items, terms: TERMS, languageConfig: db.languageConfig||{}, contentSamples: (db.contentSamples||[]).filter(s=>s.levelId===st.levelId)}); return;
    }
    if (req.method==='GET' && pathname==='/api/student/library') {
      const st = studentById(db,sid);
      const term = TERMS.includes(parsed.query.term) ? parsed.query.term : TERMS[0];
      send(res,200,{library: libraryForLevel(db, st.levelId, term, true)}); return;
    }

    // --- Formative assessments (student, advisory only) ---
    if (req.method==='GET' && pathname==='/api/student/formative-assessments') {
      const st = studentById(db, sid);
      const list = (db.formativeAssessments || [])
        .filter(f => f.status === 'published' && f.levelId === st.levelId)
        .map(f => {
          const attempts = attemptsFor(db, f.id, sid);
          return {
            id: f.id, title: f.title, subject: subjectName(db, f.subjectId), term: f.term,
            questionCount: (f.questionIds || []).length, attemptsCount: attempts.length,
            bestScore: attempts.length ? Math.max(...attempts.map(a => a.score || 0)) : null,
            lastAttemptAt: attempts.length ? attempts[attempts.length - 1].completedAt : null,
          };
        });
      send(res,200,{assessments: list}); return;
    }
    if (req.method==='GET' && pathname.startsWith('/api/student/formative-assessments/')) {
      const assessmentId = pathname.split('/')[4];
      const st = studentById(db, sid);
      const f = (db.formativeAssessments || []).find(x => x.id === assessmentId);
      if (!f || f.status !== 'published' || f.levelId !== st.levelId) { send(res,404,{error:'not_found'}); return; }
      const questions = (db.questionBank || [])
        .filter(q => (f.questionIds || []).includes(q.id) && (q.status || 'active') !== 'archived')
        .map(q => ({ id: q.id, prompt: q.prompt, options: q.options, skill: q.skill, difficulty: q.difficulty }));
      // Advisory timing metadata (additive): no correctIndex is ever returned.
      const now = new Date().toISOString();
      send(res,200,{assessment:{id:f.id,title:f.title,subject:subjectName(db,f.subjectId),term:f.term}, questions,
        timeLimitSeconds: f.timeLimitSeconds || 0, startedAt: now, serverNow: now}); return;
    }
    if (req.method==='POST' && pathname.startsWith('/api/student/formative-assessments/') && pathname.endsWith('/submit')) {
      const assessmentId = pathname.split('/')[4];
      const st = studentById(db, sid);
      const f = (db.formativeAssessments || []).find(x => x.id === assessmentId);
      if (!f || f.status !== 'published' || f.levelId !== st.levelId) { send(res,404,{error:'not_found'}); return; }
      const body = await parseBody(req);
      const answers = body.answers && typeof body.answers === 'object' ? body.answers : {};
      const questions = (db.questionBank || []).filter(q => (f.questionIds || []).includes(q.id)
        && (q.status || 'active') !== 'archived');
      const feedback = questions.map(q => {
        // Out-of-range / non-integer answers are simply wrong (never an index).
        const valid = validAnswerIndex(answers[q.id], (q.options || []).length);
        const answerIndex = valid ? Number(answers[q.id]) : -1;
        const correct = valid && answerIndex === Number(q.correctIndex);
        // Return the option the learner actually picked so the result screen can
        // show their answer even after the in-memory answer map is cleared.
        const selectedText = valid ? (q.options?.[answerIndex] ?? '') : '';
        return { questionId: q.id, correct, selectedText, correctText: q.options?.[q.correctIndex] ?? '', explanation: q.explanation || '' };
      });
      const correct = feedback.filter(x => x.correct).length;
      const total = questions.length;
      const score = total ? correct / total : 0;
      const priorAttempts = attemptsFor(db, f.id, sid).length;
      const numericDuration = Number(body.durationSeconds);
      const durationSeconds = Number.isFinite(numericDuration) && numericDuration >= 0 ? numericDuration : 0;
      const timeLimitSeconds = f.timeLimitSeconds || 0;
      const attempt = {
        id: 'att_' + Date.now() + '_' + Math.random().toString(36).slice(2,6),
        assessmentId: f.id, studentId: sid, answers, score, correct, total, feedback,
        completedAt: new Date().toISOString(),
        // Advisory-only practice metadata. Never an official grade.
        attemptNumber: priorAttempts + 1,
        durationSeconds,
        advisory: true,
        timeLimitSeconds,
        late: timeLimitSeconds > 0 && durationSeconds > timeLimitSeconds,
      };
      db.assessmentAttempts = db.assessmentAttempts || []; db.assessmentAttempts.push(attempt);
      const bestScore = Math.max(...attemptsFor(db, f.id, sid).map(a => a.score || 0));
      audit(db, auth, 'submit', 'formative_assessment', f.id, { studentId: sid, score: Number(score.toFixed(3)), advisory: true }); saveDB(db);
      send(res,200,{attempt, bestScore}); return;
    }

    // --- Interactive lesson content (published-only, student's own level) ---
    if (req.method==='GET' && pathname==='/api/student/lesson-contents') {
      const st = studentById(db, sid);
      if (!st) { send(res,403,{error:'forbidden'}); return; }
      const contents = publishedLessonContentsForLevel(db, st.levelId).map(lessonContentSummary);
      audit(db, auth, 'read', 'lesson_content', st.levelId, { by:'student', count: contents.length }); saveDB(db);
      send(res, 200, { contents, meta: { levels: (db.levels||[]).map(l => ({ id:l.id, name:l.name })) } }); return;
    }
    if (req.method==='GET' && pathname==='/api/student/lesson-contents/view') {
      const st = studentById(db, sid);
      const c = findLessonContent(db, parsed.query.id);
      if (!st || !c || lessonContentStatus(c) !== 'published' || c.levelId !== st.levelId) { send(res,404,{error:'not_found'}); return; }
      ensureLessonContentView(db, sid, c.lessonId);
      audit(db, auth, 'read', 'lesson_content_view', c.id, { by:'student', lessonId: c.lessonId }); saveDB(db);
      send(res, 200, { content: c }); return;
    }
    if (req.method==='POST' && pathname==='/api/student/lesson-contents/view') {
      const st = studentById(db, sid);
      const body = await parseBody(req);
      const key = String(body.lessonId || '').trim();
      const c = findLessonContent(db, key);
      if (!st || !key || !c || lessonContentStatus(c) !== 'published' || c.levelId !== st.levelId) { send(res,404,{error:'not_found'}); return; }
      const row = ensureLessonContentView(db, sid, c.lessonId);
      audit(db, auth, 'read', 'lesson_content_view', c.id, { by:'student', lessonId: c.lessonId, method:'post' }); saveDB(db);
      send(res, 200, { ok:true, readAt: row.at }); return;
    }
    if (req.method==='GET' && pathname==='/api/student/lesson-contents/questions') {
      const st = studentById(db, sid);
      const c = findLessonContent(db, parsed.query.lessonId);
      if (!st || !c || lessonContentStatus(c) !== 'published' || c.levelId !== st.levelId) { send(res,404,{error:'not_found'}); return; }
      const ids = new Set(c.quizQuestionIds || []);
      const questions = (db.questionBank || [])
        .filter(q => ids.has(q.id) && (q.status || 'active') !== 'archived')
        .map(q => ({ id:q.id, prompt:q.prompt, options:q.options, skill:q.skill, difficulty:q.difficulty }));
      audit(db, auth, 'read', 'lesson_content_questions', c.id, { by:'student', count: questions.length }); saveDB(db);
      send(res, 200, { questions, timeLimitSeconds: 0 }); return;
    }
    if (req.method==='GET' && pathname==='/api/student/lesson-contents/progress') {
      const views = (db.lessonContentViews||[]).filter(v => v.studentId === sid);
      const progress = views.map(v => {
        const lp = (db.lessonProgress||[]).find(p => p.studentId === sid && p.lessonId === v.lessonId);
        return { lessonId: v.lessonId, readAt: v.at, completed: Boolean(lp && lp.completed), score: lp ? (lp.score ?? 0) : 0 };
      });
      audit(db, auth, 'read', 'lesson_content_progress', sid, { by:'student', count: progress.length }); saveDB(db);
      send(res, 200, { progress }); return;
    }

    // --- Parallel learning space: engagement, assignments, interactive progress ---
    if (req.method==='GET' && pathname==='/api/student/engagement') {
      const events = (db.studentEngagement||[]).filter(e=>e.studentId===sid).slice(-50).reverse();
      send(res,200,{summary: engagementSummary(db,sid), events}); return;
    }
    if (req.method==='POST' && pathname==='/api/student/engagement') {
      const body = await parseBody(req);
      const seconds = Math.min(300, Math.max(1, Number(body.seconds)||0));
      const activity = ['lesson','assignment','assessment','reading','idle'].includes(body.activity) ? body.activity : 'reading';
      db.studentEngagement = db.studentEngagement || [];
      const entry = {
        id: 'eng_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        studentId: sid, at: new Date().toISOString(), seconds, activity,
        subjectId: body.subjectId || null, subject: body.subject || null,
        refId: body.refId || null, source: 'web',
      };
      db.studentEngagement.push(entry);
      saveDB(db);
      send(res,200,{ok:true, entry, summary: engagementSummary(db,sid)}); return;
    }
    if (req.method==='GET' && pathname==='/api/student/assignments') {
      send(res,200,{assignments: studentAssignments(db,sid)}); return;
    }
    if (req.method==='POST' && pathname.startsWith('/api/student/assignments/') && pathname.endsWith('/submit')) {
      const assignmentId = pathname.split('/')[4];
      const assignment = (db.assignments||[]).find(a=>a.id===assignmentId);
      const st = studentById(db,sid);
      if (!assignment || !st || assignment.classId !== st.classId) { send(res,404,{error:'not_found'}); return; }
      const body = await parseBody(req);
      db.submissions = db.submissions || [];
      let submission = db.submissions.find(s=>s.assignmentId===assignmentId && s.studentId===sid);
      if (!submission) {
        submission = { id: 'sb_' + Date.now() + '_' + Math.random().toString(36).slice(2,6), assignmentId, studentId: sid };
        db.submissions.push(submission);
      }
      submission.status = 'submitted';
      submission.submittedAt = new Date().toISOString();
      if (body.note) submission.studentNote = String(body.note).slice(0, 500);
      audit(db, auth, 'submit', 'assignment', assignmentId, { studentId: sid, note: submission.studentNote || null });
      saveDB(db);
      send(res,200,{ok:true, submission, assignments: studentAssignments(db,sid)}); return;
    }
    if (req.method==='GET' && pathname==='/api/student/lessons/progress') {
      send(res,200,{progress: lessonProgressSummary(db,sid)}); return;
    }
    if (req.method==='POST' && pathname==='/api/student/lessons/progress') {
      const body = await parseBody(req);
      const lessonId = String(body.lessonId || '').trim();
      if (!lessonId) { send(res,400,{error:'validation_failed', message:'lessonId required'}); return; }
      const score = Math.min(1, Math.max(0, Number(body.score)||0));
      const completed = body.completed === true || score >= 0.6;
      db.lessonProgress = db.lessonProgress || [];
      let row = db.lessonProgress.find(p=>p.studentId===sid && p.lessonId===lessonId);
      if (!row) {
        row = { id: 'lp_' + Date.now() + '_' + Math.random().toString(36).slice(2,6), studentId: sid, lessonId };
        db.lessonProgress.push(row);
      }
      row.subjectId = body.subjectId || row.subjectId || null;
      row.subject = body.subject || row.subject || null;
      row.unitId = body.unitId || row.unitId || null;
      row.unit = body.unit || row.unit || null;
      row.lesson = body.lesson || row.lesson || lessonId;
      row.score = Math.max(Number(row.score)||0, score);
      row.completed = Boolean(row.completed) || completed;
      row.attempts = (Number(row.attempts)||0) + 1;
      row.xp = Math.max(Number(row.xp)||0, Math.round(10 + 20*row.score + (row.completed?10:0)));
      row.updatedAt = new Date().toISOString();
      row.at = row.at || row.updatedAt;
      audit(db, auth, row.completed ? 'complete' : 'practice', 'lesson_progress', lessonId, { studentId: sid, score: row.score, xp: row.xp });
      saveDB(db);
      send(res,200,{ok:true, progress: row, summary: lessonProgressSummary(db,sid)}); return;
    }
    if (req.method==='GET' && pathname==='/api/student/report-card') {
      const reportCard = computeReportCard(db, sid, parsed.query.term);
      audit(db,auth,'read','report_card',sid,{term:reportCard.term,by:'student'}); saveDB(db);
      send(res,200,{reportCard}); return;
    }

    // --- Weekly school timetable (the student's own class) ---
    if (req.method === 'GET' && pathname === '/api/student/timetable') {
      const st = studentById(db, sid);
      if (!st || !st.classId) { send(res,403,{error:'forbidden'}); return; }
      let slots = (db.timetable || []).filter(s => s.classId === st.classId);
      if (parsed.query.day) slots = slots.filter(s => s.day === parsed.query.day);
      if (parsed.query.term) slots = slots.filter(s => (s.term || TERMS[0]) === parsed.query.term);
      const classes = (db.classes || []).filter(c => c.id === st.classId);
      audit(db, auth, 'read', 'timetable', sid, { by: 'student' }); saveDB(db);
      send(res, 200, {
        slots: slots.map(s => timetableView(db, s, { view: 'student', studentId: sid })),
        meta: timetableMeta(db, 'student', classes),
      }); return;
    }
    send(res,404,{error:'not_found'}); return;
  }



  // Digital showcase: student work gallery (enhanced)
  if (req.method === 'GET' && pathname === '/api/showcase') {
    const level = parsed.query.level;
    const subject = parsed.query.subject;
    const category = parsed.query.category;
    let items = (db.publications || [])
      .filter(p => p.status !== 'pending_review' && p.status !== 'rejected')
      .map(p => ({ ...p, studentName: null, category: p.type }));
    if (level) items = items.filter(p => (db.levels||[]).some(l => l.name === level));
    if (subject) items = items.filter(p => p.type === subject);
    if (category) items = items.filter(p => p.type === category);
    const showcased = (db.submissions || []).filter(s => s.grade && s.grade >= 14).map(s => {
      const st = (db.students || []).find(x => x.id === s.studentId);
      const asg = (db.assignments || []).find(a => a.id === s.assignmentId);
      const sub = (db.subjects || []).find(x => x.id === asg?.subjectId);
      const lvl = (db.levels || []).find(l => l.id === st?.levelId);
      return { id: s.id, type: 'student_work', title: asg?.title || 'عمل تلميذ', student: st?.name, subject: sub?.name, level: lvl?.name, grade: s.grade, feedback: s.feedback, date: new Date().toISOString().slice(0, 10), featured: s.grade >= 16 };
    });
    const featured = showcased.filter(s => s.featured);
    const byLevel = {};
    showcased.forEach(s => { if (s.level) { if (!byLevel[s.level]) byLevel[s.level] = []; byLevel[s.level].push(s); } });
    const bySubject = {};
    showcased.forEach(s => { if (s.subject) { if (!bySubject[s.subject]) bySubject[s.subject] = []; bySubject[s.subject].push(s); } });
    send(res, 200, { publications: items, studentWork: showcased, featured, byLevel, bySubject, categories: [...new Set(items.map(p=>p.type))], total: items.length + showcased.length }); return;
  }
  // Showcase: submit work
  if (req.method === 'POST' && pathname === '/api/showcase/submit') {
    const auth = requireAuth(req, res); if (!auth) return;
    if (!requirePortal(auth, res, 'private')) return;
    const body = await parseBody(req);
    const pub = { id: 'pub_' + Date.now(), title: body.title, type: body.type || 'آداب', date: new Date().toISOString().slice(0,10), audience: 'أسرة/مجتمع', impact: body.impact || 'عمل تلميذ', studentId: body.studentId, submittedBy: actorId(auth), status: 'pending_review', createdAt: new Date().toISOString() };
    db.publications = db.publications || [];
    db.publications.push(pub);
    audit(db, auth, 'submit', 'showcase', pub.id, { title: pub.title, type: pub.type });
    saveDB(db);
    send(res, 201, { publication: pub }); return;
  }
  // Showcase: approve/reject (admin/teacher)
  if (req.method === 'POST' && pathname === '/api/showcase/review') {
    const auth = requireAuth(req, res); if (!auth) return;
    const isAdmin = auth.portal === 'admin_portal' && hasRole(auth, ['director','deputy','supervisor','admin']);
    const isTeacher = auth.portal === 'private' && auth.role === 'teacher';
    if (!isAdmin && !isTeacher) { send(res, 403, { error: 'forbidden' }); return; }
    const body = await parseBody(req);
    const pub = (db.publications || []).find(p => p.id === body.id);
    if (!pub) { send(res, 404, { error: 'not_found' }); return; }
    if (isTeacher && pub.studentId && !canTeacherAccessStudent(auth, db, pub.studentId)) { send(res, 403, { error: 'forbidden' }); return; }
    if (body.status && !['approved','rejected','published'].includes(body.status)) { send(res, 400, { error: 'invalid_status' }); return; }
    if (body.status) pub.status = body.status; // approved, rejected, published
    if (body.status === 'published') pub.publishedAt = new Date().toISOString();
    pub.reviewedBy = actorId(auth);
    pub.reviewedAt = new Date().toISOString();
    audit(db, auth, 'review', 'showcase', pub.id, { status: pub.status });
    saveDB(db);
    send(res, 200, { ok: true, publication: pub }); return;
  }
  // Showcase: student portfolio
  if (req.method === 'GET' && pathname === '/api/showcase/portfolio') {
    const sid = parsed.query.studentId;
    if (!sid) { send(res, 400, { error: 'studentId required' }); return; }
    const st = studentById(db, sid);
    if (!st) { send(res, 404, { error: 'not_found' }); return; }
    const works = (db.submissions || []).filter(s => s.studentId === sid && s.grade).map(s => {
      const asg = (db.assignments || []).find(a => a.id === s.assignmentId);
      const sub = (db.subjects || []).find(x => x.id === asg?.subjectId);
      return { id: s.id, title: asg?.title, subject: sub?.name, grade: s.grade, feedback: s.feedback, status: s.status };
    });
    const talents = (db.talents || []).filter(t => t.studentId === sid);
    const activities = (db.activities || []).filter(a => a.outreach);
    send(res, 200, { student: st.name, works, talents, activities: activities.slice(0, 5) }); return;
  }

  // (moved to parent block)

  // SSE: Real-time notifications stream (simplified)
  if (req.method === 'GET' && pathname === '/api/notifications/stream') {
    const auth = requireAuth(req, res); if (!auth) return;
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive', 'Access-Control-Allow-Origin': '*' });
    res.write('event: connected\\ndata: ' + JSON.stringify({ message: 'تم الاتصال', at: new Date().toISOString() }) + '\\n\\n');
    const db = loadDB();
    const today = new Date().toISOString().slice(0, 10);
    const due = (db.feedbackCards || []).filter(f => f.nextReview && f.nextReview <= today && !['completed', 'rejected'].includes(f.status)).length;
    const alerts = (db.alerts || []).filter(a => a.level === 'high').length;
    res.write('event: update\\ndata: ' + JSON.stringify({ alerts, due, at: new Date().toISOString() }) + '\\n\\n');
    res.end();
    return;
  }

  // Activity enrollment
  if (req.method === 'POST' && pathname === '/api/activities/enroll') {
    const auth = requireAuth(req, res); if (!auth) return;
    if (!requirePortal(auth, res, 'private')) return;
    const body = await parseBody(req);
    const studentId = body.studentId || auth.scope?.studentId;
    if (auth.role === 'student' && studentId !== auth.scope?.studentId) { send(res, 403, { error: 'forbidden' }); return; }
    if (auth.role === 'parent' && !canParentAccessStudent(auth, studentId)) { send(res, 403, { error: 'forbidden' }); return; }
    if (auth.role === 'teacher' && !canTeacherAccessStudent(auth, db, studentId)) { send(res, 403, { error: 'forbidden' }); return; }
    db.activityEnrollments = db.activityEnrollments || [];
    const existing = db.activityEnrollments.find(e => e.studentId === studentId && e.activityId === body.activityId);
    if (existing) { send(res, 400, { error: 'already_enrolled' }); return; }
    const enrollment = { id: 'enr_' + Date.now(), studentId, activityId: body.activityId, enrolledAt: new Date().toISOString(), enrolledBy: actorId(auth), status: 'active' };
    db.activityEnrollments.push(enrollment);
    audit(db, auth, 'enroll', 'activity', body.activityId, { studentId });
    saveDB(db);
    send(res, 201, { enrollment }); return;
  }
  // Activity members
  if (req.method === 'GET' && pathname === '/api/activities/members') {
    const auth = requireAuth(req, res); if (!auth) return;
    const activityId = parsed.query.activityId;
    const members = (db.activityEnrollments || []).filter(e => !activityId || e.activityId === activityId);
    const enriched = members.map(m => {
      const st = (db.students || []).find(s => s.id === m.studentId);
      const activity = (db.activities || []).find(a => a.id === m.activityId);
      return { ...m, studentName: st?.name, level: (db.levels || []).find(l => l.id === st?.levelId)?.name, activity: activity?.title || activity?.name };
    });
    send(res, 200, { members: enriched, total: enriched.length }); return;
  }
  // Wellbeing check-in
  if (req.method === 'POST' && pathname === '/api/wellbeing/checkin') {
    const auth = requireAuth(req, res); if (!auth) return;
    if (!requirePortal(auth, res, 'private')) return;
    const body = await parseBody(req);
    const studentId = body.studentId || auth.scope?.studentId;
    if (auth.role === 'student' && studentId !== auth.scope?.studentId) { send(res, 403, { error: 'forbidden' }); return; }
    if (auth.role === 'parent' && !canParentAccessStudent(auth, studentId)) { send(res, 403, { error: 'forbidden' }); return; }
    if (auth.role === 'teacher' && !canTeacherAccessStudent(auth, db, studentId)) { send(res, 403, { error: 'forbidden' }); return; }
    const checkin = { id: 'wb_' + Date.now(), studentId, mood: body.mood || 3, energy: body.energy || 3, stress: body.stress || 2, notes: body.notes || '', checkedAt: new Date().toISOString(), checkedBy: actorId(auth) };
    db.wellbeingCheckins = db.wellbeingCheckins || [];
    db.wellbeingCheckins.push(checkin);
    audit(db, auth, 'checkin', 'wellbeing', studentId, { mood: checkin.mood, energy: checkin.energy, stress: checkin.stress });
    saveDB(db);
    send(res, 201, { checkin }); return;
  }
  // Wellbeing history
  if (req.method === 'GET' && pathname === '/api/wellbeing/history') {
    const auth = requireAuth(req, res); if (!auth) return;
    const sid = parsed.query.studentId || auth.scope?.studentId;
    if (auth.role === 'student' && sid !== auth.scope?.studentId) { send(res, 403, { error: 'forbidden' }); return; }
    if (auth.role === 'parent' && !canParentAccessStudent(auth, sid)) { send(res, 403, { error: 'forbidden' }); return; }
    if (auth.role === 'teacher' && !canTeacherAccessStudent(auth, db, sid)) { send(res, 403, { error: 'forbidden' }); return; }
    const history = (db.wellbeingCheckins || []).filter(c => c.studentId === sid).slice(-30);
    send(res, 200, { history, total: history.length }); return;
  }
  // School calendar events
  if (req.method === 'GET' && pathname === '/api/calendar/events') {
    const auth = requireAuth(req, res); if (!auth) return;
    const events = db.calendarEvents || [
      { id: 'ev1', title: 'اختبار رياضيات', date: '2026-11-20', type: 'academic', audience: 'all', level: 'الرابع ابتدائي' },
      { id: 'ev2', title: 'اجتماع أولياء الأمور', date: '2026-11-22', type: 'meeting', audience: 'parents' },
      { id: 'ev3', title: 'فعالية القراءة', date: '2026-11-24', type: 'event', audience: 'all' },
      { id: 'ev4', title: 'معرض العلوم', date: '2026-11-28', type: 'event', audience: 'all' },
      { id: 'ev5', title: 'بطولة الشطرنج', date: '2026-11-30', type: 'competition', audience: 'all' },
    ];
    send(res, 200, { events }); return;
  }
  // Peer tutoring/mentoring
  if (req.method === 'GET' && pathname === '/api/mentoring/pairs') {
    const auth = requireAuth(req, res); if (!auth) return;
    const pairs = db.mentoringPairs || [];
    send(res, 200, { pairs }); return;
  }
  if (req.method === 'POST' && pathname === '/api/mentoring/pairs') {
    const auth = requireAuth(req, res); if (!auth) return;
    if (!requirePortal(auth, res, 'admin_portal') && auth.role !== 'teacher') { send(res, 403, { error: 'forbidden' }); return; }
    const body = await parseBody(req);
    const pair = { id: 'mp_' + Date.now(), mentorId: body.mentorId, menteeId: body.menteeId, subject: body.subject, status: 'active', createdAt: new Date().toISOString(), createdBy: actorId(auth) };
    db.mentoringPairs = db.mentoringPairs || [];
    db.mentoringPairs.push(pair);
    audit(db, auth, 'create', 'mentoring_pair', pair.id, { mentor: body.mentorId, mentee: body.menteeId });
    saveDB(db);
    send(res, 201, { pair }); return;
  }
  // Alumni network
  if (req.method === 'GET' && pathname === '/api/alumni') {
    const auth = requireAuth(req, res); if (!auth) return;
    const alumni = db.alumni || [
      { id: 'al1', name: 'أحمد بنعلي', graduationYear: 2020, currentRole: 'مهندس', mentorAvailable: true },
      { id: 'al2', name: 'فاطمة الزهراء', graduationYear: 2019, currentRole: 'طبيبة', mentorAvailable: true },
      { id: 'al3', name: 'يوسف المرابط', graduationYear: 2021, currentRole: 'أستاذ', mentorAvailable: false },
    ];
    send(res, 200, { alumni }); return;
  }
  // Volunteer program
  if (req.method === 'GET' && pathname === '/api/volunteers') {
    const auth = requireAuth(req, res); if (!auth) return;
    const volunteers = db.volunteers || [
      { id: 'v1', name: 'أ. خديجة', role: 'قراءة', availability: 'أسبوعي', hours: 12 },
      { id: 'v2', name: 'أ. إبراهيم', role: 'توجيه', availability: 'شهري', hours: 8 },
    ];
    send(res, 200, { volunteers }); return;
  }

  // Shared
  if (req.method === 'GET' && pathname === '/api/institution') { send(res,200,{ok:true}); return; }

  send(res,404,{error:'not_found', path: pathname});
}

// HTTPS / HTTP startup
const certPath = process.env.TLS_CERT || path.join(__dirname, 'certs', 'server.crt');
const keyPath = process.env.TLS_KEY || path.join(__dirname, 'certs', 'server.key');

if (USE_HTTPS && fs.existsSync(certPath) && fs.existsSync(keyPath)) {
  const tlsOpts = { cert: fs.readFileSync(certPath), key: fs.readFileSync(keyPath) };
  const httpsServer = https.createServer(tlsOpts, handleRequest);
  httpsServer.listen(PORT, () => {
    console.log(`Ryad Al Aqsa backend (HTTPS) running on https://localhost:${PORT}`);
    console.log('Storage:', storage.type(), '| HTTPS: enabled | Secrets: env-based');
  });
} else {
  if (USE_HTTPS) console.log('HTTPS requested but certs not found at', certPath, '- falling back to HTTP');
  const httpServer = http.createServer(handleRequest);
  httpServer.listen(PORT, () => {
    console.log(`Ryad Al Aqsa backend (HTTP) running on http://localhost:${PORT}`);
    console.log('Storage:', storage.type(), '| HTTPS: disabled (set USE_HTTPS=true + certs for production)');
    console.log('API: /api/auth/login, /api/admin/*, /api/teacher/*, /api/parent/*, /api/student/*');
  });
}
