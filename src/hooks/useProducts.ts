import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryApi } from '@/lib/api'
import type { Product, PaginatedResponse } from '@/lib/types'
import { toast } from 'sonner'

interface ProductFilters { search?: string; category_id?: number; supplier_id?: number; status?: string; page?: number; per_page?: number }

export function useProducts(filters: ProductFilters = {}) {
  return useQuery<PaginatedResponse<Product>>({
    queryKey: ['products', filters],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/products', { params: filters })
      return data
    },
  })
}

export function useProduct(id: number | null) {
  return useQuery<Product>({
    queryKey: ['products', id],
    queryFn: async () => {
      const { data } = await inventoryApi.get(`/products/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useLowStockProducts() {
  return useQuery<Product[]>({
    queryKey: ['products', 'low-stock'],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/products/low-stock')
      return data
    },
  })
}

export function useProductMutation() {
  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['products'] })

  const create = useMutation({
    mutationFn: (data: Partial<Product>) => inventoryApi.post('/products', data),
    onSuccess: () => { toast.success('Product created'); invalidate() },
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) =>
      inventoryApi.put(`/products/${id}`, data),
    onSuccess: () => { toast.success('Product updated'); invalidate() },
  })

  const remove = useMutation({
    mutationFn: (id: number) => inventoryApi.delete(`/products/${id}`),
    onSuccess: () => { toast.success('Product deleted'); invalidate() },
  })

  return { create, update, remove }
}
