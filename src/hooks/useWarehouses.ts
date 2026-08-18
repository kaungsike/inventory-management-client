import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryApi } from '@/lib/api'
import type { Warehouse, WarehouseDetail, PaginatedResponse } from '@/lib/types'
import { useUsers } from './useUsers'
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

export function useAllWarehouses(enabled = true) {
  return useQuery<Warehouse[]>({
    queryKey: ['warehouses', 'all'],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/warehouses', { params: { status: 'active', per_page: 100 } })
      return data.data
    },
    enabled,
  })
}

export function useTransferTargets(enabled = true) {
  return useQuery<Warehouse[]>({
    queryKey: ['warehouses', 'transfer-targets'],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/warehouses/transfer-targets')
      return data.data
    },
    enabled,
  })
}

export function useActiveManagers() {
  const { data } = useUsers({ role: 'manager', is_active: 'true', per_page: 100 })
  return (data?.data ?? []).filter((user) => user.is_active)
}

export function useWarehouseDetail(id: number | null) {
  return useQuery<WarehouseDetail>({
    queryKey: ['warehouses', id],
    queryFn: async () => {
      const { data } = await inventoryApi.get(`/warehouses/${id}`)
      return data.data
    },
    enabled: id !== null,
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

  const archive = useMutation({
    mutationFn: (id: number) => inventoryApi.post(`/warehouses/${id}/archive`),
    onSuccess: () => { toast.success('Warehouse archived'); invalidate() },
  })

  const restore = useMutation({
    mutationFn: (id: number) => inventoryApi.post(`/warehouses/${id}/restore`),
    onSuccess: () => { toast.success('Warehouse restored'); invalidate() },
  })

  return { create, update, archive, restore }
}