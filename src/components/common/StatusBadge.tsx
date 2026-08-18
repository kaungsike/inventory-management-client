import { Badge } from '@/components/ui/badge'
import { getStatusColor } from '@/lib/utils'
import { statusLabel } from '@/lib/labels'

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = getStatusColor(status)
  return (
    <Badge variant={variant} className={className}>
      {statusLabel(status)}
    </Badge>
  )
}
