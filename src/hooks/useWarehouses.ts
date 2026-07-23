import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryApi } from '@/lib/api'
import type { Warehouse, PaginatedResponse } from '@/lib/types'
import { toast } from 'sonner'

interface WarehouseFilters { search?: string; status?: string; page?: number }

export function useWarehouses(filters: WarehouseFilters = {}) {
  return useQuery<PaginatedResponse<Warehouse>>({
    queryKey: ['warehouses', filters],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/warehouses', { params: filters })
      return data
    },
  })
}

export function useAllWarehouses() {
  return useQuery<Warehouse[]>({
    queryKey: ['warehouses', 'all'],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/warehouses', { params: { per_page: 100 } })
      return data.data
    },
  })
}

export function useWarehouseMutation() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['warehouses'] })

  const create = useMutation({
    mutationFn: (data: Partial<Warehouse>) => inventoryApi.post('/warehouses', data),
    onSuccess: () => { toast.success('Warehouse created'); invalidate() },
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Warehouse> }) =>
      inventoryApi.put(`/warehouses/${id}`, data),
    onSuccess: () => { toast.success('Warehouse updated'); invalidate() },
  })

  const remove = useMutation({
    mutationFn: (id: number) => inventoryApi.delete(`/warehouses/${id}`),
    onSuccess: () => { toast.success('Warehouse deleted'); invalidate() },
  })

  return { create, update, remove }
}
