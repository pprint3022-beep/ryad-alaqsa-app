import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Home } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuthStore } from '../store/auth'

export default function NotFound() {
  const { t } = useTranslation()
  const token = useAuthStore((state) => state.token)
  const destination = token ? '/' : '/login'

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4 py-12">
      <div className="card-school w-full max-w-lg p-8 text-center animate-pop sm:p-10">
        <div className="mb-6 flex justify-center">
          <Logo size={72} label={t('appName')} />
        </div>

        <p className="font-display text-7xl font-black leading-none text-brand-500">404</p>
        <h1 className="mt-3 text-2xl font-black">{t('notFoundTitle')}</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
          {t('notFoundText')}
        </p>

        <Link to={destination} className="btn-chunky btn-chunky--primary mt-7">
          {token ? <Home className="h-4 w-4" aria-hidden="true" /> : null}
          <span>{token ? t('goHome') : t('signIn')}</span>
          <ArrowRight className="h-4 w-4 directional-icon" aria-hidden="true" />
        </Link>

        <p className="mt-6 text-[11px] font-semibold text-muted">{t('brandLine')}</p>
      </div>
    </div>
  )
}
