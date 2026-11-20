import { useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertTriangle,
  BookOpenCheck,
  BrainCircuit,
  GraduationCap,
  LibraryBig,
  Loader2,
  RefreshCw,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { apiGet } from '../../lib/api'

interface LibraryItem {
  id?: string
  title?: string
  domain?: string
  tags?: string[]
  summary?: string
  source?: string
}
interface LibraryResponse {
  items: LibraryItem[]
}
interface ContentSample {
  levelId?: string
  levelName?: string
  languages?: string[]
  subjects?: string[]
  totalUnits?: number
  createdAt?: string
}
interface ContentSamplesResponse {
  samples: ContentSample[]
  languageConfig?: Record<string, unknown>
  curriculum?: unknown[]
}
interface CurriculumItem {
  id?: string
  levelId?: string
  subjectId?: string
  unit?: string
  lessons?: string[]
  status?: string
  level?: string
  subject?: string
}
interface CurriculumResponse {
  items: CurriculumItem[]
  subjects?: unknown[]
  levels?: unknown[]
}
interface AgentProfile {
  id?: string
  name?: string
  domain?: string
  level?: string
}
interface AgentRun {
  id?: string
  agent?: string
  target?: string
  status?: string
  summary?: string
  at?: string
}
interface EvidenceItem {
  id?: string
  type?: string
  ref?: string
  weight?: string
  studentId?: string
}
interface AssistantStats {
  evidenceCount?: number
  activeCases?: number
  feedbackCards?: number
  gaps?: number
  talents?: number
  interventions?: number
  alerts?: number
}
interface SmartAssistantResponse {
  agentProfiles?: AgentProfile[]
  agentRuns?: AgentRun[]
  evidence?: EvidenceItem[]
  stats?: AssistantStats
}

interface KnowledgeData {
  library: LibraryItem[]
  samples: ContentSample[]
  curriculum: CurriculumItem[]
  assistant: SmartAssistantResponse | null
}
const EMPTY_DATA: KnowledgeData = { library: [], samples: [], curriculum: [], assistant: null }

const TH = 'px-3 py-2 text-start text-[11px] font-black text-muted'
const TD = 'px-3 py-2 text-[11px] font-semibold'
const TABLE_BOX = 'overflow-x-auto rounded-card border-2 border-line bg-surface'

function Panel({
  title,
  icon: Icon,
  count,
  children,
}: {
  title: string
  icon: LucideIcon
  count?: number
  children: ReactNode
}) {
  return (
    <section className="card-school p-5">
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-700 dark:text-brand-300">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <h2 className="font-display text-base font-black">{title}</h2>
        {count === undefined ? null : (
          <span className="text-xs font-bold text-muted">({count})</span>
        )}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-card border-2 border-dashed border-line bg-surface-muted p-4 text-xs font-semibold text-muted">
      {text}
    </p>
  )
}

function numberLocale(language?: string): string {
  if (language === 'ar') return 'ar-MA'
  if (language === 'fr') return 'fr-FR'
  if (language === 'en') return 'en-GB'
  if (language === 'amz') return 'fr-FR'
  return 'ar-MA'
}

function Kpi({ label, value }: { label: string; value: number }) {
  const { i18n } = useTranslation()
  return (
    <div className="rounded-card border-2 border-line bg-surface-muted p-4">
      <p className="text-[11px] font-extrabold text-muted">{label}</p>
      <p className="mt-2 font-display text-2xl font-black text-brand-700 dark:text-brand-300">
        {new Intl.NumberFormat(numberLocale(i18n.resolvedLanguage)).format(value)}
      </p>
    </div>
  )
}

export default function Knowledge() {
  const { t } = useTranslation()
  const [data, setData] = useState<KnowledgeData>(EMPTY_DATA)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([
      apiGet<LibraryResponse>('/admin/library'),
      apiGet<ContentSamplesResponse>('/admin/content-samples'),
      apiGet<CurriculumResponse>('/admin/curriculum'),
      apiGet<SmartAssistantResponse>('/admin/smart-assistant'),
    ])
      .then(([library, samples, curriculum, assistant]) => {
        if (cancelled) return
        setData({
          library: library.items ?? [],
          samples: samples.samples ?? [],
          curriculum: curriculum.items ?? [],
          assistant,
        })
      })
      .catch(() => {
        if (!cancelled) {
          setError(t('admin.knowledgeLoadError', { defaultValue: 'تعذّر تحميل بيانات المعرفة.' }))
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [reload, t])

  const assistant = data.assistant
  const stats = assistant?.stats

  return (
    <div className="space-y-5 animate-slide">
      <section className="card-school flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h1 className="font-display text-2xl font-black">
            {t('admin.knowledgeTitle', { defaultValue: 'المعرفة والمحتوى' })}
          </h1>
          <p className="mt-1 text-xs font-semibold text-muted">
            {t('admin.knowledgeHint', {
              defaultValue:
                'مكتبة الموارد، عيّنات المحتوى، الوحدات المنهجية، وملخصات الوكلاء والأدلة.',
            })}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setReload((value) => value + 1)}
          disabled={loading}
          className="btn-chunky btn-chunky--secondary btn-chunky--sm"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {t('admin.refresh', { defaultValue: 'تحديث' })}
        </button>
      </section>

      {error ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-card border-2 border-[#E03131]/40 bg-[#E03131]/10 p-4 text-sm font-bold text-[#b42318] dark:text-[#ff8787]"
        >
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            {error}
          </span>
          <button
            type="button"
            onClick={() => setReload((value) => value + 1)}
            className="btn-chunky btn-chunky--danger btn-chunky--sm"
          >
            {t('admin.retry', { defaultValue: 'إعادة المحاولة' })}
          </button>
        </div>
      ) : null}

      {loading ? (
        <div className="card-school flex items-center justify-center gap-2 p-10 text-sm font-bold text-muted">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          {t('admin.knowledgeLoading', { defaultValue: 'جارٍ تحميل بيانات المعرفة…' })}
        </div>
      ) : null}

      {!loading && !error ? (
        <>
          <Panel
            title={t('admin.knowledgeLibrary', { defaultValue: 'مكتبة الموارد' })}
            icon={LibraryBig}
            count={data.library.length}
          >
            {data.library.length ? (
              <ul className="grid gap-2 sm:grid-cols-2">
                {data.library.map((item, index) => (
                  <li
                    key={item.id ?? index}
                    className="rounded-card border-2 border-line bg-surface p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="truncate text-sm font-extrabold">{item.title ?? '—'}</span>
                      {item.domain ? (
                        <span className="shrink-0 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-black text-brand-700 dark:bg-brand-400/15 dark:text-brand-300">
                          {item.domain}
                        </span>
                      ) : null}
                    </div>
                    {item.summary ? (
                      <p className="mt-2 text-xs font-semibold leading-relaxed text-content">
                        {item.summary}
                      </p>
                    ) : null}
                    <p className="mt-2 text-[11px] font-semibold text-muted">
                      {t('admin.knowledgeTags', { defaultValue: 'الوسوم' })}:{' '}
                      {(item.tags ?? []).join('، ') || '—'}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-muted">
                      {t('admin.knowledgeSource', { defaultValue: 'المصدر' })}: {item.source ?? '—'}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty text={t('admin.knowledgeNoLibrary', { defaultValue: 'لا توجد موارد في المكتبة حاليًا.' })} />
            )}
          </Panel>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel
              title={t('admin.knowledgeContentSamples', {
                defaultValue: 'عيّنات المحتوى حسب المستوى واللغة',
              })}
              icon={BookOpenCheck}
              count={data.samples.length}
            >
              {data.samples.length ? (
                <div className={TABLE_BOX}>
                  <table className="w-full">
                    <thead className="bg-surface-muted">
                      <tr>
                        <th className={TH}>{t('admin.knowledgeLevel', { defaultValue: 'المستوى' })}</th>
                        <th className={TH}>
                          {t('admin.knowledgeLanguages', { defaultValue: 'اللغات' })}
                        </th>
                        <th className={TH}>
                          {t('admin.knowledgeSubjects', { defaultValue: 'المواد' })}
                        </th>
                        <th className={TH}>
                          {t('admin.knowledgeTotalUnits', { defaultValue: 'عدد الوحدات' })}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.samples.map((sample, index) => (
                        <tr
                          key={sample.levelId ?? index}
                          className="border-t-2 border-line"
                        >
                          <td className={TD}>{sample.levelName ?? sample.levelId ?? '—'}</td>
                          <td className={TD}>{(sample.languages ?? []).join('، ') || '—'}</td>
                          <td className={TD}>{(sample.subjects ?? []).length}</td>
                          <td className={TD}>{sample.totalUnits ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Empty text={t('admin.knowledgeNoSamples', { defaultValue: 'لا توجد عيّنات محتوى حاليًا.' })} />
              )}
            </Panel>

            <Panel
              title={t('admin.knowledgeCurriculum', { defaultValue: 'الوحدات المنهجية' })}
              icon={GraduationCap}
              count={data.curriculum.length}
            >
              {data.curriculum.length ? (
                <div className={TABLE_BOX}>
                  <table className="w-full">
                    <thead className="bg-surface-muted">
                      <tr>
                        <th className={TH}>{t('admin.knowledgeUnit', { defaultValue: 'الوحدة' })}</th>
                        <th className={TH}>{t('admin.knowledgeLevel', { defaultValue: 'المستوى' })}</th>
                        <th className={TH}>
                          {t('admin.knowledgeSubject', { defaultValue: 'المادة' })}
                        </th>
                        <th className={TH}>
                          {t('admin.knowledgeLessons', { defaultValue: 'الدروس' })}
                        </th>
                        <th className={TH}>{t('admin.knowledgeStatus', { defaultValue: 'الحالة' })}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.curriculum.map((item) => (
                        <tr key={item.id ?? item.unit} className="border-t-2 border-line">
                          <td className={TD}>{item.unit ?? '—'}</td>
                          <td className={TD}>{item.level ?? item.levelId ?? '—'}</td>
                          <td className={TD}>{item.subject ?? item.subjectId ?? '—'}</td>
                          <td className={TD}>{(item.lessons ?? []).length}</td>
                          <td className={TD}>{item.status ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Empty
                  text={t('admin.knowledgeNoCurriculum', {
                    defaultValue: 'لا توجد وحدات منهجية حاليًا.',
                  })}
                />
              )}
            </Panel>
          </div>

          <Panel title={t('admin.knowledgeAssistant', { defaultValue: 'الوكيل الذكي' })} icon={BrainCircuit}>
            <div className="mb-4 flex items-start gap-2 rounded-card border-2 border-gold-300 bg-gold-50 p-3 text-xs font-bold text-gold-800 dark:border-gold-400/30 dark:bg-gold-400/10 dark:text-gold-300">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>
                {t('admin.knowledgeAdvisoryNotice', {
                  defaultValue:
                    'مخرجات الوكلاء والأدلة استرشادية فقط وتتطلب مراجعة واعتماد بشريًا قبل أي قرار تربوي.',
                })}
              </span>
            </div>

            {stats ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Kpi
                  label={t('admin.knowledgeEvidenceCount', { defaultValue: 'عدد الأدلة' })}
                  value={stats.evidenceCount ?? 0}
                />
                <Kpi
                  label={t('admin.knowledgeActiveCases', { defaultValue: 'الحالات النشطة' })}
                  value={stats.activeCases ?? 0}
                />
                <Kpi
                  label={t('admin.knowledgeFeedbackCards', { defaultValue: 'بطاقات الملاحظات' })}
                  value={stats.feedbackCards ?? 0}
                />
                <Kpi
                  label={t('admin.knowledgeAgentProfiles', { defaultValue: 'الوكلاء' })}
                  value={(assistant?.agentProfiles ?? []).length}
                />
              </div>
            ) : null}

            <div className="mt-4">
              <h3 className="text-xs font-black">
                {t('admin.knowledgeAgentProfiles', { defaultValue: 'الوكلاء' })}
              </h3>
              {assistant?.agentProfiles?.length ? (
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {assistant.agentProfiles.map((agent, index) => (
                    <li
                      key={agent.id ?? index}
                      className="rounded-card border-2 border-line bg-surface p-3"
                    >
                      <p className="text-xs font-extrabold">{agent.name ?? agent.id ?? '—'}</p>
                      <p className="mt-1 text-[11px] font-semibold text-muted">
                        {t('admin.knowledgeDomain', { defaultValue: 'المجال' })}: {agent.domain ?? '—'}
                      </p>
                      <p className="mt-1 text-[11px] font-semibold text-muted">
                        {t('admin.knowledgeLevel', { defaultValue: 'المستوى' })}: {agent.level ?? '—'}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-2">
                  <Empty text={t('admin.knowledgeNoAgents', { defaultValue: 'لا توجد بيانات وكلاء حاليًا.' })} />
                </div>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-xs font-black">
                {t('admin.knowledgeAgentRuns', { defaultValue: 'آخر تشغيلات الوكلاء' })}
              </h3>
              {assistant?.agentRuns?.length ? (
                <ul className="mt-2 space-y-2">
                  {assistant.agentRuns.map((run, index) => (
                    <li
                      key={run.id ?? index}
                      className="rounded-card border-2 border-line bg-surface p-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-extrabold">
                          {t('admin.knowledgeAgent', { defaultValue: 'الوكيل' })}: {run.agent ?? '—'}
                        </span>
                        <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-black text-brand-700 dark:bg-brand-400/15 dark:text-brand-300">
                          {run.status ?? '—'}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] font-semibold text-muted">
                        {t('admin.knowledgeTarget', { defaultValue: 'الهدف' })}: {run.target ?? '—'}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-content">{run.summary ?? '—'}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-2">
                  <Empty
                    text={t('admin.knowledgeNoAgents', { defaultValue: 'لا توجد بيانات وكلاء حاليًا.' })}
                  />
                </div>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-xs font-black">
                {t('admin.knowledgeRecentEvidence', { defaultValue: 'أدلة حديثة' })}
              </h3>
              {assistant?.evidence?.length ? (
                <ul className="mt-2 space-y-2">
                  {assistant.evidence.map((item, index) => (
                    <li
                      key={`${item.id ?? 'evidence'}-${index}`}
                      className="rounded-card border-2 border-line bg-surface p-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-extrabold">
                          {t('admin.knowledgeType', { defaultValue: 'النوع' })}: {item.type ?? '—'}
                        </span>
                        <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-300">
                          {t('admin.knowledgeWeight', { defaultValue: 'الوزن' })}: {item.weight ?? '—'}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] font-semibold text-muted">
                        {t('admin.knowledgeRef', { defaultValue: 'المرجع' })}: {item.ref ?? '—'}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-2">
                  <Empty
                    text={t('admin.knowledgeNoEvidence', { defaultValue: 'لا توجد أدلة حاليًا.' })}
                  />
                </div>
              )}
            </div>
          </Panel>
        </>
      ) : null}
    </div>
  )
}
