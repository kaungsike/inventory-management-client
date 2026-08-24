import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryApi } from '@/lib/api'
import type { Category, PaginatedResponse } from '@/lib/types'
import { toast } from 'sonner'

interface CategoryFilters {
  search?: string
  status?: string
  page?: number
  per_page?: number
}

export function useCategories(filters: CategoryFilters = {}) {
  return useQuery<PaginatedResponse<Category>>({
    queryKey: ['categories', filters],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/categories', { params: filters })
      return data
    },
  })
}

export function useAllCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories', 'all'],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/categories/all')
      return data
    },
  })
}

export function useTrashedCategories(filters: CategoryFilters = {}) {
  return useQuery<PaginatedResponse<Category>>({
    queryKey: ['categories', 'trashed', filters],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/categories/trashed', { params: filters })
      return data
    },
  })
}

export function useCategoryMutation() {
  const queryClient = useQueryClient()

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['categories'] })

  const create = useMutation({
    mutationFn: (data: Partial<Category>) => inventoryApi.post('/categories', data),
    onSuccess: () => { toast.success('Category created'); invalidate() },
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Category> }) =>
      inventoryApi.put(`/categories/${id}`, data),
    onSuccess: () => { toast.success('Category updated'); invalidate() },
  })

  const remove = useMutation({
    mutationFn: (id: number) => inventoryApi.delete(`/categories/${id}`),
    onSuccess: () => { toast.success('Category deleted'); invalidate() },
  })

  const restore = useMutation({
    mutationFn: (id: number) => inventoryApi.post(`/categories/${id}/restore`),
    onSuccess: () => { toast.success('Category restored'); invalidate() },
  })

  const toggleStatus = useMutation({
    mutationFn: (id: number) => inventoryApi.patch(`/categories/${id}/toggle-status`),
    onSuccess: () => { toast.success('Category status updated'); invalidate() },
  })

  return { create, update, remove, restore, toggleStatus }
}
