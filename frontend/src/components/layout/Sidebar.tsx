import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, FolderKanban, CheckSquare, Users, UserCircle,
  Clock, DollarSign, BarChart3, Settings, ChevronLeft, FilePlus, List,
  History, Sparkles, Building2, IdCard,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/stores/useAppStore'
import { getPcpNavForRole } from '@/lib/pcpNav'

interface NavItem {
  to: string
  icon: LucideIcon
  label: string
  disabled?: boolean
  pcp?: boolean
}

const baseNavItems: NavItem[] = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/resources', icon: Users, label: 'Resources' },
  { to: '/hr', icon: UserCircle, label: 'HR' },
  { to: '/timesheets', icon: Clock, label: 'Timesheets' },
  { to: '/budgets', icon: DollarSign, label: 'Budgets' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

const trailingNavItems: NavItem[] = [
  { to: '/hrms', icon: IdCard, label: 'HRMS', disabled: true },
]

const pcpIconByPath: Record<string, typeof FilePlus> = {
  '/pcp/new': FilePlus,
  '/pcp/requests': List,
  '/pcp/all': Building2,
  '/pcp/approval': CheckSquare,
  '/pcp/revisions': History,
  '/pcp/executive': BarChart3,
  '/pcp/insights': Sparkles,
  '/pcp/admin': Settings,
}

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, pcpRole } = useAppStore()
  const pcpNavItems = getPcpNavForRole(pcpRole)

  const navItems: NavItem[] = [
    ...baseNavItems,
    ...pcpNavItems
      .filter((item) => !baseNavItems.some((b) => b.to === item.to))
      .map((item) => ({
        to: item.to,
        icon: pcpIconByPath[item.to] || item.icon,
        label: item.label,
        pcp: true,
      })),
    ...trailingNavItems,
  ]

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-card/80 backdrop-blur-xl transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-[72px]'
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <img src="/logo.png" alt="Descon" className="h-9 w-9 rounded-lg object-contain" />
        {sidebarOpen && (
          <div className="animate-fade-in">
            <h1 className="text-sm font-bold tracking-tight">Descon</h1>
            <p className="text-[10px] text-muted-foreground">Project & Personnel Planning</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) =>
          item.disabled ? (
            <span
              key={item.to}
              aria-disabled="true"
              className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground/50 opacity-60"
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span className="leading-tight">{item.label}</span>}
            </span>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? item.pcp
                      ? 'bg-[#E31E24]/10 text-[#E31E24] shadow-sm'
                      : 'bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && <span className="leading-tight">{item.label}</span>}
            </NavLink>
          )
        )}
      </nav>

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="m-3 flex items-center justify-center rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ChevronLeft className={cn('h-4 w-4 transition-transform', !sidebarOpen && 'rotate-180')} />
      </button>
    </aside>
  )
}
