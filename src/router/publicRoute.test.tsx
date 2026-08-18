import { describe, expect, it } from 'vitest'

import { DOC_PAGES, GUIDE_PAGES, filterPages, getDocNeighbors } from '@/lib/docs'

import authRoute from './authRoute'
import inventoryRoute from './inventoryRoute'
import publicRoute from './publicRoute'
import { routes } from './route'

type RouteLike = {
  path?: string
  index?: boolean
  children?: RouteLike[]
}

function joinPath(base: string, segment: string): string {
  if (!segment) return base
  if (segment.startsWith('/')) return segment
  if (!base) return segment
  return `${base.replace(/\/$/, '')}/${segment}`
}

function collectPaths(route: RouteLike, base = ''): string[] {
  const current = joinPath(base, route.path ?? '')
  const paths = current ? [current] : []
  for (const child of route.children ?? []) {
    paths.push(...collectPaths(child, current))
  }
  return paths
}

function collectAllPaths(routeList: RouteLike[], base = ''): string[] {
  return routeList.flatMap((route) => collectPaths(route, base))
}

describe('publicRoute covers every documentation and guide page', () => {
  const root = publicRoute[0]
  const children = root.children ?? []
  const docsRoute = children.find((c) => c.path === 'docs')
  const guideRoute = children.find((c) => c.path === 'guide')

  it('keeps the public homepage at index (no redirect to /dashboard)', () => {
    expect(root.path).toBe('/')
    expect(children.some((c) => c.index === true)).toBe(true)
    expect(children.find((c) => c.index === true)).toBeDefined()
  })

  it('exposes the main public pages', () => {
    const paths = collectPaths(root)
    expect(paths).toContain('/about')
    expect(paths).toContain('/features')
    expect(paths).toContain('/faq')
  })

  it('maps every DOC_PAGES slug to a /docs route', () => {
    expect(docsRoute).toBeDefined()
    const docsPaths = collectPaths(docsRoute!, '/')

    const expected = DOC_PAGES.map((p) => (p.slug ? `/docs/${p.slug}` : '/docs'))
    expect(new Set(docsPaths)).toEqual(new Set(expected))
  })

  it('maps every GUIDE_PAGES slug to a /guide route', () => {
    expect(guideRoute).toBeDefined()
    const guidePaths = collectPaths(guideRoute!, '/')

    const expected = GUIDE_PAGES.map((p) => (p.slug ? `/guide/${p.slug}` : '/guide'))
    expect(new Set(guidePaths)).toEqual(new Set(expected))
  })
})

describe('existing authenticated application routes are unchanged', () => {
  it('still exposes /dashboard through the inventory section', () => {
    expect(collectAllPaths(inventoryRoute)).toContain('/dashboard')
  })

  it('still exposes /login through the auth section', () => {
    expect(collectAllPaths(authRoute)).toContain('/login')
  })

  it('orders routes: public, inventory, auth, then the catch-all ErrorPage', () => {
    const paths = routes.map((r) => r.path)
    const firstInventory = paths.indexOf('/dashboard')
    const firstAuth = paths.indexOf('/login')

    expect(paths[0]).toBe('/')
    expect(firstInventory).toBeGreaterThan(0)
    expect(firstAuth).toBeGreaterThan(firstInventory)
    expect(paths[paths.length - 1]).toBe('*')
  })
})

describe('docs search and pagination helpers', () => {
  it('finds pages by keyword via filterPages', () => {
    const hits = filterPages(DOC_PAGES, 'wac')
    expect(hits.length).toBeGreaterThan(0)
    for (const page of hits) {
      expect([page.title, page.description, page.keywords.join(' ')].join(' ').toLowerCase()).toContain('wac')
    }
  })

  it('chains neighbors across the whole documentation set', () => {
    const { prev, next } = getDocNeighbors('wac')
    expect(prev).toBeDefined()
    expect(next).toBeDefined()
  })
})