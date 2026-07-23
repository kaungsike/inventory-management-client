import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryApi } from '@/lib/api'
import type { Inventory, PaginatedResponse } from '@/lib/types'
import { toast } from 'sonner'

interface InventoryFilters { warehouse_id?: number; product_id?: number; low_stock?: boolean; page?: number; per_page?: number }

export function useInventory(filters: InventoryFilters = {}) {
  return useQuery<PaginatedResponse<Inventory>>({
    queryKey: ['inventory', filters],
    queryFn: async () => {
      const params = { ...filters, low_stock: filters.low_stock ? 'true' : undefined }
      const { data } = await inventoryApi.get('/inventory', { params })
      return data
    },
  })
}

export function useLowStockInventory() {
  return useQuery<Inventory[]>({
    queryKey: ['inventory', 'low-stock'],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/inventory/low-stock')
      return data
    },
  })
}

export function useInventoryTransfer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { product_id: number; from_warehouse_id: number; to_warehouse_id: number; quantity: number; notes?: string }) =>
      inventoryApi.post('/inventory/transfer', data),
    onSuccess: () => {
      toast.success('Stock transferred successfully')
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}

export function useInventoryAdjust() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, quantity, reason }: { id: number; quantity: number; reason: string }) =>
      inventoryApi.put(`/inventory/${id}`, { quantity, reason }),
    onSuccess: () => {
      toast.success('Inventory adjusted')
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })
}
