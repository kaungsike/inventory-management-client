import { useQuery } from '@tanstack/react-query'
import { inventoryApi } from '@/lib/api'
import type { ActivityLog, ActivityLogFilters, PaginatedResponse } from '@/lib/types'

export function useActivityLogs(filters: ActivityLogFilters = {}) {
  return useQuery<PaginatedResponse<ActivityLog>>({
    queryKey: ['activity-logs', filters],
    queryFn: async () => {
      const { data } = await inventoryApi.get('/activity-logs', { params: filters })
      return data
    },
  })
}
