import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }))

import { toast } from 'sonner'
import { inventoryApi } from '@/lib/api'

const mockedToastError = vi.mocked(toast.error)

beforeEach(() => {
  mockedToastError.mockReset()
})

describe('inventoryApi response interceptor', () => {
  it('shows the first field-level error detail for 422 responses', async () => {
    const rejected = inventoryApi.interceptors.response.handlers?.[0]?.rejected

    await rejected?.({
      response: {
        status: 422,
        data: {
          message: 'Requested quantity exceeds available stock. Available: 5.',
          errors: { quantity: ['Requested quantity exceeds available stock. Available: 5.'] },
        },
      },
    }).catch(() => {})

    expect(mockedToastError).toHaveBeenCalledWith('Requested quantity exceeds available stock. Available: 5.')
  })

  it('falls back to the response message when no field errors are present', async () => {
    const rejected = inventoryApi.interceptors.response.handlers?.[0]?.rejected

    await rejected?.({
      response: { status: 422, data: { message: 'Validation failed' } },
    }).catch(() => {})

    expect(mockedToastError).toHaveBeenCalledWith('Validation failed')
  })
})