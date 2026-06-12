import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Employee, PcpRole, SystemRole } from '@/types'
import { syncPcpFromEmployee } from '@/lib/userContext'

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
  systemRole: SystemRole
  pcpRole: PcpRole | null
  businessUnit: string
  notificationPrefs: NotificationPrefs
  toggleDarkMode: () => void
  setSidebarOpen: (open: boolean) => void
  setCurrentUserId: (id: string) => void
  setCurrentUser: (employee: Employee) => void
  syncFromEmployee: (employee: Employee | undefined) => void
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
      currentUserId: 'emp-1',
      systemRole: 'Manager',
      pcpRole: 'Requester',
      businessUnit: 'Construction – North',
      notificationPrefs: defaultPrefs,
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setCurrentUserId: (id) => set({ currentUserId: id }),
      setCurrentUser: (employee) => {
        const { systemRole, pcpRole, businessUnit } = syncPcpFromEmployee(employee)
        set({ currentUserId: employee.id, systemRole, pcpRole, businessUnit })
      },
      syncFromEmployee: (employee) => {
        const { systemRole, pcpRole, businessUnit } = syncPcpFromEmployee(employee)
        set({ systemRole, pcpRole, businessUnit })
      },
      toggleNotificationPref: (key) =>
        set((s) => ({ notificationPrefs: { ...s.notificationPrefs, [key]: !s.notificationPrefs[key] } })),
    }),
    { name: 'app-settings' }
  )
)
