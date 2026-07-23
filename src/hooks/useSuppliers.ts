import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryApi } from '@/lib/api'
import type { Supplier, PaginatedResponse } from '@/lib/types'
import { toast } from 'sonner'

interface SupplierFilters { search?: string; status?: string; page?: number; per_page?: number }

export function useSuppliers(filters: SupplierFilters = {}) {
  return useQuery<PaginatedResponse<Supplier>>({
    queryKey: ['suppliers', filters],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/suppliers', { params: filters })
      return data
    },
  })
}

export function useAllSuppliers() {
  return useQuery<Supplier[]>({
    queryKey: ['suppliers', 'all'],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/suppliers', { params: { per_page: 100 } })
      return data.data
    },
  })
}

export function useSupplierMutation() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['suppliers'] })

  const create = useMutation({
    mutationFn: (data: Partial<Supplier>) => inventoryApi.post('/suppliers', data),
    onSuccess: () => { toast.success('Supplier created'); invalidate() },
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Supplier> }) =>
      inventoryApi.put(`/suppliers/${id}`, data),
    onSuccess: () => { toast.success('Supplier updated'); invalidate() },
  })

  const remove = useMutation({
    mutationFn: (id: number) => inventoryApi.delete(`/suppliers/${id}`),
    onSuccess: () => { toast.success('Supplier deleted'); invalidate() },
  })

  return { create, update, remove }
}
