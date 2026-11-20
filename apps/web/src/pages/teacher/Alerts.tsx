import { useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, BellRing, BrainCircuit, Loader2, RefreshCw, ShieldAlert } from 'lucide-react'
import { apiGet, extractApiError } from '../../lib/api'

interface AlertItem {
  id?: string
  kind?: string
  level?: string
  studentId?: string
  message?: string
  ref?: string
  [key: string]: unknown
}
interface Warning {
  id?: string
  studentId?: string
  student?: string
  level?: string
  risk?: number
  message?: string
  reason?: string
  [key: string]: unknown
}
interface ImpactSummary {
  totalStudents?: number
  totalFeedbackCards?: number
  approvedCards?: number
  inProgressCards?: number
  completedCards?: number
  activeCases?: number
  activeInterventions?: number
  outreachActivities?: number
  publications?: number
}
interface ImpactReport {
  period?: string
  generatedAt?: string
  summary?: ImpactSummary
  reassessmentDue?: Array<{ type?: string; studentId?: string; due?: string }>
}
interface ImpactResponse {
  report: ImpactReport
  scopedStudents: number
}
interface AlertsResponse {
  alerts: AlertItem[]
}
interface WarningsResponse {
  warnings: Warning[]
  total: number
}

function messageOf(error: unknown, fallback: string): string {
  return extractApiError(error)?.message || fallback
}

function Notice({ children, error = false }: { children: ReactNode; error?: boolean }) {
  return (
    <div
      className={`rounded-card border-2 p-4 text-sm font-bold ${
        error
          ? 'border-[#E03131]/30 bg-[#E03131]/10 text-[#E03131]'
          : 'border-line bg-surface-muted text-muted'
      }`}
    >
      {children}
    </div>
  )
}

