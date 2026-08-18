import axios from 'axios'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/useAuthStore'

// VITE_API_URL (set in .env / at docker build time) points at the deployed
// API, e.g. https://api.example.com/api/v1. In production builds with no
// explicit URL we fall back to the same-origin /api/v1 (requires a reverse
// proxy), and in local development to the Laravel dev server.
const apiBaseUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api/v1' : 'http://localhost:8000/api/v1')

export const inventoryApi = axios.create({
  baseURL: apiBaseUrl,
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
    } else if (status === 422) {
      // Validation / business-rule rejections: surface the server message
      // (field-level mapping is not wired up in the current forms).
      toast.error(message)
    } else {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)
