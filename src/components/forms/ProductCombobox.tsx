import { useState } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface ProductComboboxProps {
  value: string
  onChange: (value: string, product?: Product) => void
  placeholder?: string
}

export function ProductCombobox({ value, onChange, placeholder = 'Search product...' }: ProductComboboxProps) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const { data } = useProducts({ search, per_page: 20 })
  const products = data?.data ?? []

  const selected = products.find(p => String(p.id) === value)

  return (
    <div className="relative">
      <Input
        value={open ? search : (selected ? `${selected.sku} - ${selected.name}` : '')}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        placeholder={placeholder}
        className="h-8"
      />
      {open && products.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-md max-h-52 overflow-y-auto">
          {products.map((p) => (
            <button
              key={p.id}
              type="button"
              className={cn(
                'w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground',
                String(p.id) === value && 'bg-accent'
              )}
              onMouseDown={() => { onChange(String(p.id), p); setSearch(''); setOpen(false) }}
            >
              <span className="font-mono text-xs text-muted-foreground">{p.sku}</span>
              {' — '}
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
