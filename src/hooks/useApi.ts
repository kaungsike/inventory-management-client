import useSWR from "swr"

export function useApi<T>(url: string | null) {
  const { data, error, isLoading, mutate } = useSWR<{ success: boolean; data: T }>(url)

  return {
    data: data?.data ?? null,
    error,
    isLoading,
    mutate,
  }
}