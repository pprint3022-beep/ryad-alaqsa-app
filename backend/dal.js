// Data Access Layer (DAL) — abstracts storage, enables PostgreSQL migration
// Provides repository pattern for all entities with caching and indexing

const { createStorage } = require('./storage');

class DataAccessLayer {
  constructor() {
    this.storage = createStorage();
    this.cache = new Map();
    this.cacheTTL = 60000; // 1 minute
  }

  load() { return this.storage.load(); }
  save(db) { this.storage.save(db); this.cache.clear(); }

  // Cache helpers
  getCache(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.ts > this.cacheTTL) { this.cache.delete(key); return null; }
    return entry.value;
  }
  setCache(key, value) { this.cache.set(key, { value, ts: Date.now() }); }
  invalidateCache(pattern) {
    if (!pattern) { this.cache.clear(); return; }
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) this.cache.delete(key);
    }
  }

  // Repository: Students
  getStudents(db, filters = {}) {
    const cacheKey = 'students:' + JSON.stringify(filters);
    const cached = this.getCache(cacheKey);
    if (cached) return cached;
    let result = db.students || [];
    if (filters.levelId) result = result.filter(s => s.levelId === filters.levelId);
    if (filters.classId) result = result.filter(s => s.classId === filters.classId);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
    }
    this.setCache(cacheKey, result);
    return result;
  }

  getStudent(db, id) {
    const cached = this.getCache('student:' + id);
    if (cached) return cached;
    const st = (db.students || []).find(s => s.id === id);
    if (st) this.setCache('student:' + id, st);
    return st;
  }

  // Repository: Competencies
  getCompetencies(db, filters = {}) {
    let result = db.competencies || [];
    if (filters.studentId) result = result.filter(c => c.studentId === filters.studentId);
    if (filters.subjectId) result = result.filter(c => c.subjectId === filters.subjectId);
    if (filters.status) result = result.filter(c => c.status === filters.status);
    return result;
  }

  getCompetencyRefs(db, filters = {}) {
    const cacheKey = 'refs:' + JSON.stringify(filters);
    const cached = this.getCache(cacheKey);
    if (cached) return cached;
    let result = db.competencyReferences || [];
    if (filters.level) result = result.filter(r => r.level === filters.level);
    if (filters.subject) result = result.filter(r => r.subject === filters.subject);
    this.setCache(cacheKey, result);
    return result;
  }

  // Repository: Feedback Cards
  getFeedbackCards(db, filters = {}) {
    let result = db.feedbackCards || [];
    if (filters.studentId) result = result.filter(c => c.studentId === filters.studentId);
    if (filters.status) result = result.filter(c => c.status === filters.status);
    if (filters.priority) result = result.filter(c => c.priority === filters.priority);
    return result;
  }

  // Repository: Cases
  getCases(db, filters = {}) {
    let result = db.cases || [];
    if (filters.studentId) result = result.filter(c => c.studentId === filters.studentId);
    if (filters.status) result = result.filter(c => c.status === filters.status);
    if (filters.ownerId) result = result.filter(c => c.ownerId === filters.ownerId);
    return result;
  }

  // Repository: Assessments
  getAssessments(db, filters = {}) {
    let result = db.assessments || [];
    if (filters.studentId) result = result.filter(a => a.studentId === filters.studentId);
    if (filters.type) result = result.filter(a => a.type === filters.type);
    if (filters.subject) result = filters.subject ? result.filter(a => a.subject === filters.subject) : result;
    return result;
  }

  // Repository: Communications
  getCommunications(db, filters = {}) {
    let result = db.communications || [];
    if (filters.studentId) result = result.filter(c => c.studentId === filters.studentId);
    if (filters.status) result = result.filter(c => c.status === filters.status);
    if (filters.channel) result = result.filter(c => c.channel === filters.channel);
    return result;
  }

  // Repository: Audit Logs (with pagination)
  getAuditLogs(db, filters = {}) {
    let result = (db.auditLogs || []).slice().reverse();
    if (filters.actorId) result = result.filter(l => l.actorId === filters.actorId);
    if (filters.entityType) result = result.filter(l => l.entityType === filters.entityType);
    if (filters.action) result = result.filter(l => l.action === filters.action);
    const limit = filters.limit || 100;
    const offset = filters.offset || 0;
    return { items: result.slice(offset, offset + limit), total: result.length, hasMore: offset + limit < result.length };
  }

  // Full-text search
  search(db, query, types = ['all']) {
    const q = query.toLowerCase().trim();
    if (!q) return { results: [], total: 0 };
    const results = [];
    const searchIn = types.includes('all') ? ['students', 'activities', 'library', 'cases', 'cards'] : types;

    if (searchIn.includes('students')) {
      (db.students || []).forEach(s => {
        if (s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)) {
          const lvl = (db.levels || []).find(l => l.id === s.levelId);
          results.push({ type: 'student', id: s.id, title: s.name, subtitle: lvl ? lvl.name : '', score: s.name.toLowerCase().startsWith(q) ? 1.0 : 0.5 });
        }
      });
    }
    if (searchIn.includes('activities')) {
      (db.activities || []).forEach(a => {
        if (a.name.toLowerCase().includes(q) || (a.category || '').toLowerCase().includes(q)) {
          results.push({ type: 'activity', id: a.id, title: a.name, subtitle: a.category || '', score: a.name.toLowerCase().startsWith(q) ? 1.0 : 0.5 });
        }
      });
    }
    if (searchIn.includes('library')) {
      (db.library || []).forEach(l => {
        if (l.title.toLowerCase().includes(q) || (l.summary || '').toLowerCase().includes(q) || (l.tags || []).some(t => t.toLowerCase().includes(q))) {
          results.push({ type: 'library', id: l.id, title: l.title, subtitle: l.domain || '', score: l.title.toLowerCase().startsWith(q) ? 1.0 : 0.5 });
        }
      });
    }
    if (searchIn.includes('cases')) {
      (db.cases || []).forEach(c => {
        const st = (db.students || []).find(s => s.id === c.studentId);
        if ((st && st.name.toLowerCase().includes(q)) || (c.focus || '').toLowerCase().includes(q)) {
          results.push({ type: 'case', id: c.id, title: (st ? st.name : c.id) + ' — ' + c.status, subtitle: c.focus || '', score: 0.5 });
        }
      });
    }
    if (searchIn.includes('cards')) {
      (db.feedbackCards || []).forEach(f => {
        const st = (db.students || []).find(s => s.id === f.studentId);
        if ((st && st.name.toLowerCase().includes(q)) || (f.summary || '').toLowerCase().includes(q)) {
          results.push({ type: 'feedback_card', id: f.id, title: (st ? st.name : f.id) + ' — ' + f.status, subtitle: f.summary || '', score: 0.5 });
        }
      });
    }
    results.sort((a, b) => b.score - a.score);
    return { results: results.slice(0, 50), total: results.length, query: q };
  }

  // Dashboard aggregates (materialized view simulation)
  getDashboardAggregates(db) {
    const cached = this.getCache('dashboard:aggregates');
    if (cached) return cached;
    const today = new Date().toISOString().slice(0, 10);
    const agg = {
      students: (db.students || []).length,
      classes: (db.classes || []).length,
      levels: (db.levels || []).length,
      withGaps: (db.competencies || []).filter(c => c.status === 'gap' || c.status === 'needs_support').length,
      gifted: (db.talents || []).length,
      activeInterventions: (db.interventions || []).filter(i => i.status === 'active').length,
      alerts: (db.alerts || []).length,
      feedbackPending: (db.feedbackCards || []).filter(f => f.status === 'proposed').length,
      activeCases: (db.cases || []).filter(c => c.status === 'active').length,
      reassessmentDue: (db.learningPaths || []).filter(p => p.reassessDate && p.reassessDate <= today).length
        + (db.feedbackCards || []).filter(f => f.nextReview && f.nextReview <= today && !['completed', 'rejected'].includes(f.status)).length
        + (db.cases || []).filter(c => c.nextReview && c.nextReview <= today).length,
      outreachActivities: (db.activities || []).filter(a => a.outreach).length,
      publications: (db.publications || []).length,
      auditCount: (db.auditLogs || []).length,
      generatedAt: new Date().toISOString()
    };
    this.setCache('dashboard:aggregates', agg);
    return agg;
  }
}

// Singleton
const dal = new DataAccessLayer();
module.exports = { dal, DataAccessLayer };
