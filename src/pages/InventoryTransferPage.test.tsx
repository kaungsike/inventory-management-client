import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import InventoryTransferPage from '@/pages/InventoryTransferPage'
import { inventoryApi } from '@/lib/api'

vi.mock('@/lib/api', () => ({
  inventoryApi: { get: vi.fn(), post: vi.fn() },
}))

vi.mock('@/components/forms/WarehouseSelect', () => ({
  WarehouseSelect: ({ onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string; excludeId?: number }) => {
    const isSource = placeholder === 'Select source'
    return (
      <div>
        <button type="button" data-testid={isSource ? 'wh-src-10' : 'wh-dst-11'} onClick={() => onChange(isSource ? '10' : '11')}>
          {isSource ? 'src-10' : 'dst-11'}
        </button>
        {isSource && (
          <button type="button" data-testid="wh-src-11" onClick={() => onChange('11')}>src-11</button>
        )}
      </div>
    )
  },
}))

vi.mock('@/components/forms/ProductCombobox', () => ({
  ProductCombobox: ({ onChange }: { value: string; onChange: (v: string) => void }) => (
    <button type="button" onClick={() => onChange('1')}>product-1</button>
  ),
}))

const mockedGet = vi.mocked(inventoryApi.get)
const mockedPost = vi.mocked(inventoryApi.post)

const product = { id: 1, sku: 'APL-001', name: 'Apple', unit: 'pcs', status: 'active' }

function wrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

interface MockApiOptions {
  availability?: number
  inventoryUnit?: string
  availabilityHandler?: () => Promise<{ data: { product_id: number; warehouse_id: number; quantity: number; reserved_quantity: number; available_quantity: number } }>
}

function mockApi(opts: MockApiOptions = {}) {
  mockedGet.mockImplementation((url) => {
    if (url === '/products') {
      return Promise.resolve({ data: { data: [product], meta: { current_page: 1, last_page: 1, total: 1, per_page: 20 } } })
    }
    if (url === '/warehouses') {
      return Promise.resolve({ data: { data: [] } })
    }
    if (url === '/warehouses/transfer-targets') {
      return Promise.resolve({ data: { data: [] } })
    }
    if (url === '/inventory') {
      const unit = opts.inventoryUnit ?? 'pcs'
      const rows = opts.availability === undefined || opts.availability === 0 ? [] : [{ id: 1, product_id: 1, warehouse_id: 10, quantity: opts.availability, reserved_quantity: 0, available_quantity: opts.availability, reorder_point: 10, reorder_quantity: 50, product: { unit }, created_at: '', updated_at: '' }]
      return Promise.resolve({ data: { data: rows, meta: { current_page: 1, last_page: 1, total: rows.length, per_page: 25 } } })
    }
    if (url === '/inventory/available') {
      if (opts.availabilityHandler) return opts.availabilityHandler()
      const available = opts.availability ?? 0
      return Promise.resolve({ data: { product_id: 1, warehouse_id: 10, quantity: available, reserved_quantity: 0, available_quantity: available } })
    }
    return Promise.resolve({ data: { data: [] } })
  })
  mockedPost.mockResolvedValue({ data: { message: 'Transfer completed successfully' } })
}

async function selectSourceAndDestination() {
  fireEvent.click(screen.getByText('product-1'))
  fireEvent.click(screen.getByTestId('wh-src-10'))
  fireEvent.click(screen.getByTestId('wh-dst-11'))
}

beforeEach(() => {
  mockedGet.mockReset()
  mockedPost.mockReset()
})

describe('InventoryTransferPage', () => {
  it('reports zero stock when no inventory row exists and disables the transfer form', async () => {
    mockApi({ availability: 0 })
    render(<InventoryTransferPage />, { wrapper })

    await selectSourceAndDestination()

    expect(await screen.findByText('No stock available in this warehouse.')).toBeInTheDocument()
    expect(screen.getByRole('spinbutton')).toBeDisabled()
    expect(screen.getByRole('button', { name: /Transfer Stock/ })).toBeDisabled()
  })

  it('shows the available stock quantity with the product unit', async () => {
    mockApi({ availability: 5, inventoryUnit: 'pcs' })
    render(<InventoryTransferPage />, { wrapper })

    await selectSourceAndDestination()

    expect(await screen.findByText('Available: 5 pcs')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Transfer Stock/ })).toBeEnabled()
  })

  it('shows a loading state while the availability is being fetched', async () => {
    mockApi({ availability: 5, availabilityHandler: () => new Promise(() => {}) })
    render(<InventoryTransferPage />, { wrapper })

    fireEvent.click(screen.getByText('product-1'))
    fireEvent.click(screen.getByTestId('wh-src-10'))

    expect(await screen.findByText('Checking stock\u2026')).toBeInTheDocument()
  })

  it('rejects a quantity above the available stock on submit', async () => {
    mockApi({ availability: 5 })
    render(<InventoryTransferPage />, { wrapper })

    await selectSourceAndDestination()

    await screen.findByText('Available: 5 pcs')
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '6' } })
    fireEvent.click(screen.getByRole('button', { name: /Transfer Stock/ }))

    expect(await screen.findByText('Quantity cannot exceed available stock (5).')).toBeInTheDocument()
    expect(mockedPost).not.toHaveBeenCalled()
  })

  it('resets the quantity when the product or source warehouse changes', async () => {
    mockApi({ availability: 5 })
    render(<InventoryTransferPage />, { wrapper })

    fireEvent.click(screen.getByText('product-1'))
    fireEvent.click(screen.getByTestId('wh-src-10'))

    await screen.findByText('Available: 5 pcs')
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '4' } })
    expect(screen.getByRole('spinbutton')).toHaveValue(4)

    fireEvent.click(screen.getByTestId('wh-src-11'))

    await waitFor(() => expect(screen.getByRole('spinbutton')).toHaveValue(null))
  })

  it('submits a valid transfer with the expected payload', async () => {
    mockApi({ availability: 5 })
    render(<InventoryTransferPage />, { wrapper })

    await selectSourceAndDestination()

    await screen.findByText('Available: 5 pcs')
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '3' } })
    fireEvent.click(screen.getByRole('button', { name: /Transfer Stock/ }))

    await waitFor(() => {
      expect(mockedPost).toHaveBeenCalledWith('/inventory/transfer', {
        product_id: 1,
        from_warehouse_id: 10,
        to_warehouse_id: 11,
        quantity: 3,
        notes: undefined,
      })
    })
  })

  it('refetches the availability when the server rejects the transfer', async () => {
    mockApi({
      availability: 5,
      availabilityHandler: () => Promise.resolve({
        data: { product_id: 1, warehouse_id: 10, quantity: 5, reserved_quantity: 0, available_quantity: 5 },
      }),
    })
    mockedPost.mockRejectedValue({
      response: {
        status: 422,
        data: {
          message: 'Requested quantity exceeds available stock. Available: 2.',
          errors: { quantity: ['Requested quantity exceeds available stock. Available: 2.'] },
        },
      },
    })
    render(<InventoryTransferPage />, { wrapper })

    await selectSourceAndDestination()

    await screen.findByText('Available: 5 pcs')
    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '3' } })
    fireEvent.click(screen.getByRole('button', { name: /Transfer Stock/ }))

    const callsBefore = mockedGet.mock.calls.filter(([url]) => url === '/inventory/available').length
    await waitFor(() => {
      expect(mockedGet.mock.calls.filter(([url]) => url === '/inventory/available').length).toBeGreaterThan(callsBefore)
    })
  })
})