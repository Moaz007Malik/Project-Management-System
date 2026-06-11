import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { usePcpStore } from '@/stores/usePcpStore'
import { api } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import type { PcpUser } from '@/types'

type Tab = 'chains' | 'masters' | 'users'

export function PcpAdmin() {
  const { masters, users, fetchMasters, fetchUsers } = usePcpStore()
  const [tab, setTab] = useState<Tab>('masters')
  const [chains, setChains] = useState<{ id: string; businessUnit: string; gradeMin: string; gradeMax: string; budgetThreshold: number; steps: string[] }[]>([])

  useEffect(() => {
    fetchMasters()
    fetchUsers()
    api.get<typeof chains>('/pcp/approval-chains').then(setChains)
  }, [fetchMasters, fetchUsers])

  const tabs: { id: Tab; label: string }[] = [
    { id: 'masters', label: 'Masters' },
    { id: 'chains', label: 'Approval Chains' },
    { id: 'users', label: 'Users' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Admin Console</h1>
        <p className="text-muted-foreground">Manage dropdowns, approval chains, and users</p>
      </div>

      <div className="flex gap-2 border-b border-border">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${tab === t.id ? 'border-[#E31E24] text-[#E31E24]' : 'border-transparent text-muted-foreground'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'masters' && masters && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Clients / Projects', items: masters.clients },
            { title: 'Cost Centers', items: masters.costCenters.map((c) => `${c.code} – ${c.name}`) },
            { title: 'Grades & Bands', items: masters.grades.map((g) => `${g.code}: ${formatCurrency(g.bandMin)}–${formatCurrency(g.bandMax)}`) },
            { title: 'Job Families', items: masters.jobFamilies },
            { title: 'Locations', items: masters.locations },
            { title: 'Benefits', items: masters.benefits },
          ].map((block) => (
            <Card key={block.title}>
              <CardHeader className="pb-2"><CardTitle className="text-base">{block.title}</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-1 max-h-40 overflow-y-auto">
                {block.items.map((item) => <p key={item} className="text-muted-foreground">{item}</p>)}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'chains' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Approval Chain Templates</CardTitle>
            <Button size="sm" variant="outline">+ Add Chain</Button>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left"><th className="py-2">Business Unit</th><th>Grade Range</th><th>Budget Threshold</th><th>Steps</th></tr></thead>
              <tbody>
                {chains.map((c) => (
                  <tr key={c.id} className="border-b">
                    <td className="py-2">{c.businessUnit}</td>
                    <td>{c.gradeMin} – {c.gradeMax}</td>
                    <td>AED {c.budgetThreshold.toLocaleString()}</td>
                    <td>{c.steps.join(' → ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {tab === 'users' && (
        <Card>
          <CardHeader><CardTitle>Users & Roles</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left"><th className="py-2">Name</th><th>Role</th><th>Business Unit</th><th>Designation</th><th>Active</th></tr></thead>
              <tbody>
                {users.map((u: PcpUser) => (
                  <tr key={u.id} className="border-b">
                    <td className="py-2 font-medium">{u.name}</td>
                    <td>{u.role}</td>
                    <td>{u.businessUnit}</td>
                    <td>{u.designation}</td>
                    <td>{u.active ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
