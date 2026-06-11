import { useEffect, useState } from 'react'
import { Moon, Sun, Bell, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { useAppStore } from '@/stores/useAppStore'
import { useEmployeeStore } from '@/stores/useEmployeeStore'
import { api } from '@/lib/api'
import type { AuditLog } from '@/types'
import { formatDistanceToNow } from 'date-fns'

const NOTIF_LABELS: Record<string, string> = {
  taskAssignments: 'Task assignments',
  budgetAlerts: 'Budget alerts',
  resourceOverallocation: 'Resource overallocation',
  leaveApprovals: 'Leave approvals',
  taskOverdue: 'Task overdue',
}

export function Settings() {
  const {
    darkMode, toggleDarkMode, notificationPrefs, toggleNotificationPref,
    currentUserId, setCurrentUser, pcpRole, businessUnit,
  } = useAppStore()
  const { employees, fetchEmployees } = useEmployeeStore()
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])

  useEffect(() => {
    api.get<AuditLog[]>('/audit-logs?limit=20').then(setAuditLogs)
    fetchEmployees()
  }, [fetchEmployees])

  const currentUser = employees.find((e) => e.id === currentUserId)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Application preferences and audit trail</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current User</CardTitle>
            <CardDescription>
              One profile for Project Management and Personnel Cost Planning — role and business unit follow the selected person
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select
              value={currentUserId}
              onChange={(e) => {
                const employee = employees.find((emp) => emp.id === e.target.value)
                if (employee) setCurrentUser(employee)
              }}
            >
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.fullName} — {e.designation}
                  {e.pcpRole ? ` (${e.pcpRole})` : ''}
                </option>
              ))}
            </Select>
            {currentUser && (
              <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm space-y-1">
                <p className="text-muted-foreground">{currentUser.email}</p>
                <p><span className="text-muted-foreground">Department:</span> {currentUser.department}</p>
                {pcpRole ? (
                  <p>
                    <span className="text-muted-foreground">PCP access:</span>{' '}
                    <span className="font-medium text-[#E31E24]">{pcpRole}</span>
                    {' · '}{businessUnit}
                  </p>
                ) : (
                  <p className="text-muted-foreground">No PCP module role — project &amp; HR access only</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="font-medium">Dark Mode</p>
              <Button variant={darkMode ? 'default' : 'outline'} onClick={toggleDarkMode}>
                {darkMode ? 'Dark' : 'Light'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" />Notifications</CardTitle>
            <CardDescription>Toggle notification categories (saved locally)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(notificationPrefs).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm">{NOTIF_LABELS[key] || key}</span>
                <button
                  onClick={() => toggleNotificationPref(key as keyof typeof notificationPrefs)}
                  className={`h-5 w-9 rounded-full relative transition-colors ${enabled ? 'bg-primary' : 'bg-muted'}`}
                >
                  <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${enabled ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Audit Log</CardTitle>
            <CardDescription>All major actions persisted to auditlogs.json</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 rounded-lg border border-border p-3 text-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">{log.action[0]}</div>
                  <div className="flex-1">
                    <p className="font-medium">{log.details}</p>
                    <p className="text-xs text-muted-foreground">{log.action} · {log.entity} · {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
