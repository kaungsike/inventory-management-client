import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import ActivityLogPage from '@/pages/ActivityLogPage'
import { inventoryApi } from '@/lib/api'
import { useAuthStore } from '@/store/useAuthStore'

vi.mock('@/lib/api', () => ({
  inventoryApi: { get: vi.fn() },
}))

const mockedGet = vi.mocked(inventoryApi.get)

const admin = { id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' as const, is_active: true }
const manager = { id: 2, name: 'Manager', email: 'manager@example.com', role: 'manager' as const, is_active: true }

const emptyLogs = { data: { data: [], meta: { current_page: 1, last_page: 1, total: 0, per_page: 25 } } }

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
}

beforeEach(() => {
  mockedGet.mockReset()
  useAuthStore.setState({ user: manager, isAuthenticated: true })
  mockedGet.mockImplementation((url) => {
    if (url === '/activity-logs') {
      return Promise.resolve(emptyLogs)
    }
    return Promise.resolve({ data: { data: [] } })
  })
})

describe('ActivityLogPage', () => {
  it('loads audit logs for a manager without requesting the admin-only /users list', async () => {
    render(<ActivityLogPage />, { wrapper })

    await screen.findByText('No audit records found')

    expect(mockedGet).toHaveBeenCalledWith('/activity-logs', expect.anything())
    expect(mockedGet).not.toHaveBeenCalledWith('/users', expect.anything())
  })

  it('loads the user filter list for admins', async () => {
    useAuthStore.setState({ user: admin, isAuthenticated: true })

    render(<ActivityLogPage />, { wrapper })

    await screen.findByText('No audit records found')

    expect(mockedGet).toHaveBeenCalledWith('/activity-logs', expect.anything())
    expect(mockedGet).toHaveBeenCalledWith('/users', expect.anything())
  })
})