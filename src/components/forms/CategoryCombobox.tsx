import { useAllCategories } from '@/hooks/useCategories'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { toLabelItems } from '@/lib/labels'

interface CategoryComboboxProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function CategoryCombobox({ value, onChange, placeholder = 'Select category' }: CategoryComboboxProps) {
  const { data: categories = [] } = useAllCategories()

  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v ?? '')}
      items={toLabelItems(categories, (c) => c.name)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {categories.map((c) => (
          <SelectItem key={c.id} value={String(c.id)}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
