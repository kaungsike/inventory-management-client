import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import { MemoryRouter } from 'react-router-dom'
import FinancialOverviewPage from '@/pages/reports/FinancialOverviewPage'
import { inventoryApi } from '@/lib/api'
import type { FinancialOverview } from '@/lib/types'

vi.mock('@/lib/api', () => ({
  inventoryApi: { get: vi.fn() },
}))

vi.mock('@/components/forms/ProductCombobox', () => ({
  ProductCombobox: ({ onChange }: { value: string; onChange: (v: string) => void }) => (
    <button type="button" onClick={() => onChange('1')}>product-1</button>
  ),
}))

vi.mock('@/components/ui/select', async () => {
  const { createElement } = await import('react')
  return {
    Select: ({ onValueChange, children }: { onValueChange?: (v: string) => void; children?: ReactNode }) =>
      createElement('button', { type: 'button', onClick: () => onValueChange?.('1') }, children),
    SelectTrigger: ({ children }: { children?: ReactNode }) => createElement('span', null, children),
    SelectValue: ({ placeholder }: { placeholder?: string }) => createElement('span', null, placeholder),
    SelectContent: ({ children }: { children?: ReactNode }) => createElement('span', null, children),
    SelectItem: ({ children }: { children?: ReactNode }) => createElement('span', null, children),
  }
})

vi.mock('recharts', async () => {
  const { createElement } = await import('react')
  const ChartShell = ({ children }: { children?: ReactNode }) => createElement('div', { 'data-testid': 'chart' }, children)
  return {
    ResponsiveContainer: ({ children }: { children?: ReactNode }) =>
      createElement('div', { 'data-testid': 'responsive-container' }, children),
    BarChart: ChartShell,
    PieChart: ChartShell,
    Bar: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    Pie: () => null,
    Cell: () => null,
    Legend: () => null,
  }
})

const mockedGet = vi.mocked(inventoryApi.get)

const OVERVIEW: FinancialOverview = {
  purchase: {
    total_spend: 500,
    ordered_amount: 500,
    received_amount: 500,
    remaining_amount: 0,
    total_pos: 1,
    total_ordered_units: 100,
    total_received_units: 100,
  },
  inventory: { units: 90, value: 450, potential_sales_value: 630, potential_gross_profit: 180 },
  sales: { gross_sales: 630, return_value: 0, net_sales: 630 },
  cost: { sales_cogs: 450, returned_cogs: 0, net_cogs: 450 },
  profit: { gross_profit: 180, write_off_loss: 50, result_after_write_offs: 130 },
  write_offs: {
    damage_quantity: 10,
    expired_quantity: 0,
    total_quantity: 10,
    damage_loss: 50,
    expired_loss: 0,
    total_loss: 50,
  },
}

const ZERO: FinancialOverview = {
  purchase: {
    total_spend: 0,
    ordered_amount: 0,
    received_amount: 0,
    remaining_amount: 0,
    total_pos: 0,
    total_ordered_units: 0,
    total_received_units: 0,
  },
  inventory: { units: 0, value: 0, potential_sales_value: 0, potential_gross_profit: 0 },
  sales: { gross_sales: 0, return_value: 0, net_sales: 0 },
  cost: { sales_cogs: 0, returned_cogs: 0, net_cogs: 0 },
  profit: { gross_profit: 0, write_off_loss: 0, result_after_write_offs: 0 },
  write_offs: { damage_quantity: 0, expired_quantity: 0, total_quantity: 0, damage_loss: 0, expired_loss: 0, total_loss: 0 },
}

function mockApi(payload: FinancialOverview = OVERVIEW, pending = false) {
  mockedGet.mockImplementation((url: string) => {
    if (url === '/reports/financial-overview') {
      return pending ? new Promise(() => {}) : Promise.resolve({ data: payload })
    }
    if (url === '/warehouses') {
      return Promise.resolve({ data: { data: [{ id: 1, name: 'Main' }], meta: {}, links: {} } })
    }
    if (url === '/categories/all') {
      return Promise.resolve({ data: [{ id: 1, name: 'Apparel' }] })
    }
    return Promise.resolve({ data: [] })
  })
}

function lastFinancialCallParams() {
  const calls = mockedGet.mock.calls.filter(([url]) => url === '/reports/financial-overview')
  const config = calls[calls.length - 1]?.[1] as { params?: Record<string, unknown> } | undefined
  return config?.params ?? {}
}

function wrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('FinancialOverviewPage', () => {
  beforeEach(() => {
    mockedGet.mockReset()
  })

  it('renders the metric cards with correctly formatted currency values', async () => {
    mockApi()
    render(<FinancialOverviewPage />, { wrapper })

    await screen.findByText('Total Purchase Spend')

    for (const label of ['Total Purchase Spend', 'Current Inventory Value', 'Gross Sales', 'Net Sales', 'Net COGS', 'Gross Profit', 'Write-off Loss', 'Result After Write-offs']) {
      expect(screen.getAllByText(label).length).toBeGreaterThanOrEqual(1)
    }
    for (const value of ['$500.00', '$450.00', '$630.00', '$180.00', '$50.00', '$130.00']) {
      expect(screen.getAllByText(value).length).toBeGreaterThanOrEqual(1)
    }
  })

  it('renders the profit flow and the purchase-to-inventory flow', async () => {
    mockApi()
    render(<FinancialOverviewPage />, { wrapper })

    expect(await screen.findByText('Profit Flow')).toBeInTheDocument()
    expect(screen.getByText('Purchase Spending vs Current Inventory Value')).toBeInTheDocument()
    expect(screen.getByText(/Potential Gross Profit/)).toBeInTheDocument()
    expect(screen.getAllByText('Net Sales').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Gross Profit').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Result After Write-offs').length).toBeGreaterThanOrEqual(1)
  })

  it('renders the purchase, inventory and write-off breakdowns', async () => {
    mockApi()
    render(<FinancialOverviewPage />, { wrapper })

    expect((await screen.findAllByText('Purchase Orders')).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Total POs')).toBeInTheDocument()
    expect(screen.getByText('Ordered Units')).toBeInTheDocument()
    expect(screen.getByText('Received Units')).toBeInTheDocument()
    expect(screen.getByText('Outstanding')).toBeInTheDocument()
    expect(screen.getByText('Units on Hand')).toBeInTheDocument()
    expect(screen.getByText('Potential Gross Profit')).toBeInTheDocument()
    expect(screen.getByText('Damage Units')).toBeInTheDocument()
    expect(screen.getByText('Expired Units')).toBeInTheDocument()
    expect(screen.getByText('Total Units')).toBeInTheDocument()
  })

  it('renders the three charts', async () => {
    mockApi()
    render(<FinancialOverviewPage />, { wrapper })

    await screen.findByText('Total Purchase Spend')

    expect(screen.getAllByTestId('chart')).toHaveLength(3)
  })

  it('shows the empty state with zero data and never renders NaN', async () => {
    mockApi(ZERO)
    render(<FinancialOverviewPage />, { wrapper })

    expect(await screen.findByText('No financial data')).toBeInTheDocument()
    expect(screen.queryByText('NaN')).not.toBeInTheDocument()
  })

  it('shows a loading spinner while the overview is being fetched', () => {
    mockApi(OVERVIEW, true)
    const { container } = render(<FinancialOverviewPage />, { wrapper })

    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('refetches with the selected date range', async () => {
    mockApi()
    const { container } = render(<FinancialOverviewPage />, { wrapper })

    await screen.findByText('Total Purchase Spend')

    const [dateFromInput, dateToInput] = Array.from(container.querySelectorAll('input[type="date"]'))
    fireEvent.change(dateFromInput, { target: { value: '2026-08-01' } })
    fireEvent.change(dateToInput, { target: { value: '2026-08-31' } })

    await waitFor(() => {
      const params = lastFinancialCallParams()
      expect(params.date_from).toBe('2026-08-01')
      expect(params.date_to).toBe('2026-08-31')
    })
  })

  it('refetches with the selected warehouse', async () => {
    mockApi()
    render(<FinancialOverviewPage />, { wrapper })

    await screen.findByText('Total Purchase Spend')

    const warehouseSelectButton = screen.getAllByText('All Warehouses')[0].closest('button')
    expect(warehouseSelectButton).not.toBeNull()
    fireEvent.click(warehouseSelectButton as HTMLButtonElement)

    await waitFor(() => {
      expect(lastFinancialCallParams().warehouse_id).toBe(1)
    })
  })

  it('refetches with the selected product', async () => {
    mockApi()
    render(<FinancialOverviewPage />, { wrapper })

    await screen.findByText('Total Purchase Spend')

    fireEvent.click(screen.getByText('product-1'))

    await waitFor(() => {
      expect(lastFinancialCallParams().product_id).toBe(1)
    })
  })
})