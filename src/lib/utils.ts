import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatDateTime(date: string | null | undefined): string {
  if (!date) return '—'
  return new Date(date).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function getStatusColor(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'active': case 'received': case 'shipped': return 'default'
    case 'inactive': case 'cancelled': return 'destructive'
    case 'discontinued': case 'draft': return 'outline'
    case 'sent': case 'partial': case 'confirmed': return 'secondary'
    default: return 'secondary'
  }
}

export function calculateStockStatus(quantity: number, reorderPoint: number): 'critical' | 'low' | 'normal' | 'overstock' {
  if (quantity === 0) return 'critical'
  if (quantity <= reorderPoint) return 'low'
  if (quantity > reorderPoint * 5) return 'overstock'
  return 'normal'
}

export function generateSKU(): string {
  return 'SKU-' + Math.random().toString(36).substring(2, 8).toUpperCase()
}

export type ReportPreset = 'custom' | 'today' | 'yesterday' | 'this-week' | 'this-month' | 'last-month' | 'last-30-days'

export const REPORT_PRESETS: { value: ReportPreset; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'this-week', label: 'This Week' },
  { value: 'this-month', label: 'This Month' },
  { value: 'last-month', label: 'Last Month' },
  { value: 'last-30-days', label: 'Last 30 Days' },
]

export function reportPresetRange(preset: ReportPreset): { dateFrom: string; dateTo: string } {
  const now = new Date()
  const toDateString = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const shift = (days: number) => {
    const d = new Date(now)
    d.setDate(d.getDate() - days)
    return toDateString(d)
  }

  switch (preset) {
    case 'yesterday':
      return { dateFrom: shift(1), dateTo: shift(1) }
    case 'this-week': {
      const start = new Date(now)
      const day = start.getDay() || 7 // Sunday = 7, Monday = 1
      start.setDate(start.getDate() - (day - 1))
      return { dateFrom: toDateString(start), dateTo: toDateString(now) }
    }
    case 'this-month':
      return { dateFrom: toDateString(new Date(now.getFullYear(), now.getMonth(), 1)), dateTo: toDateString(now) }
    case 'last-month': {
      const first = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const last = new Date(now.getFullYear(), now.getMonth(), 0)
      return { dateFrom: toDateString(first), dateTo: toDateString(last) }
    }
    case 'last-30-days':
      return { dateFrom: shift(29), dateTo: toDateString(now) }
    case 'today':
    default:
      return { dateFrom: toDateString(now), dateTo: toDateString(now) }
  }
}
