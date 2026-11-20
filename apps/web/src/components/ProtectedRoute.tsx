import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import type { Portal, Role } from '../types'

interface ProtectedRouteProps {
  /** Roles allowed to see the nested routes. Omit to allow every signed-in user. */
  roles?: readonly Role[]
  /** Optional extra portal check on top of the role check. */
  portal?: Portal
}

export default function ProtectedRoute({ roles, portal }: ProtectedRouteProps) {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />
  }

  // The session may still be hydrating after a reload; wait for the user.
  if (user && roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  if (user && portal && user.portal !== portal) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
