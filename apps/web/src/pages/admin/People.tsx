import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, RefreshCw, Search, AlertTriangle, UserPlus } from 'lucide-react'
import { apiGet, apiPost, extractApiError } from '../../lib/api'

interface SearchResult {
  type: string
  id: string
  title: string
  subtitle: string
  score: number
}

interface SearchResponse {
  results: SearchResult[]
  total: number
  query: string
}

interface AttendanceRecord {
  id: string
  studentId: string
  classId?: string
  date: string
  status: string
  recordedBy?: string
}

interface ImportStudent {
  name: string
  levelId: string
  classId: string
  guardianId?: string | null
}

interface ImportRow {
  id: string
  name: string
  levelId: string
  classId: string
  guardianId: string
}

interface ImportResult {
  id: string
  name: string
  ok: boolean
}

interface ImportResponse {
  results: ImportResult[]
  total: number
  success: number
}

const SEARCH_TYPES = ['all', 'students', 'activities', 'library', 'cases', 'cards'] as const

const TYPE_KEY: Record<string, string> = {
  student: 'enumStudent',
  activity: 'enumActivity',
  library: 'enumLibrary',
  case: 'enumCase',
  feedback_card: 'enumFeedbackCard',
  all: 'enumAll',
  students: 'enumStudent',
  activities: 'enumActivity',
  cases: 'enumCase',
  cards: 'enumFeedbackCard',
}

const TYPE_DEFAULT: Record<string, string> = {
  student: 'تلميذ',
  activity: 'نشاط',
  library: 'مكتبة',
  case: 'حالة',
  feedback_card: 'بطاقة تغذية راجعة',
  all: 'الكل',
  students: 'تلاميذ',
  activities: 'أنشطة',
  cases: 'حالات',
  cards: 'بطاقات',
}

const ATT_STATUS_KEY: Record<string, string> = {
  present: 'enumApproved',
  late: 'enumPending',
  absent: 'enumRejected',
  excused: 'enumGranted',
}

const ATT_STATUS_DEFAULT: Record<string, string> = {
  present: 'حاضر',
  late: 'متأخر',
  absent: 'غائب',
  excused: 'مبرر',
}

const TH = 'px-3 py-2 text-start text-[11px] font-black text-muted'
const TD = 'px-3 py-2 text-[11px] font-semibold'
const BOX = 'overflow-x-auto rounded-card border-2 border-line bg-surface'

function failureMessage(error: unknown, fallback: string): string {
  return extractApiError(error)?.message ?? fallback
}

