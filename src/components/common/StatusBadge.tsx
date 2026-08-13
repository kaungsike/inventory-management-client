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
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  completed: 'Completed',
  purchase: 'Purchase',
  sale: 'Sale',
  transfer: 'Transfer',
  adjustment: 'Adjustment',
  return: 'Return',
  return_in: 'Return In',
  damage: 'Damage',
  expired: 'Expired',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = getStatusColor(status)
  return (
    <Badge variant={variant} className={className}>
      {STATUS_LABELS[status] ?? status}
    </Badge>
  )
}
