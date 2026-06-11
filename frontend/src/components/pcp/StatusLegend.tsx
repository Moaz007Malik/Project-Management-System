import { PcpStatusChip } from './PcpStatusChip'

const statuses = ['Draft', 'In Approval', 'Approved', 'Rejected', 'Returned', 'Closed'] as const

export function StatusLegend() {
  return (
    <div className="hidden items-center gap-2 lg:flex">
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Status</span>
      {statuses.map((s) => (
        <PcpStatusChip key={s} status={s} />
      ))}
    </div>
  )
}
