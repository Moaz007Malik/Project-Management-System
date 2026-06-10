import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    Active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    Completed: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    'On Hold': 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    Cancelled: 'bg-red-500/10 text-red-600 dark:text-red-400',
    Draft: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
    Planned: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    Available: 'bg-emerald-500/10 text-emerald-600',
    Allocated: 'bg-blue-500/10 text-blue-600',
    'Fully Allocated': 'bg-amber-500/10 text-amber-600',
    'On Leave': 'bg-orange-500/10 text-orange-600',
    Approved: 'bg-emerald-500/10 text-emerald-600',
    Pending: 'bg-amber-500/10 text-amber-600',
    Rejected: 'bg-red-500/10 text-red-600',
    green: 'bg-emerald-500/10 text-emerald-600',
    yellow: 'bg-amber-500/10 text-amber-600',
    red: 'bg-red-500/10 text-red-600',
  }
  return colors[status] || 'bg-gray-500/10 text-gray-600'
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    Low: 'bg-gray-500/10 text-gray-600',
    Medium: 'bg-blue-500/10 text-blue-600',
    High: 'bg-amber-500/10 text-amber-600',
    Critical: 'bg-red-500/10 text-red-600',
  }
  return colors[priority] || colors.Medium
}
