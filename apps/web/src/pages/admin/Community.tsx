import { useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertTriangle,
  CalendarDays,
  GraduationCap,
  HandHeart,
  Loader2,
  RefreshCw,
  Trophy,
  type LucideIcon,
} from 'lucide-react'
import { apiGet } from '../../lib/api'

interface Member {
  id?: string
  studentId?: string
  activityId?: string
  activity?: string
  enrolledAt?: string
  status?: string
  studentName?: string
  level?: string
}
interface MembersResponse {
  members: Member[]
  total?: number
}
interface Alumnus {
  id?: string
  name?: string
  graduationYear?: number
  currentRole?: string
  mentorAvailable?: boolean
}
interface AlumniResponse {
  alumni: Alumnus[]
}
interface Volunteer {
  id?: string
  name?: string
  role?: string
  availability?: string
  hours?: number
}
interface VolunteersResponse {
  volunteers: Volunteer[]
}
interface CalendarEvent {
  id?: string
  title?: string
  date?: string
  type?: string
  audience?: string
  level?: string
}
interface EventsResponse {
  events: CalendarEvent[]
}

interface CommunityData {
  members: Member[]
  alumni: Alumnus[]
  volunteers: Volunteer[]
  events: CalendarEvent[]
}

const EMPTY_DATA: CommunityData = { members: [], alumni: [], volunteers: [], events: [] }

const TH = 'px-3 py-2 text-start text-[11px] font-black text-muted'
const TD = 'px-3 py-2 text-[11px] font-semibold'
const TABLE_BOX = 'overflow-x-auto rounded-card border-2 border-line bg-surface'

type EnumPair = readonly [string, string]

const LEVEL_MAP: Record<string, EnumPair> = {
  high: ['enumHigh', 'مرتفع'],
  medium: ['enumMedium', 'متوسط'],
  low: ['enumLow', 'منخفض'],
}

const EVENT_TYPE_MAP: Record<string, EnumPair> = {
  club: ['enumClub', 'نادي'],
  activity: ['enumActivity', 'نشاط'],
}

const AUDIENCE_MAP: Record<string, EnumPair> = {
  all: ['enumAll', 'الجميع'],
  students: ['enumStudent', 'تلميذ'],
  parents: ['enumParent', 'ولي الأمر'],
  teachers: ['enumTeacher', 'المعلم'],
}

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

