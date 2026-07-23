import { useQuery } from '@tanstack/react-query'
import { inventoryApi } from '@/lib/api'
import type { DashboardStats } from '@/lib/types'

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/dashboard/stats')
      return data.data
    },
    refetchInterval: 30000,
  })
}
