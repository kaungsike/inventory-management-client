import type * as React from 'react'
import { InfoIcon, LightbulbIcon, AlertTriangleIcon, ShieldAlertIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

type CalloutVariant = 'note' | 'tip' | 'warning' | 'danger'

const VARIANT_STYLES: Record<CalloutVariant, { className: string; icon: typeof InfoIcon; label: string }> = {
  note: { className: 'border-border bg-muted/40 text-muted-foreground', icon: InfoIcon, label: 'Note' },
  tip: { className: 'border-emerald-600/30 bg-emerald-600/5 text-muted-foreground', icon: LightbulbIcon, label: 'Tip' },
  warning: { className: 'border-amber-600/40 bg-amber-600/10 text-foreground', icon: AlertTriangleIcon, label: 'Warning' },
  danger: { className: 'border-destructive/40 bg-destructive/5 text-foreground', icon: ShieldAlertIcon, label: 'Important' },
}

interface DocsCalloutProps {
  variant?: CalloutVariant
  title?: string
  children: React.ReactNode
}

export function DocsCallout({ variant = 'note', title, children }: DocsCalloutProps) {
  const config = VARIANT_STYLES[variant]
  const Icon = config.icon
  return (
    <div className={cn('my-4 flex gap-3 rounded-xl border p-4', config.className)}>
      <Icon className="mt-0.5 size-4 shrink-0 text-foreground" />
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-medium text-foreground">{title ?? config.label}</p>
        <div className="text-sm leading-6">{children}</div>
      </div>
    </div>
  )
}