import { useState, type FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  AlertCircle,
  ArrowRight,
  BookOpenCheck,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import LanguageSwitcher from '../components/LanguageSwitcher'
import Logo from '../components/Logo'
import { extractApiError } from '../lib/api'
import { useAuthStore } from '../store/auth'
import type { Portal } from '../types'

interface LoginLocationState {
  from?: string
}

const PORTALS: ReadonlyArray<{ value: Portal; labelKey: string; icon: LucideIcon }> = [
  { value: 'admin_portal', labelKey: 'portalAdmin', icon: ShieldCheck },
  { value: 'private', labelKey: 'portalPrivate', icon: UsersRound },
]

const DEMO_ACCOUNTS: ReadonlyArray<{
  email: string
  roleKey: string
  portal: Portal
  icon: LucideIcon
}> = [
  { email: 'director@ryad.ma', roleKey: 'roleDirector', portal: 'admin_portal', icon: ShieldCheck },
  { email: 'teacher@ryad.ma', roleKey: 'roleTeacher', portal: 'private', icon: BookOpenCheck },
  { email: 'parent@ryad.ma', roleKey: 'roleParent', portal: 'private', icon: UsersRound },
  { email: 'student@ryad.ma', roleKey: 'roleStudent', portal: 'private', icon: GraduationCap },
]

const AUDIENCES: ReadonlyArray<{ key: string; icon: LucideIcon }> = [
  { key: 'students', icon: GraduationCap },
  { key: 'teachers', icon: BookOpenCheck },
  { key: 'parents', icon: UsersRound },
]

export default function Login() {
  const { t } = useTranslation()
  const location = useLocation()
  const token = useAuthStore((state) => state.token)
  const login = useAuthStore((state) => state.login)
  const isLoggingIn = useAuthStore((state) => state.isLoggingIn)
  const storedPortal = useAuthStore((state) => state.portal)

  const [portal, setPortal] = useState<Portal>(storedPortal)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const locationState = location.state as LoginLocationState | null
  const redirectTo =
    locationState?.from && locationState.from.startsWith('/') ? locationState.from : '/'

  const translateLoginError = (reason: unknown): string => {
    const apiError = extractApiError(reason)

    if (!apiError) {
      return t('error')
    }
    if (apiError.status === 403 || apiError.error === 'portal_mismatch') {
      return t('errorPortalMismatch')
    }
    if (apiError.status === 401 || apiError.error === 'invalid_credentials') {
      return t('errorInvalidCredentials')
    }
    if (apiError.status === 429 || apiError.error === 'rate_limited') {
      return t('errorRateLimited')
    }
    if (!apiError.status) {
      return t('errorNetwork')
    }
    return t('error')
  }

  const selectPortal = (nextPortal: Portal) => {
    setPortal(nextPortal)
    setError(null)
  }

  const fillDemo = (email: string, demoPortal: Portal) => {
    setIdentifier(email)
    setPassword('1234')
    setPortal(demoPortal)
    setError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isLoggingIn) {
      return
    }

    setError(null)
    try {
      await login(identifier.trim(), password, portal)
    } catch (reason) {
      setError(translateLoginError(reason))
    }
  }

  if (token) {
    return <Navigate to={redirectTo} replace />
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-canvas">
      <div
        className="pointer-events-none absolute -top-32 end-0 h-72 w-72 rounded-full bg-gold-300/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 start-1/3 h-72 w-72 rounded-full bg-brand-300/20 blur-3xl"
        aria-hidden="true"
      />

      <aside className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand-500 p-10 text-white lg:flex xl:p-14">
        <div className="absolute inset-0 bg-dots opacity-30" aria-hidden="true" />
        <div
          className="absolute -end-24 -top-24 h-80 w-80 rounded-full border-[24px] border-gold-400/20"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-20 -start-16 h-64 w-64 rounded-full bg-gold-400/15 blur-2xl"
          aria-hidden="true"
        />

        <div className="relative">
          <div className="inline-flex rounded-card-lg bg-white p-3 shadow-xl">
            <Logo size={76} />
          </div>
          <h2 className="mt-6 font-display text-3xl font-black leading-tight">{t('appName')}</h2>
        </div>

        <div className="relative py-10">
          <p className="font-display text-3xl font-black leading-tight text-balance xl:text-4xl">
            {t('tagline')}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {AUDIENCES.map(({ key, icon: Icon }) => (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-extrabold text-white/90 backdrop-blur-sm"
              >
                <Icon className="h-3.5 w-3.5 text-gold-300" aria-hidden="true" />
                {t(key)}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="h-0.5 w-12 rounded-full bg-gold-400" />
          <p className="mt-3 text-[11px] font-semibold leading-relaxed text-white/75">
            {t('brandLine')}
          </p>
        </div>
      </aside>

      <main className="relative flex min-h-screen w-full flex-col lg:w-1/2">
        <header className="flex items-center justify-between gap-3 px-4 py-5 sm:px-8 lg:justify-end lg:px-10">
          <div className="flex min-w-0 items-center gap-2 lg:hidden">
            <Logo size={38} />
            <span className="truncate text-sm font-black">{t('appName')}</span>
          </div>
          <LanguageSwitcher className="shrink-0" />
        </header>

        <div className="flex flex-1 items-start justify-center px-4 pb-10 sm:px-8 lg:items-center lg:px-10 lg:py-8">
          <div className="w-full max-w-md animate-slide">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
              {t('login')}
            </p>
            <h1 className="mt-1 font-display text-3xl font-black leading-tight sm:text-4xl">
              {t('loginTitle')}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t('loginSubtitle')}</p>

            <div className="card-school mt-7 p-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <div
                    role="group"
                    aria-label={t('portal')}
                    className="grid grid-cols-2 gap-2 rounded-card bg-surface-muted p-1.5"
                  >
                    {PORTALS.map(({ value, labelKey, icon: Icon }) => {
                      const isActive = portal === value
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => selectPortal(value)}
                          aria-pressed={isActive}
                          disabled={isLoggingIn}
                          className={`flex items-center justify-center gap-2 rounded-xl border-2 px-3 py-2.5 text-xs font-extrabold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                            isActive
                              ? 'border-line bg-surface text-content shadow-sm'
                              : 'border-transparent text-muted hover:text-content'
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 ${
                              isActive ? 'text-brand-600 dark:text-brand-400' : ''
                            }`}
                            aria-hidden="true"
                          />
                          <span>{t(labelKey)}</span>
                        </button>
                      )
                    })}
                  </div>
                  <p className="mt-2 text-[11px] font-semibold leading-relaxed text-muted">
                    {portal === 'admin_portal' ? t('portalAdminHint') : t('portalPrivateHint')}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="login-identifier"
                    className="mb-1.5 block text-xs font-extrabold text-content"
                  >
                    {t('email')}
                  </label>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                      aria-hidden="true"
                    />
                    <input
                      id="login-identifier"
                      name="identifier"
                      type="text"
                      inputMode="email"
                      autoComplete="username"
                      spellCheck={false}
                      required
                      disabled={isLoggingIn}
                      value={identifier}
                      onChange={(event) => {
                        setIdentifier(event.target.value)
                        setError(null)
                      }}
                      placeholder="director@ryad.ma"
                      className="input-school ps-10"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="login-password"
                    className="mb-1.5 block text-xs font-extrabold text-content"
                  >
                    {t('password')}
                  </label>
                  <div className="relative">
                    <LockKeyhole
                      className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                      aria-hidden="true"
                    />
                    <input
                      id="login-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      minLength={4}
                      disabled={isLoggingIn}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value)
                        setError(null)
                      }}
                      placeholder="••••••••"
                      className="input-school ps-10 pe-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                      aria-pressed={showPassword}
                      disabled={isLoggingIn}
                      className="absolute end-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted transition hover:bg-surface-muted hover:text-content disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                {error ? (
                  <div
                    role="alert"
                    className="flex items-start gap-2 rounded-card border-2 border-[#E03131]/30 bg-[#FFF0F0] px-3.5 py-3 text-xs font-bold leading-relaxed text-[#B42318] animate-shake dark:border-[#E03131]/40 dark:bg-[#E03131]/10 dark:text-[#FFB4B4]"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{error}</span>
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  aria-busy={isLoggingIn}
                  className="btn-chunky btn-chunky--primary w-full"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      <span>{t('loading')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('signIn')}</span>
                      <ArrowRight className="h-4 w-4 directional-icon" aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-3" aria-hidden="true">
                <span className="h-0.5 flex-1 bg-line" />
                <span className="rounded-full bg-gold-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-gold-800 dark:bg-gold-400/15 dark:text-gold-300">
                  {t('demo')}
                </span>
                <span className="h-0.5 flex-1 bg-line" />
              </div>
              <p className="mt-3 text-center text-[11px] font-semibold leading-relaxed text-muted">
                {t('demoHint')}
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map(({ email, roleKey, portal: demoPortal, icon: Icon }) => (
                  <button
                    key={email}
                    type="button"
                    onClick={() => fillDemo(email, demoPortal)}
                    disabled={isLoggingIn}
                    aria-label={`${t(roleKey)} — ${email}`}
                    className="group flex min-w-0 flex-col gap-1 rounded-card border-2 border-line bg-surface px-3 py-2.5 text-start transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="flex min-w-0 items-center gap-1.5 text-[11px] font-extrabold">
                      <Icon
                        className="h-3.5 w-3.5 shrink-0 text-gold-600 dark:text-gold-400"
                        aria-hidden="true"
                      />
                      <span className="truncate">{t(roleKey)}</span>
                    </span>
                    <span
                      className="w-full truncate text-[10px] font-semibold text-muted"
                      dir="ltr"
                    >
                      {email}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-8 text-center text-[10px] font-semibold leading-relaxed text-muted lg:hidden">
              {t('brandLine')}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
