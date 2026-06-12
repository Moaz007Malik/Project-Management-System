import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppStore } from '@/stores/useAppStore'
import { canAccessRoute } from '@/lib/roles'

export function RoleGuard() {
  const { pathname } = useLocation()
  const { systemRole } = useAppStore()

  if (!canAccessRoute(systemRole, pathname)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
