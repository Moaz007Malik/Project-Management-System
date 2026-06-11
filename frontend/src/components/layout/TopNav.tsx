import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, Bell, Moon, Sun, User, Check } from 'lucide-react'
import { StatusLegend } from '@/components/pcp/StatusLegend'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/useAppStore'
import { useNotificationStore } from '@/stores/useNotificationStore'
import { useEmployeeStore } from '@/stores/useEmployeeStore'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

export function TopNav() {
  const location = useLocation()
  const isPcp = location.pathname.startsWith('/pcp')
  const { darkMode, toggleDarkMode, sidebarOpen, currentUserId, pcpRole } = useAppStore()
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore()
  const { employees, getEmployeeById } = useEmployeeStore()
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const currentUser = getEmployeeById(currentUserId) || employees[0]

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/60 px-6 backdrop-blur-xl"
      style={{ marginLeft: sidebarOpen ? 256 : 72 }}
    >
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={isPcp ? 'Search PCP No., positions, cost centers…' : 'Search projects, tasks, people...'}
          className="pl-10 bg-muted/50 border-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        {isPcp && <StatusLegend />}
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <div className="relative">
          <Button variant="ghost" size="icon" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell className="h-5 w-5" />
            {unreadCount() > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                {unreadCount()}
              </span>
            )}
          </Button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 rounded-xl border border-border bg-card shadow-xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-border p-3">
                <h3 className="text-sm font-semibold">Notifications</h3>
                <button onClick={markAllAsRead} className="text-xs text-primary hover:underline">Mark all read</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.slice(0, 8).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={cn(
                      'flex w-full gap-3 border-b border-border p-3 text-left transition-colors hover:bg-muted/50',
                      !n.read && 'bg-primary/5'
                    )}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.message}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {n.read && <Check className="h-3 w-3 text-muted-foreground" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="ml-2 flex items-center gap-2 rounded-lg border border-border px-3 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{currentUser?.fullName || 'User'}</p>
            <p className="text-[10px] text-muted-foreground">
              {isPcp && pcpRole ? (
                <><span className="font-medium text-[#E31E24]">{pcpRole}</span>{currentUser?.designation ? ` · ${currentUser.designation}` : ''}</>
              ) : (
                currentUser?.designation
              )}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
