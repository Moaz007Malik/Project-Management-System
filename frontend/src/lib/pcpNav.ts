import {
  FilePlus, List, CheckSquare, History,
  BarChart3, Sparkles, Building2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { PcpRole } from '@/types'

export interface PcpNavItem {
  to: string
  icon: LucideIcon
  label: string
}

export function getPcpNavForRole(role: PcpRole | null | undefined): PcpNavItem[] {
  if (!role) return []
  switch (role) {
    case 'Requester':
      return [
        { to: '/pcp/new', icon: FilePlus, label: 'New PCP Request' },
        { to: '/pcp/requests', icon: List, label: 'My Requests' },
        { to: '/pcp/revisions', icon: History, label: 'Revision History' },
      ]
    case 'Approver':
      return [
        { to: '/pcp/approval', icon: CheckSquare, label: 'Approval Queue' },
        { to: '/pcp/requests', icon: List, label: 'My Requests' },
        { to: '/pcp/revisions', icon: History, label: 'Revision History' },
      ]
    case 'Admin':
      return [
        { to: '/pcp/all', icon: Building2, label: 'PCPs' },
        { to: '/pcp/approval', icon: CheckSquare, label: 'Approval Queue' },
        { to: '/pcp/revisions', icon: History, label: 'Revision History' },
      ]
    case 'Executive':
      return [
        { to: '/pcp/executive', icon: BarChart3, label: 'Executive Dashboard' },
        { to: '/pcp/insights', icon: Sparkles, label: 'AI Insights & Forecasts' },
        { to: '/pcp/all', icon: List, label: 'PCPs' },
      ]
    default:
      return []
  }
}
