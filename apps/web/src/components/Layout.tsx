import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Activity,
  Baby,
  BarChart3,
  Bell,
  BookOpen,
  BookOpenCheck,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  FileCheck2,
  FileText,
  FolderOpen,
  GraduationCap,
  HeartPulse,
  Languages,
  LayoutDashboard,
  Library,
  Lightbulb,
  ListChecks,
  LogOut,
  Menu,
  MessageCircle,
  MessageSquare,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  Users,
  UsersRound,
  X,
  type LucideIcon,
} from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import Logo from './Logo'
import { useAuthStore } from '../store/auth'
import type { Role } from '../types'

interface NavItem {
  key: string
  path: string
  icon: LucideIcon
}

const ADMIN_NAV: ReadonlyArray<NavItem> = [
  { key: 'navReports', path: '/admin/reports', icon: BarChart3 },
  { key: 'navReportCards', path: '/admin/report-cards', icon: FileText },
  { key: 'navTimetable', path: '/admin/timetable', icon: CalendarClock },
  { key: 'navCardsCenter', path: '/admin/cards-center', icon: ClipboardCheck },
  { key: 'navExperiments', path: '/admin/experiments', icon: Sparkles },
  { key: 'navInterventionPlans', path: '/admin/intervention-plans', icon: Target },
  { key: 'navLessonReview', path: '/admin/lesson-review', icon: ClipboardCheck },
  { key: 'navGradeResults', path: '/admin/grade-results', icon: GraduationCap },
  { key: 'navEngagement', path: '/admin/engagement', icon: Activity },
  { key: 'navCurriculum', path: '/admin/curriculum', icon: BookOpen },
  { key: 'navApprovals', path: '/admin/approvals', icon: FileCheck2 },
  { key: 'navCommunications', path: '/admin/communications', icon: MessageSquare },
  { key: 'navPeople', path: '/admin/people', icon: UsersRound },
  { key: 'navCommunity', path: '/admin/community', icon: Users },
  { key: 'navKnowledge', path: '/admin/knowledge', icon: Library },
  { key: 'navGovernance', path: '/admin/governance', icon: ShieldCheck },
]

const TEACHER_NAV: ReadonlyArray<NavItem> = [
  { key: 'navClasses', path: '/teacher/classes', icon: BookOpenCheck },
  { key: 'navAttendance', path: '/teacher/attendance', icon: ClipboardCheck },
  { key: 'navTimetable', path: '/teacher/timetable', icon: CalendarClock },
  { key: 'navEngagement', path: '/teacher/engagement', icon: Activity },
  { key: 'navCurriculum', path: '/teacher/curriculum', icon: BookOpen },
  { key: 'navQuestionBank', path: '/teacher/question-bank', icon: ListChecks },
  { key: 'navGrades', path: '/teacher/grades', icon: GraduationCap },
  { key: 'navFeedbackCards', path: '/teacher/feedback-cards', icon: FileCheck2 },
  { key: 'navCases', path: '/teacher/cases', icon: ClipboardList },
  { key: 'navWellbeing', path: '/teacher/wellbeing', icon: HeartPulse },
  { key: 'navInterventionPlans', path: '/teacher/intervention-plans', icon: Target },
  { key: 'navThreads', path: '/teacher/threads', icon: MessageCircle },
  { key: 'navLessonEditor', path: '/teacher/lesson-editor', icon: BookOpenCheck },
  { key: 'navLessonStudio', path: '/teacher/lesson-studio', icon: Sparkles },
  { key: 'navTeacherTraining', path: '/teacher/training', icon: GraduationCap },
  { key: 'navGradeEntry', path: '/teacher/grades-entry', icon: GraduationCap },
  { key: 'navCommunications', path: '/teacher/communications', icon: MessageSquare },
  { key: 'navAlerts', path: '/teacher/alerts', icon: Bell },
]

