import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FolderKanban, Users, DollarSign, TrendingUp, Wallet,
  FileText, Clock, AlertTriangle, FilePlus, CheckSquare, Download,
} from 'lucide-react'
import { DashboardExportDialog } from '@/components/dashboard/DashboardExportDialog'
import { KPICard } from '@/components/dashboard/KPICard'
import { DashboardCharts } from '@/components/dashboard/DashboardCharts'
import { PcpAllBusPanel } from '@/components/pcp/PcpAllBusPanel'
import { PcpStatusChip } from '@/components/pcp/PcpStatusChip'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardStore } from '@/stores/useDashboardStore'
import { usePcpStore } from '@/stores/usePcpStore'
import { useAppStore } from '@/stores/useAppStore'
import { canCreatePcp, isPcpAdminScope } from '@/lib/roles'
import { formatAed, formatCurrency, formatPercent } from '@/lib/utils'

export function Dashboard() {
  const { metrics, loading, fetchMetrics } = useDashboardStore()
  const { systemRole, pcpRole, businessUnit, currentUserId } = useAppStore()
  const { requests, masters, loading: pcpLoading, fetchRequests, fetchMasters } = usePcpStore()
  const isHr = systemRole === 'HR'
  const showPcpData = systemRole === 'Admin' || isHr || (systemRole === 'Manager' && !!pcpRole)
  const isPcpAdmin = isPcpAdminScope(systemRole, pcpRole)
  const [exportOpen, setExportOpen] = useState(false)

  useEffect(() => { fetchMetrics() }, [fetchMetrics])

  useEffect(() => {
    if (!showPcpData) return
    fetchRequests({
      role: systemRole === 'Admin' || isHr ? 'Admin' : pcpRole!,
      businessUnit: systemRole === 'Admin' || isHr ? '' : businessUnit,
      userId: currentUserId,
    })
    fetchMasters()
  }, [showPcpData, systemRole, isHr, pcpRole, businessUnit, currentUserId, fetchRequests, fetchMasters])

  const pcpStats = useMemo(() => {
    if (!showPcpData) return null
    const inApproval = requests.filter((r) => r.status === 'In Approval').length
    const approved = requests.filter((r) => r.status === 'Approved').length
    const draft = requests.filter((r) => r.status === 'Draft').length
    const monthly = requests.reduce((s, r) => s + (r.monthlyTotal || 0), 0)
    const slaAtRisk = requests.filter((r) => r.status === 'In Approval' && (r.slaHoursRemaining ?? 999) <= 24).length
    return { total: requests.length, inApproval, approved, draft, monthly, slaAtRisk }
  }, [showPcpData, requests])

  if (loading || !metrics) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    )
  }

  const { kpis } = metrics

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {isHr ? 'Workforce & personnel planning' : `Projects, workforce, budgets${isPcpAdmin ? ' · all business units' : pcpRole ? ` · ${businessUnit}` : ''}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setExportOpen(true)}>
            <Download className="h-4 w-4" /> Export
          </Button>
        {canCreatePcp(systemRole, pcpRole) && (
          <Link to="/pcp/new">
            <Button className="bg-primary hover:bg-primary/90">
              <FilePlus className="h-4 w-4" /> New PCP
            </Button>
          </Link>
        )}
        {isPcpAdmin && (
          <>
            <Link to="/pcp/all"><Button variant="outline" size="sm"><FileText className="h-4 w-4" /> PCPs</Button></Link>
            <Link to="/pcp/approval"><Button variant="outline" size="sm"><CheckSquare className="h-4 w-4" /> Approvals</Button></Link>
          </>
        )}
        </div>
      </div>

      <DashboardExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        metrics={metrics}
        pdfOptions={{
          scopeLabel: isPcpAdmin ? 'All business units' : pcpRole ? businessUnit : isHr ? 'HR — organization' : 'Organization',
          pcpStats: pcpStats ?? undefined,
        }}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {!isHr && (
          <KPICard
            title="Active Projects"
            value={kpis.activeProjects}
            icon={FolderKanban}
            trend={kpis.projectGrowthTrend}
            subtitle={`${kpis.totalProjects} total · ${kpis.completedProjects} completed`}
          />
        )}
        <KPICard
          title="Employees"
          value={kpis.totalEmployees}
          icon={Users}
          subtitle={`${kpis.availableResources} available · ${kpis.allocatedResources} allocated`}
        />
        {!isHr && (
          <>
            <KPICard
              title="Budget Utilization"
              value={formatPercent(kpis.budgetUtilization)}
              icon={Wallet}
              subtitle={`${formatCurrency(kpis.totalActualCost)} of ${formatCurrency(kpis.totalBudget)} spent`}
            />
            <KPICard
              title="Actual Project Cost"
              value={formatCurrency(kpis.totalActualCost)}
              icon={DollarSign}
              trend={kpis.monthlyCostTrend}
              subtitle={`${formatCurrency(kpis.totalPlannedCost)} planned`}
            />
            <KPICard
              title="Revenue"
              value={formatCurrency(kpis.totalRevenue)}
              icon={TrendingUp}
              subtitle={`${formatPercent(kpis.profitMargin)} margin · ${formatCurrency(kpis.profit)} profit`}
            />
          </>
        )}

        {/* Personnel cost planning — distinct from project metrics above */}
        {pcpStats && (
          <>
            <KPICard
              title="PCP Pipeline"
              value={pcpStats.total}
              icon={FileText}
              subtitle={[
                pcpStats.inApproval ? `${pcpStats.inApproval} in approval` : null,
                pcpStats.approved ? `${pcpStats.approved} approved` : null,
                pcpStats.draft ? `${pcpStats.draft} draft` : null,
              ].filter(Boolean).join(' · ') || 'No requests yet'}
            />
            <KPICard
              title="Planned Personnel Cost"
              value={formatAed(pcpStats.monthly)}
              icon={Clock}
              subtitle="Monthly run-rate from open PCPs"
            />
            {isPcpAdmin && pcpStats.slaAtRisk > 0 && (
              <KPICard
                title="Approvals at SLA Risk"
                value={pcpStats.slaAtRisk}
                icon={AlertTriangle}
                subtitle="Under 24 hours remaining"
              />
            )}
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {!isHr && <DashboardCharts metrics={metrics} />}

        {showPcpData && !isPcpAdmin && !pcpLoading && (
          <Card>
            <CardHeader><CardTitle>Recent PCP Requests</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {requests.slice(0, 5).map((r) => (
                <Link key={r.id} to={`/pcp/requests/${r.id}`} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                  <div>
                    <p className="font-medium text-accent">{r.pcpNo}</p>
                    <p className="text-sm text-muted-foreground">{r.client} · {r.positionSummary || `${r.positions?.length} positions`}</p>
                  </div>
                  <PcpStatusChip status={r.status} />
                </Link>
              ))}
              {!requests.length && <p className="text-sm text-muted-foreground">No PCPs in your business unit yet.</p>}
            </CardContent>
          </Card>
        )}

        {showPcpData && isPcpAdmin && !pcpLoading && (
          <PcpAllBusPanel requests={requests} businessUnits={masters?.businessUnits} />
        )}
      </div>
    </div>
  )
}
