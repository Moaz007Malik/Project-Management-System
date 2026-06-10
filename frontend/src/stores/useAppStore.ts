import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface NotificationPrefs {
  taskAssignments: boolean
  budgetAlerts: boolean
  resourceOverallocation: boolean
  leaveApprovals: boolean
  taskOverdue: boolean
}

interface AppState {
  darkMode: boolean
  sidebarOpen: boolean
  currentUserId: string
  notificationPrefs: NotificationPrefs
  toggleDarkMode: () => void
  setSidebarOpen: (open: boolean) => void
  setCurrentUserId: (id: string) => void
  toggleNotificationPref: (key: keyof NotificationPrefs) => void
}

const defaultPrefs: NotificationPrefs = {
  taskAssignments: true,
  budgetAlerts: true,
  resourceOverallocation: true,
  leaveApprovals: true,
  taskOverdue: true,
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      darkMode: false,
      sidebarOpen: true,
      currentUserId: 'emp-4',
      notificationPrefs: defaultPrefs,
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setCurrentUserId: (id) => set({ currentUserId: id }),
      toggleNotificationPref: (key) =>
        set((s) => ({ notificationPrefs: { ...s.notificationPrefs, [key]: !s.notificationPrefs[key] } })),
    }),
    { name: 'app-settings' }
  )
)
