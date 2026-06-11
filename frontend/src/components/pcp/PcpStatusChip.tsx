import { cn } from '@/lib/utils'
import type { PcpStatus } from '@/types'

const styles: Record<PcpStatus, string> = {
  Draft: 'bg-gray-500/15 text-gray-700 dark:text-gray-300',
  'In Approval': 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  Approved: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  Rejected: 'bg-[#E31E24]/15 text-[#E31E24]',
  Returned: 'bg-[#2A6EBB]/15 text-[#2A6EBB]',
  Closed: 'bg-gray-700/15 text-gray-800 dark:text-gray-200',
}

export function PcpStatusChip({ status }: { status: PcpStatus | string }) {
  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold', styles[status as PcpStatus] || styles.Draft)}>
      {status}
    </span>
  )
}
