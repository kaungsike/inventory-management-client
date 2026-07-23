import axios from 'axios'
import { toast } from 'sonner'

export const inventoryApi = axios.create({
  baseURL: import.meta.env.VITE_INVENTORY_API_URL || 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

inventoryApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong'
    if (error.response?.status !== 422) {
      toast.error(message)
    }
    return Promise.reject(error)
  }
)
