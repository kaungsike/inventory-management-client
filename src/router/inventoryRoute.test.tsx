import { describe, expect, it } from 'vitest'
import inventoryRoute from './inventoryRoute'

function routeProps(path: string) {
  const route = inventoryRoute.find((r) => r.path === path)
  expect(route, `route ${path} exists`).toBeDefined()
  return route!.element?.props as { allowedRoles?: ('admin' | 'manager')[] }
}

describe('inventoryRoute authorization matrix', () => {
  it('allows admin and manager on /activity-logs', () => {
    const { allowedRoles } = routeProps('/activity-logs')
    expect(allowedRoles).toContain('admin')
    expect(allowedRoles).toContain('manager')
  })

  it('allows admin and manager on /warehouses', () => {
    const { allowedRoles } = routeProps('/warehouses')
    // Role-open: every authenticated role may reach the warehouse section.
    expect(allowedRoles).toBeUndefined()
  })

  it('keeps /users admin-only', () => {
    const { allowedRoles } = routeProps('/users')
    expect(allowedRoles).toEqual(['admin'])
  })
})