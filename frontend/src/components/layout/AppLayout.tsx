import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'
import { useAppStore } from '@/stores/useAppStore'
import { useNotificationStore } from '@/stores/useNotificationStore'
import { useEmployeeStore } from '@/stores/useEmployeeStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { cn } from '@/lib/utils'
import { ChatBot } from '@/components/chatbot/ChatBot'
import { Footer } from '@/components/layout/Footer'

export function AppLayout() {
  const { darkMode, sidebarOpen, syncFromEmployee } = useAppStore()
  const { user } = useAuthStore()
  const { fetchNotifications } = useNotificationStore()
  const { fetchEmployees } = useEmployeeStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    fetchNotifications()
    fetchEmployees()
  }, [fetchNotifications, fetchEmployees])

  useEffect(() => {
    if (user) syncFromEmployee(user)
  }, [user, syncFromEmployee])

  return (
    <div className={cn('min-h-screen gradient-bg', darkMode && 'dark')}>
      <Sidebar />
      <div
        className="flex min-h-screen flex-col transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 256 : 72 }}
      >
        <TopNav />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
      <ChatBot />
    </div>
  )
}
