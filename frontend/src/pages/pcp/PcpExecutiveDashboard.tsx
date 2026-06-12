import { useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { usePcpStore } from '@/stores/usePcpStore'
import { formatCurrency, formatCurrencyCompact } from '@/lib/utils'

export function PcpExecutiveDashboard() {
  const { executive, fetchExecutive } = usePcpStore()

  useEffect(() => { fetchExecutive() }, [fetchExecutive])

  const data = executive as {
    headcount?: { total: number; filled: number; vacant: number; onHold: number }
    headcountByProject?: { project: string; filled: number; vacant: number }[]
    budgetVsActual?: { costCenter: string; budget: number; actual: number }[]
    vacancyAgeing?: { trade: string; d0_15: number; d16_30: number; d31_60: number; d60plus: number }[]
    timeToFill?: { geography: string; days: number }[]
    approvalTat?: { avgDays: number; trend: number }
    alerts?: string[]
  } | null

  if (!data) return <p className="text-muted-foreground">Loading executive dashboard...</p>

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Executive Dashboard</h1>
          <p className="text-muted-foreground">All business units · click widgets to drill down</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Select className="w-full sm:w-36">
            <option>All Projects</option>
            {(data.headcountByProject ?? []).map((row) => (
              <option key={row.project} value={row.project}>{row.project}</option>
            ))}
          </Select>
          <Select className="w-full sm:w-36"><option>YTD</option><option>This Quarter</option><option>This Month</option></Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Headcount</p><p className="text-3xl font-bold">{data.headcount?.total}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Filled</p><p className="text-3xl font-bold text-emerald-600">{data.headcount?.filled}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Vacant</p><p className="text-3xl font-bold text-amber-600">{data.headcount?.vacant}</p></CardContent></Card>
        <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Approval TAT</p><p className="text-3xl font-bold">{data.approvalTat?.avgDays} days</p></CardContent></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Headcount by Project</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.headcountByProject}>
                <XAxis dataKey="project" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="filled" fill="#2A6EBB" name="Filled" />
                <Bar dataKey="vacant" fill="#E31E24" name="Vacant" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Budget vs Actual</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.budgetVsActual}>
                <XAxis dataKey="costCenter" fontSize={12} />
                <YAxis tickFormatter={(v) => formatCurrencyCompact(Number(v))} fontSize={12} />
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                <Bar dataKey="budget" fill="#2A6EBB" name="Budget" />
                <Bar dataKey="actual" fill="#E31E24" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Time-to-Fill by Geography</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.timeToFill}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="geography" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="days" stroke="#2A6EBB" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Vacancy Ageing Heat Map</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr><th className="text-left py-1">Trade</th><th>0–15d</th><th>16–30d</th><th>31–60d</th><th>60+d</th></tr></thead>
              <tbody>
                {data.vacancyAgeing?.map((row) => (
                  <tr key={row.trade} className="border-t">
                    <td className="py-2 font-medium">{row.trade}</td>
                    <td className="text-center">{row.d0_15}</td>
                    <td className="text-center">{row.d16_30}</td>
                    <td className="text-center bg-amber-500/20">{row.d31_60}</td>
                    <td className="text-center bg-[#E31E24]/20 font-semibold">{row.d60plus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Alert Feed</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {data.alerts?.map((a) => (
            <p key={a} className="rounded-lg border border-[#E31E24]/20 bg-[#E31E24]/5 px-3 py-2 text-sm">{a}</p>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
