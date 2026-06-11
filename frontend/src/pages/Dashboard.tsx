import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  FolderKanban, Users, DollarSign, TrendingUp, Wallet,
  FileText, Clock, AlertTriangle, FilePlus, CheckSquare,
} from 'lucide-react'
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
import { formatAed, formatCurrency, formatPercent } from '@/lib/utils'

export function Dashboard() {
  const { metrics, loading, fetchMetrics } = useDashboardStore()
  const { pcpRole, businessUnit, currentUserId } = useAppStore()
  const { requests, masters, loading: pcpLoading, fetchRequests, fetchMasters } = usePcpStore()
  const isAdmin = pcpRole === 'Admin'

  useEffect(() => { fetchMetrics() }, [fetchMetrics])

  useEffect(() => {
    if (!pcpRole) return
    fetchRequests({
      role: isAdmin ? 'Admin' : pcpRole,
      businessUnit: isAdmin ? '' : businessUnit,
      userId: currentUserId,
    })
    fetchMasters()
  }, [pcpRole, isAdmin, businessUnit, currentUserId, fetchRequests, fetchMasters])

  const pcpStats = useMemo(() => {
    if (!pcpRole) return null
    const inApproval = requests.filter((r) => r.status === 'In Approval').length
    const approved = requests.filter((r) => r.status === 'Approved').length
    const draft = requests.filter((r) => r.status === 'Draft').length
    const monthly = requests.reduce((s, r) => s + (r.monthlyTotal || 0), 0)
    const slaAtRisk = requests.filter((r) => r.status === 'In Approval' && (r.slaHoursRemaining ?? 999) <= 24).length
    return { total: requests.length, inApproval, approved, draft, monthly, slaAtRisk }
  }, [pcpRole, requests])

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
            Projects, workforce, budgets{isAdmin ? ' · all business units' : pcpRole ? ` · ${businessUnit}` : ''}
          </p>
        </div>
        {pcpRole && (pcpRole === 'Requester' || pcpRole === 'Admin') && (
          <div className="flex flex-wrap gap-2">
            <Link to="/pcp/new">
              <Button className="bg-[#E31E24] hover:bg-[#c9191f]">
                <FilePlus className="h-4 w-4" /> New PCP
              </Button>
            </Link>
            {isAdmin && (
              <>
                <Link to="/pcp/all"><Button variant="outline" size="sm"><FileText className="h-4 w-4" /> All PCPs</Button></Link>
                <Link to="/pcp/approval"><Button variant="outline" size="sm"><CheckSquare className="h-4 w-4" /> Approvals</Button></Link>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Project delivery */}
        <KPICard
          title="Active Projects"
          value={kpis.activeProjects}
          icon={FolderKanban}
          trend={kpis.projectGrowthTrend}
          subtitle={`${kpis.totalProjects} total · ${kpis.completedProjects} completed`}
        />
        <KPICard
          title="Employees"
          value={kpis.totalEmployees}
          icon={Users}
          subtitle={`${kpis.availableResources} available · ${kpis.allocatedResources} allocated`}
        />
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
            {isAdmin && pcpStats.slaAtRisk > 0 && (
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
        <DashboardCharts metrics={metrics} />

        {pcpRole && !isAdmin && !pcpLoading && (
          <Card>
            <CardHeader><CardTitle>Recent PCP Requests</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {requests.slice(0, 5).map((r) => (
                <Link key={r.id} to={`/pcp/requests/${r.id}`} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
                  <div>
                    <p className="font-medium text-[#2A6EBB]">{r.pcpNo}</p>
                    <p className="text-sm text-muted-foreground">{r.client} · {r.positionSummary || `${r.positions?.length} positions`}</p>
                  </div>
                  <PcpStatusChip status={r.status} />
                </Link>
              ))}
              {!requests.length && <p className="text-sm text-muted-foreground">No PCPs in your business unit yet.</p>}
            </CardContent>
          </Card>
        )}

        {pcpRole && isAdmin && !pcpLoading && (
          <PcpAllBusPanel requests={requests} businessUnits={masters?.businessUnits} />
        )}
      </div>
    </div>
  )
}