export default function People() {
  const { t } = useTranslation()
  const typeLabel = (value: string) => t(TYPE_KEY[value] ?? 'enumOther', { defaultValue: TYPE_DEFAULT[value] ?? value })
  const attStatusLabel = (value: string) => t(ATT_STATUS_KEY[value] ?? 'enumOther', { defaultValue: ATT_STATUS_DEFAULT[value] ?? value })
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState<(typeof SEARCH_TYPES)[number]>('all')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [searchReload, setSearchReload] = useState(0)
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reload, setReload] = useState(0)
  const [rows, setRows] = useState<ImportRow[]>([])
  const [form, setForm] = useState({ name: '', levelId: '', classId: '', guardianId: '' })
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [importSummary, setImportSummary] = useState<ImportResponse | null>(null)

  const fetchAttendance = useCallback(async () => {
    const response = await apiGet<{ attendance: AttendanceRecord[] }>('/admin/attendance')
    return response.attendance ?? []
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    void fetchAttendance().then((items) => {
      if (cancelled) return
      setAttendance(items)
      setLoading(false)
    }).catch((err: unknown) => {
      if (cancelled) return
      setError(failureMessage(err, t('admin.errorLoad', { defaultValue: 'تعذّر تحميل الحضور.' })))
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [fetchAttendance, reload, t])

  useEffect(() => {
    const term = query.trim()
    if (!term) {
      setResults([])
      setSearchError(null)
      setSearchLoading(false)
      return
    }
    let cancelled = false
    setSearchLoading(true)
    setSearchError(null)
    apiGet<SearchResponse>(`/admin/search?q=${encodeURIComponent(term)}&type=${searchType}`)
      .then((response) => {
        if (cancelled) return
        setResults(response.results ?? [])
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setSearchError(failureMessage(err, t('admin.searchFailed', { defaultValue: 'تعذّر إكمال البحث.' })))
      })
      .finally(() => { if (!cancelled) setSearchLoading(false) })
    return () => { cancelled = true }
  }, [query, searchType, searchReload, t])

  function addRow() {
    if (!form.name.trim() || !form.levelId.trim() || !form.classId.trim()) return
    setRows((current) => [...current, { ...form, id: `${Date.now()}-${current.length}` }])
    setForm({ name: '', levelId: '', classId: '', guardianId: '' })
  }

  async function runImport() {
    if (!rows.length) return
    setImporting(true)
    setImportError(null)
    setImportSummary(null)
    try {
      const students: ImportStudent[] = rows.map((row) => ({
        name: row.name,
        levelId: row.levelId,
        classId: row.classId,
        guardianId: row.guardianId.trim() || null,
      }))
      const response = await apiPost<ImportResponse, { students: ImportStudent[] }>('/admin/students/bulk-import', { students })
      setImportSummary(response)
      setRows([])
      setReload((n) => n + 1)
    } catch (err) {
      setImportError(failureMessage(err, t('admin.importFailed', { defaultValue: 'تعذّر استيراد التلاميذ.' })))
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-5 animate-slide">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black">{t('admin.peopleTitle', { defaultValue: 'الأشخاص والسجلات' })}</h1>
          <p className="mt-1 text-xs font-semibold text-muted">{t('admin.peopleHint', { defaultValue: 'بحث موحّد، استيراد التلاميذ، وسجل الحضور.' })}</p>
        </div>
        <button type="button" onClick={() => setReload((n) => n + 1)} disabled={loading} className="btn-chunky btn-chunky--secondary btn-chunky--sm">
          {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          {t('admin.refresh', { defaultValue: 'تحديث' })}
        </button>
      </div>

      <section className="card-school p-5">
        <h2 className="mb-3 text-sm font-black">{t('admin.unifiedSearch', { defaultValue: 'البحث الموحّد' })}</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('admin.searchPlaceholder', { defaultValue: 'ابحث بالاسم أو المعرّف…' })}
              className="input-school ps-10 text-sm"
            />
          </div>
          <select value={searchType} onChange={(e) => setSearchType(e.target.value as (typeof SEARCH_TYPES)[number])} className="input-school text-sm sm:max-w-48">
            {SEARCH_TYPES.map((type) => (
              <option key={type} value={type}>{typeLabel(type)}</option>
            ))}
          </select>
          <button type="button" disabled={!query.trim() || searchLoading} onClick={() => setSearchReload((n) => n + 1)} className="btn-chunky btn-chunky--primary btn-chunky--sm">
            {searchLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
            {t('admin.search', { defaultValue: 'بحث' })}
          </button>
        </div>

        {searchError ? <p role="alert" className="mt-3 flex items-center gap-2 rounded-card border-2 border-[#E03131]/40 bg-[#E03131]/10 p-3 text-xs font-bold text-[#b42318] dark:text-[#ff8787]"><AlertTriangle className="h-4 w-4" />{searchError}</p> : null}

        {!query.trim() ? (
          <p className="mt-3 text-xs font-semibold text-muted">{t('admin.searchHint', { defaultValue: 'أدخل كلمة بحث لعرض التلاميذ والأنشطة والمكتبة والحالات والبطاقات.' })}</p>
        ) : searchLoading ? (
          <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-muted"><Loader2 className="h-4 w-4 animate-spin" />{t('admin.loading', { defaultValue: 'جارٍ البحث…' })}</p>
        ) : results.length ? (
          <div className={`${BOX} mt-3`}>
            <table className="w-full">
              <thead className="bg-surface-muted"><tr>
                <th className={TH}>{t('admin.type', { defaultValue: 'النوع' })}</th>
                <th className={TH}>{t('admin.title', { defaultValue: 'العنوان' })}</th>
                <th className={TH}>{t('admin.details', { defaultValue: 'تفاصيل' })}</th>
              </tr></thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={`${result.type}-${result.id}-${index}`} className="border-t-2 border-line">
                    <td className={TD}>{typeLabel(result.type)}</td>
                    <td className={TD}>{result.title}</td>
                    <td className={TD}>{result.subtitle || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-xs font-semibold text-muted">{t('admin.noResults', { defaultValue: 'لا توجد نتائج مطابقة.' })}</p>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card-school p-5">
          <h2 className="mb-3 text-sm font-black">{t('admin.bulkImport', { defaultValue: 'استيراد التلاميذ دفعة واحدة' })}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t('admin.name', { defaultValue: 'الاسم' })} className="input-school text-sm" />
            <input value={form.levelId} onChange={(e) => setForm({ ...form, levelId: e.target.value })} placeholder={t('admin.levelId', { defaultValue: 'معرّف المستوى' })} className="input-school text-sm" />
            <input value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })} placeholder={t('admin.classId', { defaultValue: 'معرّف القسم' })} className="input-school text-sm" />
            <input value={form.guardianId} onChange={(e) => setForm({ ...form, guardianId: e.target.value })} placeholder={t('admin.guardianId', { defaultValue: 'معرّف ولي الأمر (اختياري)' })} className="input-school text-sm" />
          </div>
          <button
            type="button"
            disabled={!form.name.trim() || !form.levelId.trim() || !form.classId.trim()}
            onClick={addRow}
            className="btn-chunky btn-chunky--secondary btn-chunky--sm mt-3"
          >
            <UserPlus className="h-3.5 w-3.5" />{t('admin.addRow', { defaultValue: 'إضافة إلى القائمة' })}
          </button>

          {rows.length ? (
            <div className={`${BOX} mt-3`}>
              <table className="w-full">
                <thead className="bg-surface-muted"><tr>
                  <th className={TH}>{t('admin.name', { defaultValue: 'الاسم' })}</th>
                  <th className={TH}>{t('admin.levelId', { defaultValue: 'المستوى' })}</th>
                  <th className={TH}>{t('admin.classId', { defaultValue: 'القسم' })}</th>
                  <th className={TH}>{t('admin.remove', { defaultValue: 'حذف' })}</th>
                </tr></thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-t-2 border-line">
                      <td className={TD}>{row.name}</td>
                      <td className={TD}>{row.levelId}</td>
                      <td className={TD}>{row.classId}</td>
                      <td className={TD}>
                        <button type="button" onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))} className="text-[11px] font-black text-[#E03131]">{t('admin.remove', { defaultValue: 'حذف' })}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          <button type="button" disabled={importing || !rows.length} onClick={() => void runImport()} className="btn-chunky btn-chunky--primary btn-chunky--sm mt-3">
            {importing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5" />}
            {t('admin.importNow', { defaultValue: 'استيراد' })}
          </button>

          {importError ? <p role="alert" className="mt-3 rounded-card border-2 border-[#E03131]/40 bg-[#E03131]/10 p-3 text-xs font-bold text-[#b42318] dark:text-[#ff8787]">{importError}</p> : null}
          {importSummary ? (
            <div role="status" className="mt-3 rounded-card border-2 border-brand-300 bg-brand-soft p-3 text-xs font-bold text-brand-800 dark:text-brand-200">
              {t('admin.importSummary', { defaultValue: 'تم استيراد {{success}} من {{total}}', success: importSummary.success, total: importSummary.total })}
              <ul className="mt-2 space-y-1">
                {importSummary.results.map((result) => <li key={result.id} className="font-semibold">{result.name} — {result.ok ? t('admin.ok', { defaultValue: 'نجح' }) : t('admin.failed', { defaultValue: 'فشل' })}</li>)}
              </ul>
            </div>
          ) : null}
        </section>

        <section className="card-school p-5">
          <h2 className="mb-3 text-sm font-black">{t('admin.attendanceLog', { defaultValue: 'سجل الحضور' })}</h2>
          {error ? (
            <div role="alert" className="rounded-card border-2 border-[#E03131]/40 bg-[#E03131]/10 p-3 text-xs font-bold text-[#b42318] dark:text-[#ff8787]">
              <span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" />{error}</span>
              <button type="button" onClick={() => setReload((n) => n + 1)} className="btn-chunky btn-chunky--danger btn-chunky--sm mt-3">{t('admin.retry', { defaultValue: 'إعادة المحاولة' })}</button>
            </div>
          ) : loading ? (
            <p className="flex items-center gap-2 text-xs font-semibold text-muted"><Loader2 className="h-4 w-4 animate-spin" />{t('admin.loading', { defaultValue: 'جارٍ التحميل…' })}</p>
          ) : attendance.length ? (
            <div className={`${BOX} max-h-96`}>
              <table className="w-full">
                <thead className="bg-surface-muted"><tr>
                  <th className={TH}>{t('admin.student', { defaultValue: 'التلميذ' })}</th>
                  <th className={TH}>{t('admin.class', { defaultValue: 'القسم' })}</th>
                  <th className={TH}>{t('admin.date', { defaultValue: 'التاريخ' })}</th>
                  <th className={TH}>{t('admin.status', { defaultValue: 'الحالة' })}</th>
                </tr></thead>
                <tbody>
                  {attendance.map((record) => (
                    <tr key={record.id} className="border-t-2 border-line">
                      <td className={TD}>{t('enumId', { defaultValue: 'المعرّف' })}: {record.studentId}</td>
                      <td className={TD}>{t('enumId', { defaultValue: 'المعرّف' })}: {record.classId ?? '—'}</td>
                      <td className={TD}>{record.date}</td>
                      <td className={TD}>{attStatusLabel(record.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs font-semibold text-muted">{t('admin.noData', { defaultValue: 'لا توجد بيانات.' })}</p>
          )}
        </section>
      </div>
    </div>
  )
}
