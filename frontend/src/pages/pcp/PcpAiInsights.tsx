import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, ComposedChart } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { usePcpStore } from '@/stores/usePcpStore'
import { formatCurrency, formatCurrencyCompact } from '@/lib/utils'
import { useThemeColors } from '@/lib/useThemeColors'

export function PcpAiInsights() {
  const { insights, fetchInsights } = usePcpStore()
  const { accentFill, primaryFill, accentFillSoft } = useThemeColors()

  useEffect(() => { fetchInsights() }, [fetchInsights])

  const data = insights as {
    needs?: { id: string; title: string; description: string; recommendation: string; recommendationType: string; reasoning: string; timeToFillInHouse?: number; timeToFillExternal?: number; inHouseMatches?: number }[]
    headcountForecast?: { labels: string[]; actual: (number | null)[]; projected: (number | null)[] }
    costForecast?: { months: string[]; projected: number[]; budget: number[]; atRisk: { costCenter: string; variance: number; note: string }[] }
    weeklySummary?: string
  } | null

  if (!data) return <p className="text-muted-foreground">Loading AI insights...</p>

  const forecastChart = data.headcountForecast?.labels.map((label, i) => ({
    month: label,
    actual: data.headcountForecast!.actual[i],
    projected: data.headcountForecast!.projected[i],
  })) || []

  const costChart = data.costForecast?.months.map((m, i) => ({
    month: m,
    projected: data.costForecast!.projected[i],
    budget: data.costForecast!.budget[i],
  })) || []

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">AI Insights & Forecasts</h1>
        <p className="text-muted-foreground">Sourcing recommendations and personnel cost projections</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Need Identification & Sourcing</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {data.needs?.map((n) => (
            <div key={n.id} className="rounded-xl border border-border p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{n.title}</p>
                  <p className="text-sm text-muted-foreground">{n.description}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${n.recommendationType === 'inhouse' ? 'bg-accent/15 text-accent' : 'bg-primary/15 text-primary'}`}>
                  {n.recommendation}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{n.reasoning}</p>
              <Link to="/pcp/new"><Button size="sm" variant="outline" className="mt-3">Create PCP from this need</Button></Link>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Headcount Forecast</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={forecastChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="actual" stroke={accentFill} strokeWidth={2} dot />
                <Line type="monotone" dataKey="projected" stroke={primaryFill} strokeWidth={2} strokeDasharray="5 5" dot />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Cost Forecast & Variance Risk</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={costChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis tickFormatter={(v) => formatCurrencyCompact(Number(v))} fontSize={12} />
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                <Area type="monotone" dataKey="budget" fill={accentFillSoft} stroke={accentFill} />
                <Line type="monotone" dataKey="projected" stroke={primaryFill} strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>At-Risk Cost Centers</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {data.costForecast?.atRisk.map((r) => (
            <p key={r.costCenter} className="text-sm"><strong>{r.costCenter}</strong> (+{r.variance}%) — {r.note}</p>
          ))}
        </CardContent>
      </Card>

      <Card className="border-accent/20 bg-accent/5">
        <CardHeader><CardTitle>Weekly Summary</CardTitle></CardHeader>
        <CardContent><p className="text-sm leading-relaxed">{data.weeklySummary}</p></CardContent>
      </Card>
    </div>
  )
}
