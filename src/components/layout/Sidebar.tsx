import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Package, Tag, Users, Archive,
  ArrowLeftRight, FileText, ShoppingCart, AlertTriangle, ChevronLeft, ChevronRight, X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useLowStockInventory } from '@/hooks/useInventory'
import { useAppStore } from '@/store/useAppStore'

const navGroups = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { label: 'Products', to: '/products', icon: Package },
      { label: 'Categories', to: '/categories', icon: Tag },
      { label: 'Suppliers', to: '/suppliers', icon: Users },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Inventory', to: '/inventory', icon: Archive },
      { label: 'Transfer Stock', to: '/inventory/transfer', icon: ArrowLeftRight },
      { label: 'Transactions', to: '/transactions', icon: FileText },
    ],
  },
  {
    label: 'Procurement',
    items: [
      { label: 'Purchase Orders', to: '/purchase-orders', icon: ShoppingCart },
    ],
  },
  {
    label: 'Alerts',
    items: [
      { label: 'Low Stock Alerts', to: '/low-stock', icon: AlertTriangle },
    ],
  },
]

interface SidebarProps {
  mobile?: boolean
  onClose?: () => void
}

export function Sidebar({ mobile, onClose }: SidebarProps) {
  const location = useLocation()
  const { sidebarOpen, toggleSidebar } = useAppStore()
  const { data: lowStockItems } = useLowStockInventory()
  const lowStockCount = lowStockItems?.length ?? 0

  const collapsed = !mobile && !sidebarOpen

  return (
    <aside
      className={cn(
        'flex flex-col bg-card border-r border-border transition-all duration-300 h-full',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className={cn('flex items-center h-16 px-4 border-b border-border', collapsed ? 'justify-center' : 'justify-between')}>
        {!collapsed && (
          <span className="font-semibold text-foreground text-sm">Inventory MS</span>
        )}
        {mobile ? (
          <Button variant="ghost" size="sm" onClick={onClose} className="ml-auto">
            <X className="size-4" />
          </Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={toggleSidebar} className={cn(collapsed && 'mx-auto')}>
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          </Button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 mb-1">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location.pathname === item.to ||
                  (item.to !== '/dashboard' && location.pathname.startsWith(item.to))
                const isLowStock = item.to === '/low-stock'

                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={mobile ? onClose : undefined}
                      className={cn(
                        'flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        collapsed && 'justify-center px-0'
                      )}
                    >
                      <item.icon className="size-4 shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {isLowStock && lowStockCount > 0 && (
                            <Badge variant="destructive" className="text-xs px-1.5 py-0 h-4">
                              {lowStockCount}
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
