import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  description?: string
  className?: string
  iconClassName?: string
}

export function StatsCard({ icon: Icon, label, value, description, className, iconClassName }: StatsCardProps) {
  return (
    <Card className={cn('', className)}>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </div>
          <div className={cn('size-12 rounded-lg bg-primary/10 flex items-center justify-center', iconClassName)}>
            <Icon className="size-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
