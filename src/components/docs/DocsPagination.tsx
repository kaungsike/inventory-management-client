import { Link } from 'react-router-dom'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'

import type { DocPageMeta } from '@/lib/docs'

interface DocsPaginationProps {
  prev?: DocPageMeta
  next?: DocPageMeta
  pathFn: (slug: string) => string
}

export function DocsPagination({ prev, next, pathFn }: DocsPaginationProps) {
  if (!prev && !next) return null

  return (
    <nav className="mt-12 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
      {prev ? (
        <Link
          to={pathFn(prev.slug)}
          className="group flex items-start gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted"
        >
          <ArrowLeftIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
          <span className="min-w-0">
            <span className="block text-xs text-muted-foreground">Previous</span>
            <span className="block truncate text-sm font-medium text-foreground">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <span />
      )}

      {next ? (
        <Link
          to={pathFn(next.slug)}
          className="group flex items-start justify-end gap-3 rounded-xl border border-border p-4 text-right transition-colors hover:bg-muted"
        >
          <span className="min-w-0">
            <span className="block text-xs text-muted-foreground">Next</span>
            <span className="block truncate text-sm font-medium text-foreground">{next.title}</span>
          </span>
          <ArrowRightIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}