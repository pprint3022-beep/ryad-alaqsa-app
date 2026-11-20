'use strict';

/**
 * ===========================================================================
 * Moroccan PRIMARY education grading subsystem — pure computation policy
 * ===========================================================================
 *
 * SCOPE
 * -----
 * This module contains ONLY pure functions (no I/O, no DB access, no clock).
 * It turns teacher-entered subject scores + coefficients into cycle averages,
 * an annual (or 6th-grade final) average, a "mention" (تقدير) and a
 * success/fail decision for الدورة الأولى (cycle1) and الدورة الثانية (cycle2).
 *
 * SOURCES / CITATIONS (conventional public-guide formulas)
 * --------------------------------------------------------
 * The rules encoded here are the *conventional* Moroccan primary-school
 * formulas published in public exam/grading guides and explainers, notably:
 *   - Massar (massar.ma) parent/teacher explainers "كيفية حساب المعدل"
 *     and the Moutamadris (moutamadris.ma) "حساب المعدل الابتدائي /
 *     امتحانات الفروض" articles — weighted continuous assessment (فروض +
 *     نقطة المشاركة/النشاط) then a weighted mean across subjects.
 *   - Ministry of National Education (المكتبة التربوية / circulars on the
 *     "امتحان الموحد المحلي" and "الامتحان الإقليمي", and on the
 *     "بطاقة التقرير" for cyclical assessment) — the 6th-grade final
 *     50% / 25% / 25% weighting used for the certificate (petit brevet)
 *     context.
 *
 * IMPORTANT — CONFIGURABILITY & GOVERNANCE
 * ----------------------------------------
 * Exact ministerial coefficients, the number of فروض per cycle, and the
 * band/threshold details vary by year and by ministerial circular. They are
 * therefore NOT hard-coded as immutable truth: everything lives in
 * DEFAULT_GRADING_POLICY and may be overridden per school by an administrator
 * via POST /api/admin/grades/config. The `sixthGradeMinSuccess` field (a /10
 * certificate-context threshold mentioned in some circulars) is exposed as an
 * advisory field alongside the general /20 `successThreshold`; the decision
 * logic uses `successThreshold` and never silently substitutes the /10 value.
 *
 * ALL OUTPUT IS ADVISORY. These numbers are decision *support* only and
 * require human review and formal approval by the school administration
 * (consult the platform governance principle). No automated result here
 * issues a certificate or a official failure on its own.
 *
 * Scale: all scores are /20. All returned numbers are rounded to 2 decimals.
 */

