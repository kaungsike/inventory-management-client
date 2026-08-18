import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryApi } from '@/lib/api'
import type { SalesOrder, PaginatedResponse, ReturnableSalesOrder } from '@/lib/types'
import { toast } from 'sonner'

interface SOFilters { status?: string; customer_id?: number; warehouse_id?: number; date_from?: string; date_to?: string; page?: number; per_page?: number }

export function useSalesOrders(filters: SOFilters = {}) {
  return useQuery<PaginatedResponse<SalesOrder>>({
    queryKey: ['sales-orders', filters],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/sales-orders', { params: filters })
      return data
    },
  })
}

export function useSalesOrder(id: number | null) {
  return useQuery<SalesOrder>({
    queryKey: ['sales-orders', id],
    queryFn: async () => {
      const { data } = await inventoryApi.get(`/sales-orders/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useReturnableSalesOrder(id: number | null) {
  return useQuery<ReturnableSalesOrder>({
    queryKey: ['sales-orders', id, 'returnable'],
    queryFn: async () => {
      const { data } = await inventoryApi.get(`/sales-orders/${id}/returnable`)
      return data
    },
    enabled: !!id,
    retry: false,
  })
}

export function useSalesOrderMutation() {
  const queryClient = useQueryClient()
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['sales-orders'] })
    queryClient.invalidateQueries({ queryKey: ['inventory'] })
    queryClient.invalidateQueries({ queryKey: ['transactions'] })
  }

  const create = useMutation({
    mutationFn: (data: unknown) => inventoryApi.post('/sales-orders', data),
    onSuccess: () => { toast.success('Sales order created'); invalidate() },
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: unknown }) =>
      inventoryApi.put(`/sales-orders/${id}`, data),
    onSuccess: () => { toast.success('Sales order updated'); invalidate() },
  })

  const remove = useMutation({
    mutationFn: (id: number) => inventoryApi.delete(`/sales-orders/${id}`),
    onSuccess: () => { toast.success('Sales order deleted'); invalidate() },
  })

  const confirm = useMutation({
    mutationFn: (id: number) => inventoryApi.post(`/sales-orders/${id}/confirm`),
    onSuccess: () => { toast.success('Sales order confirmed'); invalidate() },
  })

  const ship = useMutation({
    mutationFn: (id: number) => inventoryApi.post(`/sales-orders/${id}/ship`),
    onSuccess: () => {
      toast.success('Sales order shipped')
      invalidate()
    },
  })

  const cancel = useMutation({
    mutationFn: (id: number) => inventoryApi.post(`/sales-orders/${id}/cancel`),
    onSuccess: () => { toast.success('Sales order cancelled'); invalidate() },
  })

  return { create, update, remove, confirm, ship, cancel }
}
