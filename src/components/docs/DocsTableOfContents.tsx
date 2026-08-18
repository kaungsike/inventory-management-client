import { useEffect, useState } from 'react'

import { useDocsContext } from './docs-context'
import { cn } from '@/lib/utils'

export function DocsTableOfContents() {
  const { headings } = useDocsContext()
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (headings.length === 0) {
      setActiveId('')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId((entry.target as HTMLElement).id)
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px' }
    )

    for (const heading of headings) {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav aria-label="On this page" className="sticky top-8">
      <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        On this page
      </p>
      <ul className="space-y-1.5">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                'block border-l-2 text-[0.82rem] leading-5 transition-colors',
                heading.level === 3 ? 'pl-5' : 'pl-3',
                activeId === heading.id
                  ? 'border-primary font-medium text-foreground'
                  : 'border-border text-muted-foreground hover:text-foreground'
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}