export default function Community() {
  const { t, i18n } = useTranslation()
  const [data, setData] = useState<CommunityData>(EMPTY_DATA)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reload, setReload] = useState(0)

  const locale =
    i18n.resolvedLanguage === 'ar'
      ? 'ar-MA'
      : i18n.resolvedLanguage === 'amz'
        ? 'fr'
        : (i18n.resolvedLanguage ?? 'ar-MA')

  const enumText = (
    value: string,
    map: Record<string, EnumPair>,
    fallback: EnumPair = ['enumOther', 'أخرى'],
  ): string => {
    const raw = String(value ?? '')
    const pair = map[raw] ?? map[raw.toLowerCase()] ?? fallback
    return t(pair[0], { defaultValue: pair[1] })
  }

  const formatDate = (value?: string) => {
    if (!value) return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)
  }

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([
      apiGet<MembersResponse>('/activities/members'),
      apiGet<AlumniResponse>('/alumni'),
      apiGet<VolunteersResponse>('/volunteers'),
      apiGet<EventsResponse>('/calendar/events'),
    ])
      .then(([members, alumni, volunteers, events]) => {
        if (cancelled) return
        setData({
          members: members.members ?? [],
          alumni: alumni.alumni ?? [],
          volunteers: volunteers.volunteers ?? [],
          events: events.events ?? [],
        })
      })
      .catch(() => {
        if (!cancelled) {
          setError(t('admin.communityLoadError', { defaultValue: 'تعذّر تحميل بيانات المجتمع.' }))
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [reload, t])

  const today = new Date().toISOString().slice(0, 10)
  const upcoming = data.events
    .filter((event) => !event.date || event.date >= today)
    .sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''))

  return (
    <div className="space-y-5 animate-slide">
      <section className="card-school flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h1 className="font-display text-2xl font-black">
            {t('admin.communityTitle', { defaultValue: 'المجتمع المدرسي' })}
          </h1>
          <p className="mt-1 text-xs font-semibold text-muted">
            {t('admin.communityHint', {
              defaultValue: 'الأندية والمسابقات، الخريجون، المتطوعون، والأحداث القادمة.',
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
          {t('admin.communityLoading', { defaultValue: 'جارٍ تحميل بيانات المجتمع…' })}
        </div>
      ) : null}

      {!loading && !error ? (
        <>
          <Panel
            title={t('admin.communityMembers', { defaultValue: 'عضوية الأندية والمسابقات' })}
            icon={Trophy}
            count={data.members.length}
          >
            {data.members.length ? (
              <div className={TABLE_BOX}>
                <table className="w-full">
                  <thead className="bg-surface-muted">
                    <tr>
                      <th className={TH}>{t('admin.communityStudent', { defaultValue: 'التلميذ' })}</th>
                      <th className={TH}>{t('admin.communityLevel', { defaultValue: 'المستوى' })}</th>
                      <th className={TH}>{t('admin.communityActivity', { defaultValue: 'النشاط' })}</th>
                      <th className={TH}>{t('admin.communityStatus', { defaultValue: 'الحالة' })}</th>
                      <th className={TH}>{t('admin.communityDate', { defaultValue: 'التاريخ' })}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.members.map((member, index) => (
                      <tr
                        key={member.id ?? `${member.studentId ?? ''}-${member.activityId ?? ''}-${index}`}
                        className="border-t-2 border-line"
                      >
                        <td className={TD}>{member.studentName ?? member.studentId ?? '—'}</td>
                        <td className={TD}>{member.level ?? '—'}</td>
                        <td className={TD}>{member.activity ?? member.activityId ?? '—'}</td>
                        <td className={TD}>{member.status ?? '—'}</td>
                        <td className={TD}>{formatDate(member.enrolledAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Empty text={t('admin.communityNoMembers', { defaultValue: 'لا توجد طلبات عضوية حاليًا.' })} />
            )}
          </Panel>

          <div className="grid gap-4 lg:grid-cols-2">
            <Panel
              title={t('admin.communityAlumni', { defaultValue: 'الخريجون' })}
              icon={GraduationCap}
              count={data.alumni.length}
            >
              {data.alumni.length ? (
                <ul className="space-y-2">
                  {data.alumni.map((alumnus, index) => (
                    <li
                      key={alumnus.id ?? index}
                      className="rounded-card border-2 border-line bg-surface p-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="truncate text-sm font-extrabold">{alumnus.name ?? '—'}</span>
                        <span className="shrink-0 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-black text-brand-700 dark:bg-brand-400/15 dark:text-brand-300">
                          {alumnus.graduationYear ?? '—'}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] font-semibold text-muted">
                        {t('admin.communityCurrentRole', { defaultValue: 'الدور الحالي' })}:{' '}
                        {alumnus.currentRole ?? '—'}
                      </p>
                      <p className="mt-1 text-[11px] font-bold">
                        {alumnus.mentorAvailable
                          ? t('admin.communityMentorAvailable', { defaultValue: 'متاح للتوجيه' })
                          : t('admin.communityMentorUnavailable', { defaultValue: 'غير متاح للتوجيه' })}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <Empty text={t('admin.communityNoAlumni', { defaultValue: 'لا توجد بيانات خريجين حاليًا.' })} />
              )}
            </Panel>

            <Panel
              title={t('admin.communityVolunteers', { defaultValue: 'المتطوعون' })}
              icon={HandHeart}
              count={data.volunteers.length}
            >
              {data.volunteers.length ? (
                <ul className="space-y-2">
                  {data.volunteers.map((volunteer, index) => (
                    <li
                      key={volunteer.id ?? index}
                      className="rounded-card border-2 border-line bg-surface p-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="truncate text-sm font-extrabold">{volunteer.name ?? '—'}</span>
                        <span className="shrink-0 rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-black text-gold-800 dark:bg-gold-400/15 dark:text-gold-300">
                          {t('admin.communityHours', { defaultValue: 'الساعات' })}: {volunteer.hours ?? '—'}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] font-semibold text-muted">
                        {t('admin.communityRole', { defaultValue: 'الدور' })}: {volunteer.role ?? '—'}
                      </p>
                      <p className="mt-1 text-[11px] font-semibold text-muted">
                        {t('admin.communityAvailability', { defaultValue: 'التوفّر' })}:{' '}
                        {volunteer.availability ?? '—'}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <Empty
                  text={t('admin.communityNoVolunteers', { defaultValue: 'لا يوجد متطوعون حاليًا.' })}
                />
              )}
            </Panel>
          </div>

          <Panel
            title={t('admin.communityEvents', { defaultValue: 'الأحداث القادمة' })}
            icon={CalendarDays}
            count={upcoming.length}
          >
            {upcoming.length ? (
              <div className={TABLE_BOX}>
                <table className="w-full">
                  <thead className="bg-surface-muted">
                    <tr>
                      <th className={TH}>{t('admin.communityDate', { defaultValue: 'التاريخ' })}</th>
                      <th className={TH}>{t('admin.title', { defaultValue: 'العنوان' })}</th>
                      <th className={TH}>
                        {t('admin.communityEventType', { defaultValue: 'النوع' })}
                      </th>
                      <th className={TH}>
                        {t('admin.communityAudience', { defaultValue: 'الفئة المستهدفة' })}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcoming.map((event) => (
                      <tr key={event.id ?? event.title ?? event.date} className="border-t-2 border-line">
                        <td className={TD}>{formatDate(event.date)}</td>
                        <td className={TD}>
                          {event.title ?? '—'}
                          {event.level ? (
                            <span className="mt-0.5 block text-[10px] font-semibold text-muted">
                              {enumText(event.level, LEVEL_MAP)}
                            </span>
                          ) : null}
                        </td>
                        <td className={TD}>{event.type ? enumText(event.type, EVENT_TYPE_MAP) : '—'}</td>
                        <td className={TD}>{event.audience ? enumText(event.audience, AUDIENCE_MAP) : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Empty text={t('admin.communityNoEvents', { defaultValue: 'لا توجد أحداث قادمة حاليًا.' })} />
            )}
          </Panel>

        </>
      ) : null}
    </div>
  )
}
