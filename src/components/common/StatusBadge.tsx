import { Badge } from '@/components/ui/badge'
import { getStatusColor } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  className?: string
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  discontinued: 'Discontinued',
  draft: 'Draft',
  sent: 'Sent',
  partial: 'Partial',
  received: 'Received',
  cancelled: 'Cancelled',
  purchase: 'Purchase',
  sale: 'Sale',
  transfer: 'Transfer',
  adjustment: 'Adjustment',
  return: 'Return',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = getStatusColor(status)
  return (
    <Badge variant={variant} className={className}>
      {STATUS_LABELS[status] ?? status}
    </Badge>
  )
}
