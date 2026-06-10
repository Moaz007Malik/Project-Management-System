import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { useAppStore } from '@/stores/useAppStore'
import { useNotificationStore } from '@/stores/useNotificationStore'
import { useEmployeeStore } from '@/stores/useEmployeeStore'
import { cn } from '@/lib/utils'
import { ChatBot } from '@/components/chatbot/ChatBot'

export function AppLayout() {
  const { darkMode, sidebarOpen } = useAppStore()
  const { fetchNotifications } = useNotificationStore()
  const { fetchEmployees } = useEmployeeStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    fetchNotifications()
    fetchEmployees()
  }, [fetchNotifications, fetchEmployees])

  return (
    <div className={cn('min-h-screen gradient-bg', darkMode && 'dark')}>
      <Sidebar />
      <div className="transition-all duration-300" style={{ marginLeft: sidebarOpen ? 256 : 72 }}>
        <TopNav />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
      <ChatBot />
    </div>
  )
}
