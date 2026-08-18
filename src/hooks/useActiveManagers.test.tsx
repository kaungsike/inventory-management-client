import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { useActiveManagers } from './useWarehouses'
import { inventoryApi } from '@/lib/api'

vi.mock('@/lib/api', () => ({
  inventoryApi: { get: vi.fn() },
}))

const mockedGet = vi.mocked(inventoryApi.get)

function wrapper({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
}

beforeEach(() => {
  mockedGet.mockReset()
})

describe('useActiveManagers', () => {
  it('never requests /users when disabled (manager view)', () => {
    renderHook(() => useActiveManagers(false), { wrapper })

    expect(mockedGet).not.toHaveBeenCalled()
  })

  it('requests active managers from /users when enabled (admin view)', async () => {
    mockedGet.mockResolvedValue({ data: { data: [] } })

    renderHook(() => useActiveManagers(true), { wrapper })

    await waitFor(() => expect(mockedGet).toHaveBeenCalledWith('/users', expect.anything()))
  })
})