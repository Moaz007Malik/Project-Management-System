import { useEffect } from 'react'
import {
  FolderKanban, Users, DollarSign, TrendingUp, CheckCircle, UserCheck, Wallet, BarChart3,
} from 'lucide-react'
import { KPICard } from '@/components/dashboard/KPICard'
import { DashboardCharts } from '@/components/dashboard/DashboardCharts'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardStore } from '@/stores/useDashboardStore'
import { formatCurrency, formatPercent } from '@/lib/utils'

export function Dashboard() {
  const { metrics, loading, fetchMetrics } = useDashboardStore()

  useEffect(() => { fetchMetrics() }, [fetchMetrics])

  if (loading || !metrics) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    )
  }

  const { kpis } = metrics

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Executive Dashboard</h1>
        <p className="text-muted-foreground">Real-time overview from live project data</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Total Projects" value={kpis.totalProjects} icon={FolderKanban} trend={kpis.projectGrowthTrend} />
        <KPICard title="Active Projects" value={kpis.activeProjects} icon={CheckCircle} subtitle={`${kpis.completedProjects} completed`} />
        <KPICard title="Total Employees" value={kpis.totalEmployees} icon={Users} />
        <KPICard title="Available Resources" value={kpis.availableResources} icon={UserCheck} subtitle={`${kpis.allocatedResources} allocated`} />
        <KPICard title="Budget Utilization" value={formatPercent(kpis.budgetUtilization)} icon={Wallet} trend={kpis.budgetUtilizationTrend} />
        <KPICard title="Monthly Cost" value={formatCurrency(kpis.monthlyCost)} icon={DollarSign} trend={kpis.monthlyCostTrend} />
        <KPICard title="Total Revenue" value={formatCurrency(kpis.totalRevenue)} icon={BarChart3} />
        <KPICard title="Profit Margin" value={formatPercent(kpis.profitMargin)} icon={TrendingUp} subtitle={formatCurrency(kpis.profit)} />
      </div>

      <DashboardCharts metrics={metrics} />
    </div>
  )
}