const PARENT_NAV: ReadonlyArray<NavItem> = [
  { key: 'navChildren', path: '/parent/children', icon: Baby },
  { key: 'navReportCard', path: '/parent/report-card', icon: FileText },
  { key: 'navTimetable', path: '/parent/timetable', icon: CalendarClock },
  { key: 'navInsights', path: '/parent/insights', icon: Sparkles },
  { key: 'navTalents', path: '/parent/talents', icon: Lightbulb },
  { key: 'navActivities', path: '/parent/activities', icon: CalendarDays },
  { key: 'navMessages', path: '/parent/messages', icon: MessageSquare },
  { key: 'navPrivacyCenter', path: '/parent/privacy-center', icon: ShieldCheck },
  { key: 'navWeeklySummary', path: '/parent/weekly-summary', icon: CalendarRange },
  { key: 'navPortfolio', path: '/parent/portfolio', icon: FolderOpen },
]

const STUDENT_NAV: ReadonlyArray<NavItem> = [
  { key: 'navLearningPath', path: '/student/path', icon: Route },
  { key: 'navAmazigh', path: '/student/amazigh', icon: Languages },
  { key: 'navTimetable', path: '/student/timetable', icon: CalendarClock },
  { key: 'navAssessments', path: '/student/assessments', icon: ClipboardCheck },
  { key: 'navReportCard', path: '/student/report-card', icon: FileText },
  { key: 'navInsights', path: '/student/insights', icon: Sparkles },
  { key: 'navPortfolio', path: '/student/portfolio', icon: FolderOpen },
  { key: 'navProfile', path: '/student/profile', icon: UserRound },
]

const ROLE_NAV: Partial<Record<Role, ReadonlyArray<NavItem>>> = {
  director: ADMIN_NAV,
  deputy: ADMIN_NAV,
  supervisor: ADMIN_NAV,
  clerk: ADMIN_NAV,
  admin: ADMIN_NAV,
  teacher: TEACHER_NAV,
  parent: PARENT_NAV,
  student: STUDENT_NAV,
}

function navForRole(role?: Role): ReadonlyArray<NavItem> {
  return role ? ROLE_NAV[role] ?? [] : []
}

const ROLE_KEYS: Record<Role, string> = {
  director: 'roleDirector',
  deputy: 'roleDeputy',
  supervisor: 'roleSupervisor',
  clerk: 'roleClerk',
  admin: 'roleAdmin',
  teacher: 'roleTeacher',
  parent: 'roleParent',
  student: 'roleStudent',
}

interface SidebarContentProps {
  onNavigate?: () => void
  onClose?: () => void
}

