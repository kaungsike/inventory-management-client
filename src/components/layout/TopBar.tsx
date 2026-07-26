import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, LogOut, Menu, Search, User as UserIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLowStockInventory } from '@/hooks/useInventory'
import { useAuth } from '@/hooks/useAuth'
import { inventoryApi } from '@/lib/api'

interface TopBarProps {
  onMenuClick: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { user, logout } = useAuth()
  const { data: lowStockItems } = useLowStockInventory()
  const lowStockCount = lowStockItems?.length ?? 0
  const [search, setSearch] = useState('')
  const [showProfileModal, setShowProfileModal] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`)
    }
  }

  const handleLogout = async () => {
    try {
      await inventoryApi.post('/auth/logout')
    } catch {
      // ignore logout network errors
    } finally {
      logout()
      navigate('/login', { replace: true })
    }
  }

  const getRoleBadgeVariant = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'destructive'
      case 'manager':
        return 'default'
      default:
        return 'secondary'
    }
  }

  return (
    <>
      <header className="h-16 flex items-center gap-4 px-4 border-b border-border bg-background">
        <Button variant="ghost" size="sm" className="md:hidden" onClick={onMenuClick}>
          <Menu className="size-4" />
        </Button>

        <form onSubmit={handleSearch} className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8 h-8 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-3">
          <Link to="/low-stock">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="size-4" />
              {lowStockCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
                >
                  {lowStockCount > 99 ? '99+' : lowStockCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* User Profile Dropdown */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 px-2">
                  <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col items-start text-left text-xs">
                    <span className="font-medium text-foreground truncate max-w-[120px]">{user.name}</span>
                    <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize text-[10px] px-1 py-0 h-3.5">
                      {user.role}
                    </Badge>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      <div className="pt-1">
                        <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize text-[10px]">
                          Role: {user.role}
                        </Badge>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowProfileModal(true)} className="cursor-pointer">
                  <UserIcon className="mr-2 size-4" />
                  <span>Profile Info</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 size-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Profile Modal */}
      {showProfileModal && user && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-semibold text-lg">User Profile</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowProfileModal(false)}>
                <X className="size-4" />
              </Button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-muted-foreground uppercase block font-medium">Name</span>
                <p className="font-medium text-foreground">{user.name}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase block font-medium">Email</span>
                <p className="font-mono text-muted-foreground text-xs">{user.email}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase block font-medium">Role</span>
                <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize mt-1">
                  {user.role}
                </Badge>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase block font-medium">Account Status</span>
                <p className="text-emerald-600 font-medium text-xs mt-0.5">Active</p>
              </div>
            </div>
            <div className="pt-2">
              <Button variant="outline" className="w-full" onClick={() => setShowProfileModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
