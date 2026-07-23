import { useAllWarehouses } from '@/hooks/useWarehouses'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

interface WarehouseSelectProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  excludeId?: number
}

export function WarehouseSelect({ value, onChange, placeholder = 'Select warehouse', excludeId }: WarehouseSelectProps) {
  const { data: warehouses = [] } = useAllWarehouses()
  const filtered = excludeId ? warehouses.filter(w => w.id !== excludeId) : warehouses

  return (
    <Select value={value} onValueChange={(v) => onChange(v ?? '')}>
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
