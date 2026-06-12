import type { SystemRole, PcpRole } from '@/types'
import { getPcpNavForRole, type PcpNavItem } from '@/lib/pcpNav'
import { Building2 } from 'lucide-react'

const MANAGER_BLOCKED = ['/pcp/executive', '/pcp/insights']

function pathMatches(pathname: string, prefix: string): boolean {
  if (prefix === '/') return pathname === '/'
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

export function canAccessRoute(systemRole: SystemRole, pathname: string): boolean {
  if (systemRole === 'Admin') return true

  if (systemRole === 'HR') {
    return (
      pathMatches(pathname, '/')
      || pathMatches(pathname, '/hr')
      || pathMatches(pathname, '/timesheets')
      || pathMatches(pathname, '/reports')
      || pathMatches(pathname, '/settings')
      || pathMatches(pathname, '/pcp/all')
      || pathMatches(pathname, '/pcp/requests')
    )
  }

  if (MANAGER_BLOCKED.some((p) => pathMatches(pathname, p))) return false

  return (
    pathMatches(pathname, '/')
    || pathMatches(pathname, '/projects')
    || pathMatches(pathname, '/tasks')
    || pathMatches(pathname, '/resources')
    || pathMatches(pathname, '/hr')
    || pathMatches(pathname, '/timesheets')
    || pathMatches(pathname, '/budgets')
    || pathMatches(pathname, '/reports')
    || pathMatches(pathname, '/settings')
    || pathMatches(pathname, '/pcp')
  )
}

export function canAccessAuditLog(systemRole: SystemRole): boolean {
  return systemRole === 'Admin'
}

export function canManagePcp(systemRole: SystemRole, pcpRole?: PcpRole | null): boolean {
  if (systemRole === 'Admin') return true
  if (systemRole === 'Manager' && pcpRole) return true
  return false
}

export function canCreatePcp(systemRole: SystemRole, pcpRole?: PcpRole | null): boolean {
  if (systemRole === 'Admin') return true
  if (systemRole === 'Manager' && (pcpRole === 'Requester' || pcpRole === 'Approver')) return true
  return false
}

export function isPcpAdminScope(systemRole: SystemRole, pcpRole?: PcpRole | null): boolean {
  return systemRole === 'Admin' && (pcpRole === 'Admin' || pcpRole === 'Executive')
}

export function getPcpNavForUser(systemRole: SystemRole, pcpRole?: PcpRole | null): PcpNavItem[] {
  if (systemRole === 'HR') {
    return [{ to: '/pcp/all', icon: Building2, label: 'PCPs' }]
  }
  if (systemRole === 'Admin') {
    return getPcpNavForRole(pcpRole || 'Admin')
  }
  if (systemRole === 'Manager') {
    return getPcpNavForRole(pcpRole)
  }
  return []
}

export function filterNavByRole<T extends { to: string; disabled?: boolean }>(
  items: T[],
  systemRole: SystemRole,
): T[] {
  return items.filter((item) => item.disabled || canAccessRoute(systemRole, item.to))
}

export const SYSTEM_ROLE_LABELS: Record<SystemRole, string> = {
  Admin: 'Admin',
  HR: 'HR',
  Manager: 'Manager',
}
