import { useAllSuppliers } from '@/hooks/useSuppliers'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { toLabelItems } from '@/lib/labels'

interface SupplierComboboxProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SupplierCombobox({ value, onChange, placeholder = 'Select supplier' }: SupplierComboboxProps) {
  const { data: suppliers = [] } = useAllSuppliers()

  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v ?? '')}
      items={toLabelItems(suppliers, (s) => `${s.name}${s.company ? ` (${s.company})` : ''}`)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">None</SelectItem>
        {suppliers.map((s) => (
          <SelectItem key={s.id} value={String(s.id)}>
            {s.name} {s.company ? `(${s.company})` : ''}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
