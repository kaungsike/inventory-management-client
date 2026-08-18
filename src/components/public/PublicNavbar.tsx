import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { LayoutDashboardIcon, LogInIcon, MenuIcon, PackageIcon, XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/features', label: 'Features' },
  { to: '/about', label: 'About' },
  { to: '/docs', label: 'Documentation' },
  { to: '/guide', label: 'User Guide' },
  { to: '/faq', label: 'FAQ' },
]

export function PublicNavbar() {
  const { isAuthenticated } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <PackageIcon className="size-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">Inventory MS</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-1.5 text-sm transition-colors',
                  isActive ? 'bg-muted font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <Button variant="default" className="gap-1.5" render={<Link to="/dashboard" />}>
              <LayoutDashboardIcon />
              Dashboard
            </Button>
          ) : (
            <Button variant="default" className="gap-1.5" render={<Link to="/login" />}>
              <LogInIcon />
              Login
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="ml-auto md:hidden"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <XIcon /> : <MenuIcon />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 py-3">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive ? 'bg-muted font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          {isAuthenticated ? (
            <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
              <Button variant="default" className="w-full gap-1.5">
                <LayoutDashboardIcon />
                Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="default" className="w-full gap-1.5">
                <LogInIcon />
                Login
              </Button>
            </Link>
          )}
        </div>
      )}
    </header>
  )
}