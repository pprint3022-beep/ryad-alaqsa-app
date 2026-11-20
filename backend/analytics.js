// Analytics & anonymization service for aggregate insights
// Provides anonymized aggregate data and time-series trends

function anonymizeAggregate(students, minGroupSize = 5) {
  // k-anonymity: only return aggregates if group size >= minGroupSize
  if (!students || students.length < minGroupSize) return null;
  const count = students.length;
  const avgMastery = students.reduce((s, x) => s + (x.mastery || 0), 0) / count;
  const withGaps = students.filter(x => x.status === 'gap' || x.status === 'needs_support').length;
  const gifted = students.filter(x => x.talents && x.talents.length > 0).length;
  return {
    count,
    avgMastery: Math.round(avgMastery * 100) / 100,
    gapRate: Math.round((withGaps / count) * 100) / 100,
    giftedRate: Math.round((gifted / count) * 100) / 100,
    anonymized: true,
    minGroupSize
  };
}

function timeSeriesTrends(db, metric, periods = 6) {
  // Generate time-series trend data from stored data
  const now = new Date();
  const trends = [];
  for (let i = periods - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    const month = d.toISOString().slice(0, 7);
    trends.push({
      period: month,
      students: (db.students || []).length,
      withGaps: (db.competencies || []).filter(c => c.status === 'gap' || c.status === 'needs_support').length,
      feedbackCards: (db.feedbackCards || []).length,
      interventions: (db.interventions || []).filter(iv => iv.status === 'active').length,
      activities: (db.activities || []).length,
      publications: (db.publications || []).length
    });
  }
  return trends;
}

function impactReport(db) {
  const today = new Date().toISOString().slice(0, 10);
  const cards = db.feedbackCards || [];
  const cases = db.cases || [];
  const interventions = db.interventions || [];
  const impactLog = db.impactLog || [];
  return {
    generatedAt: new Date().toISOString(),
    period: 'الفصل 1 — 2025-2026',
    summary: {
      totalStudents: (db.students || []).length,
      totalFeedbackCards: cards.length,
      approvedCards: cards.filter(c => c.status === 'approved').length,
      inProgressCards: cards.filter(c => c.status === 'in_progress').length,
      completedCards: cards.filter(c => c.status === 'completed').length,
      activeCases: cases.filter(c => c.status === 'active').length,
      activeInterventions: interventions.filter(i => i.status === 'active').length,
      outreachActivities: (db.activities || []).filter(a => a.outreach).length,
      publications: (db.publications || []).length
    },
    reassessmentDue: [
      ...(db.learningPaths || []).filter(p => p.reassessDate && p.reassessDate <= today).map(p => ({ type: 'learning_path', studentId: p.studentId, due: p.reassessDate })),
      ...(db.feedbackCards || []).filter(f => f.nextReview && f.nextReview <= today && !['completed', 'rejected'].includes(f.status)).map(f => ({ type: 'feedback_card', id: f.id, studentId: f.studentId, due: f.nextReview })),
      ...(db.cases || []).filter(c => c.nextReview && c.nextReview <= today).map(c => ({ type: 'case', id: c.id, studentId: c.studentId, due: c.nextReview }))
    ],
    impactLog: impactLog.map(e => ({ studentId: e.studentId, indicator: e.indicator, baseline: e.baseline, target: e.target, current: e.current, progress: e.target > e.baseline ? Math.round(((e.current - e.baseline) / (e.target - e.baseline)) * 100) : 0 })),
    trends: timeSeriesTrends(db, 'all', 6)
  };
}

module.exports = { anonymizeAggregate, timeSeriesTrends, impactReport };