/** Round a finite number to 2 decimals (half away from zero, EPSILON-safe). */
function round2(n) {
  const value = Number(n);
  if (!Number.isFinite(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Policy shipped with the prototype; schools may override any field. */
const DEFAULT_GRADING_POLICY = {
  scale: 20,
  successThreshold: 10,
  mentionBands: [
    { min: 18, max: 20, key: 'excellent' },
    { min: 16, max: 18, key: 'veryGood' },
    { min: 14, max: 16, key: 'good' },
    { min: 12, max: 14, key: 'fairlyGood' },
    { min: 10, max: 12, key: 'passable' },
    { min: 0, max: 10, key: 'weak' },
  ],
  subjectCoefficients: {
    sub_ar: 4, sub_fr: 4, sub_math: 4, sub_isl: 2, sub_sci: 2, sub_cul: 1,
    sub_histgeo: 1, sub_amz: 1, sub_en: 1, sub_art: 1, sub_sport: 1,
    sub_es: 1, sub_de: 1, sub_it: 1,
  },
  defaultTestsPerCycle: 2,
  // participation point weight relative to tests. The participation coefficient
  // used in the weighted mean is: participationCoef = participationWeight * Σ(testCoef).
  // (e.g. two tests of coefficient 1 => participationCoef = 0.30).
  participationWeight: 0.15,
  cycleWeights: { cycle1: 0.5, cycle2: 0.5 },
  sixthGradeWeights: { continuous: 0.5, localExam: 0.25, regionalExam: 0.25 },
  // Advisory: /10 certificate-context threshold found in some circulars. Kept
  // explicit and documented; NOT used by the general /20 decision logic.
  sixthGradeMinSuccess: 5,
  note: 'Conventional Moroccan primary formulas; exact coefficients vary by ministerial circular — configurable by school. Advisory only, requires human approval.',
};

/** Bilingual labels for the mention keys (presentation helper, still pure). */
const MENTION_LABELS = {
  excellent: { ar: 'ممتاز', fr: 'Excellent' },
  veryGood: { ar: 'حسن جداً', fr: 'Très Bien' },
  good: { ar: 'حسن', fr: 'Bien' },
  fairlyGood: { ar: 'مستحسن', fr: 'Assez Bien' },
  passable: { ar: 'مقبول', fr: 'Passable' },
  weak: { ar: 'ضعيف / رسوب', fr: 'Faible / Échec' },
};

function mentionLabel(key) {
  return MENTION_LABELS[key] || { ar: '', fr: '' };
}

/**
 * Subject average for one cycle.
 *
 *   participationCoef = participationWeight * Σ(testCoefficient)
 *   subjectAverage    = round2( Σ(testScore*testCoef) + participationScore*participationCoef
 *                                / (Σ(testCoef) + participationCoef) )
 *
 * @param {object} subjectEntry  { tests:[{score,coefficient}], participationScore, subjectCoefficient? }
 * @param {object} policy
 * @returns {number} 0..scale, rounded to 2 decimals
 */
function computeSubjectAverage(subjectEntry, policy = DEFAULT_GRADING_POLICY) {
  if (!subjectEntry || typeof subjectEntry !== 'object') return 0;
  const tests = Array.isArray(subjectEntry.tests) ? subjectEntry.tests : [];
  let weightedTests = 0;
  let testWeight = 0;
  for (const test of tests) {
    if (!test || typeof test !== 'object') continue;
    const score = Number(test.score);
    const coef = Number(test.coefficient);
    if (!Number.isFinite(score) || !Number.isFinite(coef) || coef <= 0) continue;
    weightedTests += score * coef;
    testWeight += coef;
  }
  const participation = Number(subjectEntry.participationScore);
  const participationScore = Number.isFinite(participation) ? participation : 0;
  const weight = Number(policy.participationWeight);
  const participationWeight = Number.isFinite(weight) && weight >= 0 ? weight : 0;
  const participationCoef = participationWeight * testWeight;
  const denominator = testWeight + participationCoef;
  if (denominator <= 0) return 0;
  return round2((weightedTests + participationScore * participationCoef) / denominator);
}

/**
 * Cycle average (معدل الدورة): weighted mean across subjects.
 *
 *   cycleAverage = round2( Σ(subjectAverage * subjectCoefficient) / Σ(subjectCoefficient) )
 *
 * `subjects` items may already carry a numeric `subjectAverage`; otherwise it
 * is computed from that item's tests/participation via computeSubjectAverage.
 *
 * @param {Array} subjects
 * @param {object} policy
 * @returns {number}
 */
function computeCycleAverage(subjects, policy = DEFAULT_GRADING_POLICY) {
  if (!Array.isArray(subjects) || subjects.length === 0) return 0;
  let weighted = 0;
  let weightSum = 0;
  for (const item of subjects) {
    if (!item || typeof item !== 'object') continue;
    const direct = Number(item.subjectAverage);
    const average = Number.isFinite(direct) ? direct : computeSubjectAverage(item, policy);
    let coefficient = Number(item.subjectCoefficient);
    if (!Number.isFinite(coefficient) || coefficient <= 0) {
      coefficient = Number(policy.subjectCoefficients && policy.subjectCoefficients[item.subjectId]) || 1;
    }
    weighted += average * coefficient;
    weightSum += coefficient;
  }
  return weightSum > 0 ? round2(weighted / weightSum) : 0;
}

/**
 * Annual average (non-6th grade) = (cycle1 + cycle2) / 2, optionally using
 * policy.cycleWeights when those weights are provided and sum to 1.
 *
 * 6th grade (السادس ابتدائي) final average:
 *   final = 0.5*continuousAverage + 0.25*localExam + 0.25*regionalExam
 *   continuousAverage = (cycle1 + cycle2) / 2
 * If unified exam scores are absent, the continuous average is returned and a
 * documented advisory limitation applies (see `incompleteSixthGrade`).
 *
 * @param {Array|object} cycles  [c1,c2] or {cycle1,cycle2,levelId?,levelName?,localExam?,regionalExam?,isSixthGrade?}
 * @param {object} policy
 * @returns {number}
 */
function computeAnnualResult(cycles, policy = DEFAULT_GRADING_POLICY) {
  // null/undefined means "cycle not supplied" — must NOT become 0, otherwise a
  // single-cycle query would fabricate a failing annual average.
  const toNumber = (value) => (value === null || value === undefined || value === ''
    ? null : Number(value));
  let c1 = null;
  let c2 = null;
  let meta = {};
  if (Array.isArray(cycles)) {
    c1 = toNumber(cycles[0]);
    c2 = toNumber(cycles[1]);
  } else if (cycles && typeof cycles === 'object') {
    c1 = toNumber(cycles.cycle1);
    c2 = toNumber(cycles.cycle2);
    meta = cycles;
  }
  const has1 = Number.isFinite(c1);
  const has2 = Number.isFinite(c2);
  const available = [has1 ? c1 : null, has2 ? c2 : null].filter((v) => v !== null);

  let continuous;
  if (available.length === 0) {
    continuous = 0;
  } else if (policy.cycleWeights && Number.isFinite(Number(policy.cycleWeights.cycle1))
    && Number.isFinite(Number(policy.cycleWeights.cycle2))
    && Math.abs(Number(policy.cycleWeights.cycle1) + Number(policy.cycleWeights.cycle2) - 1) < 0.001
    && has1 && has2) {
    continuous = c1 * Number(policy.cycleWeights.cycle1) + c2 * Number(policy.cycleWeights.cycle2);
  } else {
    continuous = available.reduce((sum, v) => sum + v, 0) / available.length;
  }

  const isSixth = meta.isSixthGrade === true || meta.levelId === 'l_p6'
    || /السادس/.test(String(meta.levelName || ''));
  const result = { average: round2(continuous), incompleteSixthGrade: false };

  if (isSixth) {
    const local = Number(meta.localExam);
    const regional = Number(meta.regionalExam);
    const weights = policy.sixthGradeWeights || {};
    const wCont = Number(weights.continuous);
    const wLocal = Number(weights.localExam);
    const wRegional = Number(weights.regionalExam);
    if (Number.isFinite(local) && Number.isFinite(regional)
      && [wCont, wLocal, wRegional].every((w) => Number.isFinite(w))) {
      // Note: sixthGradeMinSuccess (/10) is deliberately NOT applied here.
      result.average = round2(wCont * continuous + wLocal * local + wRegional * regional);
    } else {
      result.incompleteSixthGrade = true; // unified exam scores not yet entered
    }
  }
  return result.average;
}

/**
 * Mention band (تقدير) key for an average, e.g. 'passable', 'good'.
 * Bands are ordered high→low in the policy; boundaries are [min,max) with the
 * final band inclusive of `scale` so that 20/20 is still "excellent".
 */
function computeMention(avg, policy = DEFAULT_GRADING_POLICY) {
  const value = Number(avg);
  if (!Number.isFinite(value)) return 'weak';
  const bands = Array.isArray(policy.mentionBands) && policy.mentionBands.length
    ? policy.mentionBands : DEFAULT_GRADING_POLICY.mentionBands;
  for (const band of bands) {
    if (value >= Number(band.min)
      && (value < Number(band.max) || (band.max === policy.scale && value <= Number(band.max)))) {
      return band.key;
    }
  }
  return 'weak';
}

/** Decision on a numeric average against the configurable /20 threshold. */
function computeDecision(avg, policy = DEFAULT_GRADING_POLICY) {
  return Number(avg) >= Number(policy.successThreshold) ? 'success' : 'fail';
}

/**
 * Full per-student result.
 *
 * `record` = {
 *   studentId, levelId?, levelName?, localExam?, regionalExam?,
 *   cycle1: [entry, ...],   // grade entries (drafts are ignored here)
 *   cycle2: [entry, ...],
 * }
 *
 * Entries with status 'draft' are excluded; 'submitted' and 'approved' are
 * included. Returns `cycle1`/`cycle2` numbers plus detailed `cycles`,
 * `annualAverage`, `mention`, `decision`, `failingSubjects` (subject ids) and
 * `advisory: true`.
 */
function computeStudentResult(record, policy = DEFAULT_GRADING_POLICY) {
  const rec = record && typeof record === 'object' ? record : {};
  const threshold = Number(policy.successThreshold);
  const usable = (entry) => entry && typeof entry === 'object' && entry.status !== 'draft';

  const buildCycle = (entries) => {
    const list = (Array.isArray(entries) ? entries : []).filter(usable);
    const subjects = list.map((entry) => {
      const subjectAverage = computeSubjectAverage(entry, policy);
      return {
        subjectId: entry.subjectId,
        subjectAverage,
        subjectCoefficient: Number(entry.subjectCoefficient)
          || Number(policy.subjectCoefficients && policy.subjectCoefficients[entry.subjectId]) || 1,
        mention: computeMention(subjectAverage, policy),
        status: subjectAverage >= threshold ? 'success' : 'fail',
      };
    });
    // An empty cycle (e.g. when the caller filters to a single cycle) is
    // "no data", not a zero average — otherwise it would drag the annual
    // mean down and fabricate a failure. computeAnnualResult skips nulls.
    const cycleAverage = subjects.length ? computeCycleAverage(subjects, policy) : null;
    return {
      subjects,
      cycleAverage,
      mention: cycleAverage === null ? null : computeMention(cycleAverage, policy),
      decision: cycleAverage === null ? null : computeDecision(cycleAverage, policy),
    };
  };

  const c1 = buildCycle(rec.cycle1);
  const c2 = buildCycle(rec.cycle2);

  const annualAverage = computeAnnualResult({
    cycle1: c1.cycleAverage,
    cycle2: c2.cycleAverage,
    levelId: rec.levelId,
    levelName: rec.levelName,
    localExam: rec.localExam,
    regionalExam: rec.regionalExam,
    isSixthGrade: rec.isSixthGrade,
  }, policy);

  const failingSubjects = [...new Set(
    [...c1.subjects, ...c2.subjects].filter((s) => s.status === 'fail').map((s) => s.subjectId)
  )];

  return {
    studentId: rec.studentId || null,
    cycle1: c1.cycleAverage,
    cycle2: c2.cycleAverage,
    cycles: { cycle1: c1, cycle2: c2 },
    annualAverage,
    mention: computeMention(annualAverage, policy),
    decision: computeDecision(annualAverage, policy),
    failingSubjects,
    hasData: c1.subjects.length > 0 || c2.subjects.length > 0,
    advisory: true,
  };
}

/** Map an array of student records to results (pure). */
function computeClassResults(students, policy = DEFAULT_GRADING_POLICY) {
  return (Array.isArray(students) ? students : []).map((student) => computeStudentResult(student, policy));
}

/**
 * Structural validation of a grade entry.
 *
 * @param {object} entry
 * @param {object} policy
 * @param {object} options  { subjectIds?:string[], scale?:number }
 * @returns {{valid:boolean, field?:string, value?:object}}
 */
function validateGradeEntry(entry, policy = DEFAULT_GRADING_POLICY, options = {}) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return { valid: false, field: 'entry' };

  const scale = Number.isFinite(Number(options.scale)) ? Number(options.scale) : Number(policy.scale);
  const studentId = entry.studentId;
  if (typeof studentId !== 'string' || !studentId.trim()) return { valid: false, field: 'studentId' };

  // cycle may be given directly or derived from the term label.
  let cycle = entry.cycle;
  if (!cycle && entry.term === 'الفصل 2') cycle = 'cycle2';
  if (!cycle && entry.term === 'الفصل 1') cycle = 'cycle1';
  if (!['cycle1', 'cycle2'].includes(cycle)) return { valid: false, field: 'cycle' };

  const subjectId = entry.subjectId;
  if (typeof subjectId !== 'string' || !subjectId.trim()) return { valid: false, field: 'subjectId' };
  const known = Array.isArray(options.subjectIds) && options.subjectIds.length
    ? options.subjectIds
    : Object.keys(policy.subjectCoefficients || {});
  if (known.length && !known.includes(subjectId)) return { valid: false, field: 'subjectId' };

  const tests = entry.tests;
  if (!Array.isArray(tests) || tests.length === 0) return { valid: false, field: 'tests' };
  const normalizedTests = [];
  for (let i = 0; i < tests.length; i += 1) {
    const test = tests[i];
    if (!test || typeof test !== 'object' || Array.isArray(test)) return { valid: false, field: 'tests' };
    const score = Number(test.score);
    if (!Number.isFinite(score) || score < 0 || score > scale) return { valid: false, field: 'score' };
    const coefficient = Number(test.coefficient);
    if (!Number.isFinite(coefficient) || coefficient <= 0) return { valid: false, field: 'coefficient' };
    normalizedTests.push({
      id: typeof test.id === 'string' && test.id ? test.id : `t${i + 1}`,
      label: typeof test.label === 'string' && test.label.trim() ? test.label.trim() : `الفرض ${i + 1}`,
      score,
      coefficient,
    });
  }

  const participationScore = Number(entry.participationScore);
  if (!Number.isFinite(participationScore) || participationScore < 0 || participationScore > scale) {
    return { valid: false, field: 'participationScore' };
  }

  const coefficientFromPolicy = Number(policy.subjectCoefficients && policy.subjectCoefficients[subjectId]);
  const subjectCoefficient = entry.subjectCoefficient === undefined || entry.subjectCoefficient === null || entry.subjectCoefficient === ''
    ? coefficientFromPolicy : Number(entry.subjectCoefficient);
  if (!Number.isFinite(subjectCoefficient) || subjectCoefficient <= 0) {
    return { valid: false, field: 'subjectCoefficient' };
  }

  return {
    valid: true,
    value: {
      studentId: studentId.trim(),
      cycle,
      subjectId,
      tests: normalizedTests,
      participationScore,
      subjectCoefficient,
    },
  };
}

module.exports = {
  DEFAULT_GRADING_POLICY,
  MENTION_LABELS,
  mentionLabel,
  round2,
  computeSubjectAverage,
  computeCycleAverage,
  computeAnnualResult,
  computeMention,
  computeDecision,
  computeStudentResult,
  computeClassResults,
  validateGradeEntry,
};
