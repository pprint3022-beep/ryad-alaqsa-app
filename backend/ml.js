// ML/Analytics service: gap prediction, anomaly detection, recommendation scoring
// Uses statistical methods (no external ML libraries) — upgradeable to scikit-learn/TensorFlow

// Gap prediction: predicts risk of academic gap based on multiple indicators
function predictGapRisk(student, db) {
  const comps = (db.competencies || []).filter(c => c.studentId === student.id);
  const att = (db.attendance || []).filter(a => a.studentId === student.id);
  const grades = (db.grades || []).filter(g => g.studentId === student.id);
  const assessments = (db.assessments || []).filter(a => a.studentId === student.id);
  const talents = (db.talents || []).filter(t => t.studentId === student.id);

  // Features
  const avgMastery = comps.length ? comps.reduce((s, c) => s + (c.mastery || 0), 0) / comps.length : 0.5;
  const gapCount = comps.filter(c => c.status === 'gap' || c.status === 'needs_support').length;
  const attRate = att.length ? att.filter(a => a.status === 'present').length / att.length : 1;
  const avgGrade = grades.length ? grades.reduce((s, g) => s + (g.score / g.scale), 0) / grades.length : 0.5;
  const lowAssess = assessments.filter(a => (a.score || 0) < 0.5).length;
  const hasTalent = talents.length > 0;

  // Weighted risk score (0-1, higher = more at risk)
  let risk = 0;
  risk += (1 - avgMastery) * 0.30;        // mastery deficit
  risk += (gapCount / Math.max(comps.length, 1)) * 0.25;  // gap ratio
  risk += (1 - attRate) * 0.15;           // attendance deficit
  risk += (1 - avgGrade) * 0.15;          // grade deficit
  risk += (lowAssess / Math.max(assessments.length, 1)) * 0.10; // assessment deficit
  risk -= hasTalent ? 0.05 : 0;            // talent buffer

  risk = Math.max(0, Math.min(1, risk));
  const level = risk >= 0.7 ? 'high' : risk >= 0.4 ? 'medium' : 'low';
  const factors = [];
  if (avgMastery < 0.5) factors.push('إتقان كفايات منخفض');
  if (gapCount > 0) factors.push(`${gapCount} فجوة/صعوبة`);
  if (attRate < 0.9) factors.push('حضور غير منتظم');
  if (avgGrade < 0.6) factors.push('معدل درجات منخفض');
  if (lowAssess > 0) factors.push(`${lowAssess} تقييم تحت العتبة`);
  if (hasTalent) factors.push('مؤشرات تميز (عامل حماية)');

  return { risk: Math.round(risk * 100) / 100, level, factors, features: { avgMastery, gapCount, attRate, avgGrade, lowAssess, hasTalent } };
}

// Anomaly detection: detect unusual patterns in student data
function detectAnomalies(student, db) {
  const anomalies = [];
  const att = (db.attendance || []).filter(a => a.studentId === student.id);
  const grades = (db.grades || []).filter(g => g.studentId === student.id);

  // Sudden drop in attendance
  if (att.length >= 4) {
    const recent = att.slice(-2).filter(a => a.status !== 'present').length;
    const older = att.slice(0, -2).filter(a => a.status !== 'present').length;
    if (recent > older + 1) anomalies.push({ type: 'attendance_drop', severity: 'medium', message: 'انخفاض مفاجئ في الحضور' });
  }

  // Grade inconsistency
  if (grades.length >= 2) {
    const scores = grades.map(g => g.score / g.scale);
    const avg = scores.reduce((s, x) => s + x, 0) / scores.length;
    const variance = scores.reduce((s, x) => s + Math.pow(x - avg, 2), 0) / scores.length;
    if (variance > 0.04) anomalies.push({ type: 'grade_inconsistency', severity: 'low', message: 'تفاوت كبير بين الدرجات' });
  }

  // Missing assessments
  const comps = (db.competencies || []).filter(c => c.studentId === student.id);
  const unassessed = comps.filter(c => !c.lastAssessed || (Date.now() - new Date(c.lastAssessed).getTime()) > 30 * 24 * 60 * 60 * 1000);
  if (unassessed.length > 0) anomalies.push({ type: 'stale_assessment', severity: 'low', message: `${unassessed.length} كفاية بدون تقييم حديث` });

  return anomalies;
}

