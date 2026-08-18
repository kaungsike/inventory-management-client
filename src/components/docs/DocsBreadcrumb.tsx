import { Link } from 'react-router-dom'
import { ChevronRightIcon } from 'lucide-react'

import { firstPageOfGroup, type DocPageMeta } from '@/lib/docs'

interface DocsBreadcrumbProps {
  meta: DocPageMeta
  pathFn: (slug: string) => string
  rootLabel: string
}

export function DocsBreadcrumb({ meta, pathFn, rootLabel }: DocsBreadcrumbProps) {
  const groupPage = firstPageOfGroup(meta.group)

  const crumbs: { label: string; to?: string }[] = [
    { label: 'Home', to: '/' },
    { label: rootLabel, to: pathFn('') },
  ]

  if (groupPage && groupPage.slug !== meta.slug) {
    crumbs.push({ label: meta.group, to: pathFn(groupPage.slug) })
  }

  crumbs.push({ label: meta.title })

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1
        return (
          <span key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRightIcon className="size-3.5 text-muted-foreground/60" />}
            {crumb.to && !isLast ? (
              <Link to={crumb.to} className="transition-colors hover:text-foreground">
                {crumb.label}
              </Link>
            ) : (
              <span className={isLast ? 'font-medium text-foreground' : ''}>{crumb.label}</span>
            )}
          </span>
        )
      })}
    </nav>
  )
}