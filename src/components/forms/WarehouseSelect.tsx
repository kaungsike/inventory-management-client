import { useAllWarehouses, useTransferTargets } from '@/hooks/useWarehouses'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { toLabelItems } from '@/lib/labels'

interface WarehouseSelectProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  excludeId?: number
  transferTargets?: boolean
}

export function WarehouseSelect({ value, onChange, placeholder = 'Select warehouse', excludeId, transferTargets = false }: WarehouseSelectProps) {
  // Managers only ever see their assigned warehouse on the scoped /warehouses
  // list, so a transfer destination must come from the unscoped transfer
  // targets endpoint instead.
  const { data: scoped = [] } = useAllWarehouses(!transferTargets)
  const { data: targets = [] } = useTransferTargets(transferTargets)
  const warehouses = transferTargets ? targets : scoped
  const filtered = excludeId ? warehouses.filter(w => w.id !== excludeId) : warehouses

  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v ?? '')}
      items={toLabelItems(filtered, (w) => `${w.name} — ${w.location}`)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {filtered.map((w) => (
          <SelectItem key={w.id} value={String(w.id)}>
            {w.name} — {w.location}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
