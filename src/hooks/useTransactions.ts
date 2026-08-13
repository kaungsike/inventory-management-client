import { useQuery } from '@tanstack/react-query'
import { inventoryApi } from '@/lib/api'
import type { InventoryTransaction, PaginatedResponse } from '@/lib/types'

interface TransactionFilters { product_id?: number; warehouse_id?: number; type?: string; date_from?: string; date_to?: string; page?: number; per_page?: number }

export function useTransactions(filters: TransactionFilters = {}) {
  return useQuery<PaginatedResponse<InventoryTransaction>>({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/transactions', { params: filters })
      return data
    },
  })
}
