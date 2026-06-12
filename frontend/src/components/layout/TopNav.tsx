import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, Moon, Sun, User, Check, LogOut, Sparkles } from 'lucide-react'
import { useChatBotStore } from '@/stores/useChatBotStore'
import { NavContextInfo } from '@/components/layout/NavContextInfo'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/useAppStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { useNotificationStore } from '@/stores/useNotificationStore'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

export function TopNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const isPcp = location.pathname.startsWith('/pcp')
  const { darkMode, toggleDarkMode, sidebarOpen, systemRole, pcpRole } = useAppStore()
  const { user, logout } = useAuthStore()
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore()
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const openChat = useChatBotStore((s) => s.openChat)

  const handleAskCorvi = () => {
    openChat(searchQuery)
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/60 px-6 backdrop-blur-xl"
      style={{ marginLeft: sidebarOpen ? 256 : 72 }}
    >
      <div className="relative w-full max-w-lg">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={isPcp ? 'Search PCP No., positions, cost centers…' : 'Search projects, tasks, people...'}
          className="bg-muted/50 border-0 pl-10 pr-[9.5rem]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAskCorvi()
            }
          }}
        />
        <button
          type="button"
          onClick={handleAskCorvi}
          className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary/15"
          title="Ask CORVI - The AI Assistant"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Ask By CORVI
        </button>
      </div>

      <div className="flex items-center gap-3">
        <NavContextInfo />
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

        <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign out">
          <LogOut className="h-5 w-5" />
        </Button>

        <div className="ml-2 flex items-center gap-2 rounded-lg border border-border px-3 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user?.fullName || 'User'}</p>
            <p className="text-[10px] text-muted-foreground">
              <span className="font-medium">{systemRole}</span>
              {pcpRole ? <><span className="text-primary"> · {pcpRole}</span></> : null}
              {user?.designation ? ` · ${user.designation}` : ''}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
