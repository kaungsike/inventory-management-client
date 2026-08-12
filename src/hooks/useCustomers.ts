import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryApi } from '@/lib/api'
import type { Customer, PaginatedResponse } from '@/lib/types'
import { toast } from 'sonner'

interface CustomerFilters { search?: string; status?: string; page?: number; per_page?: number }

export function useCustomers(filters: CustomerFilters = {}) {
  return useQuery<PaginatedResponse<Customer>>({
    queryKey: ['customers', filters],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/customers', { params: filters })
      return data
    },
  })
}

export function useAllCustomers() {
  return useQuery<Customer[]>({
    queryKey: ['customers', 'all'],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/customers/all')
      return data
    },
  })
}

export function useCustomerMutation() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['customers'] })

  const create = useMutation({
    mutationFn: (data: Partial<Customer>) => inventoryApi.post('/customers', data),
    onSuccess: () => { toast.success('Customer created'); invalidate() },
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Customer> }) =>
      inventoryApi.put(`/customers/${id}`, data),
    onSuccess: () => { toast.success('Customer updated'); invalidate() },
  })

  const remove = useMutation({
    mutationFn: (id: number) => inventoryApi.delete(`/customers/${id}`),
    onSuccess: () => { toast.success('Customer deleted'); invalidate() },
  })

  return { create, update, remove }
}