// Recommendation engine: personalized learning recommendations
function generateRecommendations(student, db) {
  const comps = (db.competencies || []).filter(c => c.studentId === student.id);
  const gaps = comps.filter(c => c.status === 'gap' || c.status === 'needs_support' || c.mastery < 0.5);
  const strengths = comps.filter(c => c.mastery >= 0.75);
  const talents = (db.talents || []).filter(t => t.studentId === student.id);
  const path = (db.learningPaths || []).find(p => p.studentId === student.id);
  const activities = (db.activities || []);
  const assessments = (db.assessments || []).filter(a => a.studentId === student.id);

  const recommendations = [];

  // Gap-based recommendations
  gaps.forEach(g => {
    const refs = (db.competencyReferences || []).filter(r => r.skill === g.skill && r.subject === (db.subjects.find(s => s.id === g.subjectId)?.name || g.subject));
    const indicators = refs.length ? refs[0].indicators : [];
    recommendations.push({
      type: 'support',
      priority: g.mastery < 0.3 ? 'high' : 'medium',
      skill: g.skill,
      subject: db.subjects.find(s => s.id === g.subjectId)?.name || g.subjectId,
      action: `تمارين تدريجية في ${g.skill} (${g.subjectId ? db.subjects.find(s=>s.id===g.subjectId)?.name : ''})`,
      frequency: g.mastery < 0.3 ? 'يومي (15-20 دقيقة)' : '3 مرات/أسبوع',
      indicators: indicators.slice(0, 3),
      evidence: `إتقان: ${Math.round(g.mastery * 100)}% (هدف: ${Math.round((refs[0]?.targetMastery || 0.7) * 100)}%)`
    });
  });

  // Talent-based recommendations
  talents.forEach(t => {
    const matchingActivities = activities.filter(a => a.outreach || a.audience === 'all' || a.audience === 'gifted_interested');
    recommendations.push({
      type: 'enrichment',
      priority: 'medium',
      domain: t.domain,
      action: `ربط ${t.talent} بـ ${matchingActivities.slice(0, 2).map(a => a.name).join(' و ')}`,
      frequency: 'أسبوعي',
      evidence: `موهبة: ${t.level} — ${t.evidence.join(', ')}`
    });
  });

  // Assessment-based recommendations
  const recentLow = assessments.filter(a => a.date && (Date.now() - new Date(a.date).getTime()) < 14 * 24 * 60 * 60 * 1000 && (a.score || 0) < 0.6);
  recentLow.forEach(a => {
    recommendations.push({
      type: 'assessment_followup',
      priority: 'high',
      subject: a.subject,
      action: `متابعة تقييم ${a.type} في ${a.subject} (${Math.round((a.score || 0) * 100)}%)`,
      frequency: 'أسبوعي',
      evidence: `تقييم ${a.date}: ${a.notes || 'بدون ملاحظات'}`
    });
  });

  // Reassessment scheduling
  if (path && path.reassessDate) {
    const daysUntil = Math.ceil((new Date(path.reassessDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    if (daysUntil <= 7 && daysUntil >= 0) {
      recommendations.push({
        type: 'reassessment',
        priority: 'high',
        action: `إعادة تقييم مجدولة في ${daysUntil} يوم (${path.reassessDate})`,
        frequency: 'مرة',
        evidence: `مسار: ${path.focus}`
      });
    }
  }

  return recommendations;
}

// Early warning system: identifies students at risk
function earlyWarningSystem(db) {
  const warnings = [];
  (db.students || []).forEach(student => {
    const risk = predictGapRisk(student, db);
    if (risk.level === 'high') {
      warnings.push({
        studentId: student.id,
        studentName: student.name,
        risk: risk.risk,
        level: risk.level,
        factors: risk.factors,
        recommendedAction: 'تفعيل خطة دعم مبكرة + تواصل مع الأسرة + متابعة أسبوعية',
        urgency: 'عاجل'
      });
    } else if (risk.level === 'medium') {
      warnings.push({
        studentId: student.id,
        studentName: student.name,
        risk: risk.risk,
        level: risk.level,
        factors: risk.factors,
        recommendedAction: 'متابعة مكثفة + تمارين تكييفية',
        urgency: 'متابعة'
      });
    }
  });
  return warnings.sort((a, b) => b.risk - a.risk);
}

// A/B testing framework (simple)
const experiments = new Map();
function createExperiment(id, variants, description) {
  experiments.set(id, { id, variants, description, assignments: new Map(), results: new Map(), createdAt: new Date().toISOString() });
}
function assignVariant(experimentId, userId) {
  const exp = experiments.get(experimentId);
  if (!exp) return null;
  if (exp.assignments.has(userId)) return exp.assignments.get(userId);
  const variant = exp.variants[Math.floor(Math.random() * exp.variants.length)];
  exp.assignments.set(userId, variant);
  return variant;
}
function recordResult(experimentId, userId, metric, value) {
  const exp = experiments.get(experimentId);
  if (!exp) return;
  const variant = exp.assignments.get(userId);
  if (!variant) return;
  if (!exp.results.has(variant)) exp.results.set(variant, []);
  exp.results.get(variant).push({ userId, metric, value, at: new Date().toISOString() });
}
function getExperimentResults(experimentId) {
  const exp = experiments.get(experimentId);
  if (!exp) return null;
  const summary = {};
  for (const [variant, results] of exp.results) {
    const values = results.map(r => r.value);
    summary[variant] = {
      count: values.length,
      mean: values.length ? Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 100) / 100 : 0,
      min: values.length ? Math.min(...values) : 0,
      max: values.length ? Math.max(...values) : 0
    };
  }
  return { id: exp.id, description: exp.description, variants: exp.variants, summary, totalAssignments: exp.assignments.size };
}

// Create default experiments
createExperiment('feedback_card_ui', ['A', 'B'], 'Test different feedback card layouts');
createExperiment('intervention_frequency', ['weekly', 'biweekly'], 'Test intervention check-in frequency');

module.exports = {
  predictGapRisk,
  detectAnomalies,
  generateRecommendations,
  earlyWarningSystem,
  createExperiment,
  assignVariant,
  recordResult,
  getExperimentResults,
  experiments
};
