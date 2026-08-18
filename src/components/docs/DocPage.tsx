import { useEffect, useRef } from 'react'
import type * as React from 'react'
import { useLocation } from 'react-router-dom'

import { useDocsContext } from './docs-context'
import { DocsBreadcrumb } from './DocsBreadcrumb'
import { DocsPagination } from './DocsPagination'
import { docPath, getDocNeighbors, slugify, type DocHeading, type DocPageMeta } from '@/lib/docs'

interface DocPageProps {
  meta: DocPageMeta
  pathFn?: (slug: string) => string
  getNeighbors?: (slug: string) => { prev?: DocPageMeta; next?: DocPageMeta }
  rootLabel?: string
  children: React.ReactNode
}

export function DocPage({ meta, pathFn = docPath, getNeighbors = getDocNeighbors, rootLabel = 'Documentation', children }: DocPageProps) {
  const { setHeadings } = useDocsContext()
  const location = useLocation()
  const articleRef = useRef<HTMLElement>(null)
  const neighbors = getNeighbors(meta.slug)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  useEffect(() => {
    const article = articleRef.current
    if (!article) {
      setHeadings([])
      return
    }

    const used = new Set<string>()
    const found: DocHeading[] = []

    article.querySelectorAll('h2, h3').forEach((el) => {
      const text = (el.textContent ?? '').trim()
      if (!text) return
      let id = slugify(text)
      let counter = 1
      while (used.has(id)) {
        id = `${slugify(text)}-${counter}`
        counter += 1
      }
      used.add(id)
      el.id = id
      found.push({ id, text, level: el.tagName === 'H2' ? 2 : 3 })
    })

    setHeadings(found)
    return () => setHeadings([])
  }, [location.pathname, setHeadings])

  return (
    <article ref={articleRef}>
      <DocsBreadcrumb meta={meta} pathFn={pathFn} rootLabel={rootLabel} />

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">{meta.title}</h1>
      <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">{meta.description}</p>

      <div className="mt-6">{children}</div>

      <DocsPagination prev={neighbors.prev} next={neighbors.next} pathFn={pathFn} />
    </article>
  )
}