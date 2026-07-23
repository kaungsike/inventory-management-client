import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { RouterProvider } from "react-router-dom"
import { router } from "./router/route"
import { Toaster } from "./components/ui/sonner"
import { SWRConfig } from "swr"
import { fetcher } from "@/lib/fetcher"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>
        <RouterProvider router={router} />
      </SWRConfig>
    </QueryClientProvider>
    <Toaster position="top-center" />
  </StrictMode>
)
