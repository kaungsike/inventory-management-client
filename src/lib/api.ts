import axios from 'axios'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/useAuthStore'

export const inventoryApi = axios.create({
  baseURL: import.meta.env.VITE_INVENTORY_API_URL || 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

// Request Interceptor: Attach bearer token
inventoryApi.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Handle 401 and 403 errors
inventoryApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message || error.message || 'Something went wrong'

    if (status === 401) {
      useAuthStore.getState().logout()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    } else if (status === 403) {
      toast.error(message || "You don't have permission to perform this action")
    } else if (status !== 422) {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)