export default function Alerts() {
  const { t } = useTranslation()
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [warnings, setWarnings] = useState<Warning[]>([])
  const [impact, setImpact] = useState<ImpactResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    Promise.all([
      apiGet<AlertsResponse>('/teacher/alerts'),
      apiGet<WarningsResponse>('/teacher/ml/early-warning'),
      apiGet<ImpactResponse>('/teacher/impact-report'),
    ])
      .then(([alertData, warningData, impactData]) => {
        if (!active) return
        setAlerts(alertData.alerts || [])
        setWarnings(warningData.warnings || [])
        setImpact(impactData)
      })
      .catch((err: unknown) => {
        if (active) {
          setError(messageOf(err, t('loadError', { defaultValue: 'تعذّر تحميل التنبيهات.' })))
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey])

  const summary = impact?.report?.summary
  const impactCards: Array<{ key: string; label: string; value: number | undefined }> = [
    { key: 'students', label: t('students', { defaultValue: 'التلاميذ' }), value: summary?.totalStudents },
    {
      key: 'approved',
      label: t('approvedCards', { defaultValue: 'بطاقات معتمدة' }),
      value: summary?.approvedCards,
    },
    {
      key: 'cases',
      label: t('activeCases', { defaultValue: 'حالات نشطة' }),
      value: summary?.activeCases,
    },
    {
      key: 'interventions',
      label: t('activeInterventions', { defaultValue: 'تدخلات نشطة' }),
      value: summary?.activeInterventions,
    },
  ]

  return (
    <div className="space-y-5 animate-slide">
      <section className="card-school flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h1 className="font-display text-xl font-black sm:text-2xl">
            {t('alertsTitle', { defaultValue: 'التنبيهات والأثر' })}
          </h1>
          <p className="mt-1 text-xs font-semibold text-muted">
            {t('alertsHint', { defaultValue: 'تنبيهات مقيّدة بنطاق فصولك.' })}
          </p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-100 text-gold-700 dark:bg-gold-400/15 dark:text-gold-300">
          <BellRing className="h-5 w-5" aria-hidden="true" />
        </span>
      </section>

      <div className="flex items-start gap-2 rounded-card border-2 border-gold-300 bg-gold-50 p-4 text-xs font-bold text-gold-800 dark:border-gold-400/30 dark:bg-gold-400/10 dark:text-gold-300">
        <BrainCircuit className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          {t('mlAdvisoryOnly', {
            defaultValue:
              'مخرجات التعلّم الآلي استرشادية فقط ولا تُتخذ بناءً عليها قرارات نهائية دون مراجعة واعتماد بشري.',
          })}
        </span>
      </div>

      {loading ? (
        <div className="card-school flex items-center justify-center gap-2 p-10 text-sm font-bold text-muted">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          {t('loading', { defaultValue: 'جارٍ التحميل…' })}
        </div>
      ) : error ? (
        <div className="space-y-3">
          <Notice error>{error}</Notice>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="btn-chunky btn-chunky--secondary btn-chunky--sm"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            {t('retry', { defaultValue: 'إعادة المحاولة' })}
          </button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className="card-school p-5">
            <h2 className="flex items-center gap-2 font-display text-lg font-black">
              <ShieldAlert className="h-5 w-5 text-brand-600" aria-hidden="true" />
              {t('alerts', { defaultValue: 'التنبيهات' })}
              <span className="text-xs font-bold text-muted">({alerts.length})</span>
            </h2>
            {alerts.length ? (
              <ul className="mt-4 space-y-2">
                {alerts.map((alert, index) => (
                  <li
                    key={alert.id || `${alert.studentId || ''}-${index}`}
                    className="rounded-card border-2 border-line bg-surface p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-black text-brand-700 dark:text-brand-300">
                        {alert.studentId || '—'}
                      </span>
                      <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-300">
                        {alert.level || alert.kind || 'info'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold">{alert.message || alert.kind || '—'}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4">
                <Notice>{t('noAlerts', { defaultValue: 'لا تنبيهات حالية ضمن نطاقك.' })}</Notice>
              </div>
            )}
          </section>

          <section className="card-school p-5">
            <h2 className="flex items-center gap-2 font-display text-lg font-black">
              <BrainCircuit className="h-5 w-5 text-gold-600" aria-hidden="true" />
              {t('earlyWarning', { defaultValue: 'الإنذار المبكر' })}
              <span className="text-xs font-bold text-muted">({warnings.length})</span>
            </h2>
            {warnings.length ? (
              <ul className="mt-4 space-y-2">
                {warnings.map((warning, index) => (
                  <li
                    key={warning.id || `${warning.studentId || ''}-${index}`}
                    className="rounded-card border-2 border-line bg-surface p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-extrabold">
                        {warning.student || warning.studentId || '—'}
                      </span>
                      {typeof warning.risk === 'number' ? (
                        <span className="shrink-0 rounded-full bg-[#E03131]/10 px-2 py-0.5 text-[10px] font-black text-[#E03131]">
                          {Math.round(warning.risk * 100)}%
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs font-semibold text-muted">
                      {warning.message || warning.reason || warning.level || '—'}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4">
                <Notice>{t('noWarnings', { defaultValue: 'لا مؤشرات إنذار مبكر حاليًا.' })}</Notice>
              </div>
            )}
          </section>
        </div>
      )}

      {!loading && !error && impact ? (
        <section className="card-school p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-lg font-black">
              {t('impactReport', { defaultValue: 'تقرير الأثر' })}
            </h2>
            <span className="text-[11px] font-semibold text-muted">
              {impact.report?.period || '—'} ·{' '}
              {t('scopedStudents', { defaultValue: 'تلاميذ النطاق' })}: {impact.scopedStudents}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {impactCards.map((card) => (
              <div key={card.key} className="rounded-card border-2 border-line bg-surface-muted p-4">
                <p className="text-[11px] font-extrabold text-muted">{card.label}</p>
                <p className="mt-2 font-display text-2xl font-black">{card.value ?? '—'}</p>
              </div>
            ))}
          </div>
          {impact.report?.reassessmentDue?.length ? (
            <div className="mt-4 rounded-card border-2 border-gold-300 bg-gold-50 p-3 dark:border-gold-400/30 dark:bg-gold-400/10">
              <p className="flex items-center gap-2 text-xs font-black text-gold-800 dark:text-gold-300">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                {t('reassessmentDue', { defaultValue: 'إعادة تقييم مستحقة' })} (
                {impact.report.reassessmentDue.length})
              </p>
              <ul className="mt-2 space-y-1">
                {impact.report.reassessmentDue.map((item, index) => (
                  <li key={`${item.studentId || ''}-${index}`} className="text-[11px] font-semibold text-gold-800 dark:text-gold-300">
                    {item.studentId || '—'} · {item.type || '—'} · {item.due || '—'}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  )
}
