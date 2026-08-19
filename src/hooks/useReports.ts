import { useQuery } from '@tanstack/react-query'
import { inventoryApi } from '@/lib/api'
import type {
  FinancialOverview,
  FinancialOverviewFilters,
  InventoryValuation,
  ProfitReport,
  ReportFilters,
  ReturnReport,
  SalesReport,
  StockWriteOffReport,
  WriteOffFilters,
} from '@/lib/types'

interface SalesFilters extends ReportFilters {
  date_from?: string
  date_to?: string
  warehouse_id?: number
  product_id?: number
}

interface ValuationFilters extends ReportFilters {
  warehouse_id?: number
  product_id?: number
  category_id?: number
}

export function useSalesReport(filters: SalesFilters = {}) {
  return useQuery<SalesReport>({
    queryKey: ['reports', 'sales', filters],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/reports/sales', { params: filters })
      return data
    },
  })
}

export function useProfitReport(filters: SalesFilters = {}) {
  return useQuery<ProfitReport>({
    queryKey: ['reports', 'profit', filters],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/reports/profit', { params: filters })
      return data
    },
  })
}

export function useInventoryValuation(filters: ValuationFilters = {}) {
  return useQuery<InventoryValuation>({
    queryKey: ['reports', 'inventory-valuation', filters],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/reports/inventory-valuation', { params: filters })
      return data
    },
  })
}

export function useStockWriteOffReport(filters: WriteOffFilters = {}) {
  return useQuery<StockWriteOffReport>({
    queryKey: ['reports', 'write-off', filters],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/reports/write-off', { params: filters })
      return data
    },
  })
}

export function useReturnReport(filters: { date_from?: string; date_to?: string; warehouse_id?: number; customer_id?: number } = {}) {
  return useQuery<ReturnReport>({
    queryKey: ['reports', 'returns', filters],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/reports/returns', { params: filters })
      return data
    },
  })
}

export function useFinancialOverview(filters: FinancialOverviewFilters = {}) {
  return useQuery<FinancialOverview>({
    queryKey: ['reports', 'financial-overview', filters],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/reports/financial-overview', { params: filters })
      return data
    },
  })
}