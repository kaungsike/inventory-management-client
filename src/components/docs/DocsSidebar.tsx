import { Link, useLocation } from 'react-router-dom'

import { cn } from '@/lib/utils'
import type { DocGroup } from '@/lib/docs'

interface DocsSidebarProps {
  groups: DocGroup[]
  pathFn: (slug: string) => string
  onNavigate?: () => void
}

function currentSlug(pathname: string, pathFn: (slug: string) => string): string {
  const base = pathFn('')
  if (pathname === base) return ''
  if (pathname.startsWith(base + '/')) return pathname.slice(base.length + 1)
  return ''
}

export function DocsSidebar({ groups, pathFn, onNavigate }: DocsSidebarProps) {
  const location = useLocation()
  const slug = currentSlug(location.pathname, pathFn)

  return (
    <nav aria-label="Documentation navigation" className="space-y-6">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-1.5 px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const isActive = slug === item.slug
              return (
                <li key={item.slug}>
                  <Link
                    to={pathFn(item.slug)}
                    onClick={onNavigate}
                    className={cn(
                      'block rounded-lg px-2.5 py-1.5 text-sm transition-colors',
                      isActive
                        ? 'bg-primary font-medium text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}