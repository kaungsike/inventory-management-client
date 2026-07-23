import { Bell, Menu, Search } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useAppStore } from '@/store/useAppStore'
import { useLowStockInventory } from '@/hooks/useInventory'
import { useState } from 'react'

interface TopBarProps {
  onMenuClick: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  useAppStore()
  const { data: lowStockItems } = useLowStockInventory()
  const lowStockCount = lowStockItems?.length ?? 0
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`)
    }
  }

  return (
    <header className="h-16 flex items-center gap-4 px-4 border-b border-border bg-background">
      <Button variant="ghost" size="sm" className="md:hidden" onClick={onMenuClick}>
        <Menu className="size-4" />
      </Button>

      <form onSubmit={handleSearch} className="flex-1 max-w-sm">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8 h-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </form>

      <div className="ml-auto flex items-center gap-2">
        <Link to="/low-stock">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="size-4" />
            {lowStockCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs"
              >
                {lowStockCount > 99 ? '99+' : lowStockCount}
              </Badge>
            )}
          </Button>
        </Link>
      </div>
    </header>
  )
}
