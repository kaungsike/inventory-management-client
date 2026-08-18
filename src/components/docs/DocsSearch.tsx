import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileTextIcon, SearchIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { filterPages, type DocPageMeta } from '@/lib/docs'

interface DocsSearchProps {
  pages: DocPageMeta[]
  pathFn: (slug: string) => string
  placeholder?: string
}

export function DocsSearch({ pages, pathFn, placeholder = 'Search documentation...' }: DocsSearchProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const results = filterPages(pages, query)

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  const handleSelect = (slug: string) => {
    navigate(pathFn(slug))
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(e.target.value.trim().length > 0)
          }}
          onFocus={() => {
            if (query.trim()) setOpen(true)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setOpen(false)
              setQuery('')
            }
          }}
          placeholder={placeholder}
          className="h-9 pl-8 text-sm"
          aria-label="Search documentation"
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1.5 max-h-96 overflow-y-auto rounded-xl border border-border bg-popover p-1.5 shadow-lg">
          {results.slice(0, 12).map((page) => (
            <button
              key={page.slug}
              type="button"
              onClick={() => handleSelect(page.slug)}
              className="flex w-full items-start gap-2.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted"
            >
              <FileTextIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-foreground">{page.title}</span>
                <span className="block truncate text-xs text-muted-foreground">{page.group}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {open && query.trim() && results.length === 0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1.5 rounded-xl border border-border bg-popover p-4 text-sm text-muted-foreground shadow-lg">
          No results for "{query.trim()}"
        </div>
      )}
    </div>
  )
}