function SidebarContent({ onNavigate, onClose }: SidebarContentProps) {
  const { t } = useTranslation()
  const portal = useAuthStore((state) => state.portal)
  const role = useAuthStore((state) => state.user?.role)
  const portalLabel = portal === 'admin_portal' ? t('portalAdmin') : t('portalPrivate')
  const items = navForRole(role)

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="flex items-center gap-3 px-5 pb-5 pt-6">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-card"
        >
          <Logo size={46} />
          <span className="min-w-0">
            <span className="block truncate font-display text-lg font-black leading-tight text-content">
              {t('appName')}
            </span>
            <span className="mt-0.5 block text-[11px] font-semibold leading-snug text-muted">
              {t('tagline')}
            </span>
          </span>
        </Link>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            autoFocus
            aria-label={t('closeMenu')}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border-2 border-line bg-surface text-muted transition hover:border-brand-300 hover:text-content"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <nav aria-label={t('navigation')} className="flex-1 space-y-1 px-3 pb-4">
        <NavLink
          to="/"
          end
          onClick={onNavigate}
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-card px-3 py-2.5 text-sm font-extrabold transition ${
              isActive
                ? 'bg-brand-soft text-brand-700 dark:text-brand-300'
                : 'text-muted hover:bg-surface-muted hover:text-content'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`grid h-9 w-9 place-items-center rounded-xl transition ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-chunky-sm'
                    : 'bg-surface-muted text-muted group-hover:text-content'
                }`}
              >
                <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="flex-1">{t('dashboard')}</span>
            </>
          )}
        </NavLink>

        <div className="my-3 border-t-2 border-line" aria-hidden="true" />

        {items.map(({ key, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-card px-3 py-2.5 text-sm font-extrabold transition ${
                isActive
                  ? 'bg-brand-soft text-brand-700 dark:text-brand-300'
                  : 'text-muted hover:bg-surface-muted hover:text-content'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`grid h-9 w-9 place-items-center rounded-xl transition ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-chunky-sm'
                      : 'bg-surface-muted text-muted group-hover:text-content'
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="flex-1">{t(key)}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-4">
        <div className="rounded-card border-2 border-line bg-surface-muted p-4">
          <div className="flex items-center gap-2 text-brand-700 dark:text-brand-300">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-extrabold">{portalLabel}</span>
          </div>
          <p className="mt-2 text-[11px] font-semibold leading-relaxed text-muted">
            {t('brandLine')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Layout() {
  const { t } = useTranslation()
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const portal = useAuthStore((state) => state.portal)
  const logout = useAuthStore((state) => state.logout)

  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const portalLabel = portal === 'admin_portal' ? t('portalAdmin') : t('portalPrivate')
  const roleLabel = user ? t(ROLE_KEYS[user.role]) : t('login')
  const initial = user?.name.trim().charAt(0).toUpperCase() || '?'
  const activeNavKey = navForRole(user?.role).find((item) => item.path === location.pathname)?.key
  const pageTitle = t(activeNavKey ?? 'dashboard')

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false)
    menuButtonRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!mobileOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMobileMenu()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileOpen, closeMobileMenu])

  useEffect(() => {
    if (!userMenuOpen) {
      return
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        event.target instanceof Node &&
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target)
      ) {
        setUserMenuOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [userMenuOpen])

  const handleSignOut = () => {
    setUserMenuOpen(false)
    setMobileOpen(false)
    logout()
  }

  return (
    <div className="min-h-screen bg-canvas text-content">
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-72 flex-col border-e-2 border-line bg-surface lg:flex">
        <SidebarContent />
      </aside>

      <div className="lg:ps-72">
        <header className="sticky top-0 z-30 border-b-2 border-line bg-canvas/85 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => {
                  setUserMenuOpen(false)
                  setMobileOpen(true)
                }}
                aria-label={t('openMenu')}
                aria-controls="mobile-sidebar"
                aria-expanded={mobileOpen}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border-2 border-line bg-surface text-content transition hover:border-brand-300 lg:hidden"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>

              <div className="min-w-0 lg:hidden">
                <h1 className="truncate text-base font-black leading-tight">{pageTitle}</h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-600 dark:text-brand-400">
                  {t('appName')}
                </p>
              </div>

              <div className="hidden min-w-0 lg:block">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
                  {t('overview')}
                </p>
                <h1 className="truncate text-lg font-black leading-tight">{pageTitle}</h1>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <LanguageSwitcher />

              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                  className="flex items-center gap-2 rounded-full border-2 border-line bg-surface py-1 ps-1 pe-2 text-start transition hover:border-brand-300 sm:pe-3"
                >
                  <span
                    aria-hidden="true"
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-500 text-sm font-black text-white"
                  >
                    {initial}
                  </span>
                  <span className="hidden min-w-0 sm:block">
                    <span className="block max-w-[9rem] truncate text-sm font-extrabold leading-tight">
                      {user?.name ?? t('appName')}
                    </span>
                    <span className="block truncate text-[11px] font-bold text-muted">
                      {roleLabel}
                    </span>
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted transition-transform ${
                      userMenuOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {userMenuOpen ? (
                  <div
                    role="menu"
                    aria-label={t('userMenu')}
                    className="absolute end-0 top-[calc(100%+0.5rem)] z-50 w-64 overflow-hidden rounded-card border-2 border-line bg-surface shadow-card animate-pop"
                  >
                    <div className="border-b-2 border-line bg-surface-muted px-4 py-3">
                      <p className="truncate text-sm font-extrabold">
                        {user?.name ?? t('appName')}
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-muted">{roleLabel}</p>
                      <span className="mt-2 inline-flex items-center rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-brand-700 dark:text-brand-300">
                        {portalLabel}
                      </span>
                    </div>

                    <div className="p-2">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-start text-sm font-extrabold text-[#FF4B4B] transition hover:bg-[#FF4B4B]/10"
                      >
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        {t('signOut')}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          <aside
            id="mobile-sidebar"
            role="dialog"
            aria-modal="true"
            aria-label={t('navigation')}
            className="absolute inset-y-0 start-0 flex w-[19rem] max-w-[85vw] flex-col border-e-2 border-line bg-surface shadow-2xl animate-slide"
          >
            <SidebarContent onNavigate={closeMobileMenu} onClose={closeMobileMenu} />
          </aside>
        </div>
      ) : null}
    </div>
  )
}
