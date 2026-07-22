import { useState } from "react"
import { useSWRConfig } from "swr"
import axios from "axios"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"

type Method = "post" | "patch" | "put" | "delete"

type Options<T> = {
  method?: Method
  onSuccess?: (data: T) => void
  onError?: (message: string) => void
  revalidate?: string | string[]  // SWR keys to revalidate after success
  successMessage?: string
}

export function useMutate<TPayload = unknown, TResponse = unknown>(
  url: string,
  options: Options<TResponse> = {}
) {
  const { mutate } = useSWRConfig()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    method = "post",
    onSuccess,
    onError,
    revalidate,
    successMessage,
  } = options

  const trigger = async (payload?: TPayload | FormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const isFormData = payload instanceof FormData
      const response = await apiClient[method](url, payload as unknown as Record<string, unknown>, {
        headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
      })

      if (successMessage) toast.success(successMessage)
      else if (response.data?.message) toast.success(response.data.message)

      // Revalidate SWR keys after success
      if (revalidate) {
        const keys = Array.isArray(revalidate) ? revalidate : [revalidate]
        await Promise.all(keys.map((key) => mutate(key)))
      }

      onSuccess?.(response.data)
      return response.data
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ?? "Something went wrong."
        : "Something went wrong."

      setError(msg)
      toast.error(msg)
      onError?.(msg)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { trigger, isLoading, error, setError }
}