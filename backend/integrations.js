// Institutional integration adapters (MASSAR, etc.) — export/import with governance
// Production: implement real API calls to institutional systems with OAuth/API keys

const crypto = require('crypto');

const integrations = {
  massar: {
    name: 'MASSAR (مسار) — تتبع التمدرس والنتائج',
    description: 'تصدير/استيراد بيانات التلاميذ والنتائج والحضور (مواءمة مع MASSAR)',
    exportTemplate: (db) => {
      const students = (db.students || []).map(s => {
        const lvl = (db.levels || []).find(l => l.id === s.levelId);
        const cls = (db.classes || []).find(c => c.id === s.classId);
        const grades = (db.grades || []).filter(g => g.studentId === s.id).map(g => {
          const sub = (db.subjects || []).find(x => x.id === g.subjectId);
          return { subject: sub ? sub.name : g.subjectId, score: g.score, scale: g.scale, term: g.term };
        });
        const att = (db.attendance || []).filter(a => a.studentId === s.id);
        const present = att.filter(a => a.status === 'present').length;
        return {
          studentCode: s.id,
          fullName: s.name,
          level: lvl ? lvl.name : null,
          class: cls ? cls.name : null,
          grades,
          attendance: { total: att.length, present, rate: att.length ? Math.round((present / att.length) * 100) : 0 }
        };
      });
      return { system: 'massar', version: '1.0', exportedAt: new Date().toISOString(), students };
    },
    importStudents: async (payload) => {
      // Production: validate and import student records from MASSAR
      return { ok: true, imported: 0, skipped: 0, errors: [], simulated: true };
    }
  },
  eSchool: {
    name: 'e-Schools / Madrasati',
    description: 'تواتر/حضور/درجات/تواصل (ملاءمة منصات المدارس)',
    exportTemplate: (db) => ({ system: 'eSchool', version: '1.0', exportedAt: new Date().toISOString(), count: (db.students || []).length })
  }
};

function listIntegrations() { return Object.keys(integrations).map(k => ({ id: k, name: integrations[k].name, description: integrations[k].description })); }

function exportData(system, db) {
  const adapter = integrations[system];
  if (!adapter) return null;
  return adapter.exportTemplate(db);
}

module.exports = { integrations, listIntegrations, exportData };
