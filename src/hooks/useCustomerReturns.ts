import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryApi } from '@/lib/api'
import type { CustomerReturn, PaginatedResponse, ReturnFilters } from '@/lib/types'
import { toast } from 'sonner'

export function useCustomerReturns(filters: ReturnFilters = {}) {
  return useQuery<PaginatedResponse<CustomerReturn>>({
    queryKey: ['customer-returns', filters],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/customer-returns', { params: filters })
      return data
    },
  })
}

export function useCustomerReturn(id: number | null) {
  return useQuery<CustomerReturn>({
    queryKey: ['customer-returns', id],
    queryFn: async () => {
      const { data } = await inventoryApi.get(`/customer-returns/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useCustomerReturnMutation() {
  const queryClient = useQueryClient()
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['customer-returns'] })
    queryClient.invalidateQueries({ queryKey: ['inventory'] })
    queryClient.invalidateQueries({ queryKey: ['transactions'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  }

  const create = useMutation({
    mutationFn: (data: unknown) => inventoryApi.post('/customer-returns', data),
    onSuccess: () => { toast.success('Customer return created'); invalidate() },
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: unknown }) =>
      inventoryApi.put(`/customer-returns/${id}`, data),
    onSuccess: () => { toast.success('Customer return updated'); invalidate() },
  })

  const complete = useMutation({
    mutationFn: (id: number) => inventoryApi.post(`/customer-returns/${id}/complete`),
    onSuccess: () => { toast.success('Customer return completed'); invalidate() },
  })

  const cancel = useMutation({
    mutationFn: (id: number) => inventoryApi.post(`/customer-returns/${id}/cancel`),
    onSuccess: () => { toast.success('Customer return cancelled'); invalidate() },
  })

  return { create, update, complete, cancel }
}