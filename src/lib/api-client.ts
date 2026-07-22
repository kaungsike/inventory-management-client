import axios from "axios"
import { useAuthStore } from "@/store/authStore"

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  console.log("[request]", config.url, config.headers.Authorization) // 👈 add this
  return config
})

// No response interceptor — logout is handled by useStudentSync only