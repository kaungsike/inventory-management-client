import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryApi } from '@/lib/api'
import type { PurchaseOrder, PaginatedResponse } from '@/lib/types'
import { toast } from 'sonner'

interface POFilters { status?: string; supplier_id?: number; date_from?: string; date_to?: string; page?: number; per_page?: number }

export function usePurchaseOrders(filters: POFilters = {}) {
  return useQuery<PaginatedResponse<PurchaseOrder>>({
    queryKey: ['purchase-orders', filters],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/purchase-orders', { params: filters })
      return data
    },
  })
}

export function usePurchaseOrder(id: number | null) {
  return useQuery<PurchaseOrder>({
    queryKey: ['purchase-orders', id],
    queryFn: async () => {
      const { data } = await inventoryApi.get(`/purchase-orders/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function usePurchaseOrderMutation() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['purchase-orders'] })

  const create = useMutation({
    mutationFn: (data: unknown) => inventoryApi.post('/purchase-orders', data),
    onSuccess: () => { toast.success('Purchase order created'); invalidate() },
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: unknown }) =>
      inventoryApi.put(`/purchase-orders/${id}`, data),
    onSuccess: () => { toast.success('Purchase order updated'); invalidate() },
  })

  const remove = useMutation({
    mutationFn: (id: number) => inventoryApi.delete(`/purchase-orders/${id}`),
    onSuccess: () => { toast.success('Purchase order deleted'); invalidate() },
  })

  const receive = useMutation({
    mutationFn: ({ id, items }: { id: number; items: { id: number; quantity_received: number }[] }) =>
      inventoryApi.post(`/purchase-orders/${id}/receive`, { items }),
    onSuccess: () => {
      toast.success('Items received')
      invalidate()
      queryClient.invalidateQueries({ queryKey: ['inventory'] })
    },
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      inventoryApi.patch(`/purchase-orders/${id}/status`, { status }),
    onSuccess: () => { toast.success('Status updated'); invalidate() },
  })

  return { create, update, remove, receive, updateStatus }
}
