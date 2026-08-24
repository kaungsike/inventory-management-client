import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inventoryApi } from '@/lib/api'

export interface UserItem {
  id: number
  name: string
  email: string
  role: 'admin' | 'manager'
  is_active: boolean
  created_at: string
}

export interface UserFilters {
  search?: string
  role?: string
  status?: string
  is_active?: string
  page?: number
  per_page?: number
  enabled?: boolean
}

interface UsersResponse {
  data: UserItem[]
  meta?: {
    current_page: number
    last_page: number
    total: number
    per_page: number
  }
}

export const useUsers = (filters: UserFilters = {}) => {
  const { enabled = true, ...queryFilters } = filters
  return useQuery<UsersResponse>({
    queryKey: ['users', queryFilters],
    queryFn: async () => {
      const response = await inventoryApi.get('/users', { params: queryFilters })
      return response.data
    },
    enabled,
  })
}

export const useUser = (id?: number | string) => {
  return useQuery<UserItem>({
    queryKey: ['users', id],
    queryFn: async () => {
      const response = await inventoryApi.get(`/users/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

export const useTrashedUsers = (filters: UserFilters = {}) => {
  const { enabled = true, ...queryFilters } = filters
  return useQuery<UsersResponse>({
    queryKey: ['users', 'trashed', queryFilters],
    queryFn: async () => {
      const response = await inventoryApi.get('/users/trashed', { params: queryFilters })
      return response.data
    },
    enabled,
  })
}

export const useUserMutation = () => {
  const queryClient = useQueryClient()

  const createUser = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await inventoryApi.post('/users', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const updateUser = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Record<string, unknown> }) => {
      const response = await inventoryApi.put(`/users/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const deleteUser = useMutation({
    mutationFn: async (id: number) => {
      const response = await inventoryApi.delete(`/users/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const restoreUser = useMutation({
    mutationFn: async (id: number) => {
      const response = await inventoryApi.post(`/users/${id}/restore`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const toggleStatus = useMutation({
    mutationFn: async (id: number) => {
      const response = await inventoryApi.patch(`/users/${id}/toggle-status`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  return {
    createUser,
    updateUser,
    deleteUser,
    restoreUser,
    toggleStatus,
  }
}
