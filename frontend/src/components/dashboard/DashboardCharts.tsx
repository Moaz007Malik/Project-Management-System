import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, Area, AreaChart,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardMetrics } from '@/types'

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#6366f1']
const STATUS_COLORS: Record<string, string> = {
  Active: '#10b981', Completed: '#3b82f6', Planned: '#8b5cf6',
  'On Hold': '#f59e0b', Draft: '#6b7280', Cancelled: '#ef4444',
}

const chartTooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  fontSize: '12px',
}

interface DashboardChartsProps {
  metrics: DashboardMetrics
}

export function DashboardCharts({ metrics }: DashboardChartsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="animate-fade-in">
        <CardHeader><CardTitle>Project Status Distribution</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={metrics.projectStatusDistribution.filter((d) => d.count > 0)}
                cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                paddingAngle={4} dataKey="count" nameKey="status"
                label={(props) => `${props.name}: ${props.value}`}
              >
                {metrics.projectStatusDistribution.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || COLORS[0]} />
                ))}
              </Pie>
              <Tooltip contentStyle={chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <CardHeader><CardTitle>Budget vs Actual Cost</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={metrics.budgetVsActual}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => [`$${Number(v).toLocaleString()}`, '']} />
              <Legend />
              <Bar dataKey="budget" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Budget" />
              <Bar dataKey="actual" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <CardHeader><CardTitle>Resource Utilization</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={metrics.resourceUtilization} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 120]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" unit="%" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" width={80} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="utilization" radius={[0, 4, 4, 0]} name="Utilization %">
                {metrics.resourceUtilization.map((entry) => (
                  <Cell key={entry.id} fill={entry.utilization > 100 ? '#ef4444' : entry.utilization > 90 ? '#f59e0b' : '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <CardHeader><CardTitle>Monthly Spending Trend</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={metrics.monthlySpending}>
              <defs>
                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Cost']} />
              <Area type="monotone" dataKey="cost" stroke="#8b5cf6" fill="url(#colorCost)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="animate-fade-in lg:col-span-2" style={{ animationDelay: '0.4s' }}>
        <CardHeader><CardTitle>Profitability Analysis</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={metrics.projectProfitability}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="projectName" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => [`$${Number(v).toLocaleString()}`, '']} />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name="Revenue" />
              <Bar dataKey="actualCost" fill="#ef4444" radius={[4, 4, 0, 0]} name="Cost" />
              <Bar dataKey="profit" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="animate-fade-in lg:col-span-2" style={{ animationDelay: '0.5s' }}>
        <CardHeader><CardTitle>Employee Allocation (Hours)</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={metrics.employeeAllocation}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend />
              <Bar dataKey="allocated" stackId="a" fill="#8b5cf6" name="Allocated" radius={[0, 0, 0, 0]} />
              <Bar dataKey="available" stackId="a" fill="#e5e7eb" name="Available" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
