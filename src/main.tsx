import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { RouterProvider } from "react-router-dom"
import { router } from "./router/route"
import { Toaster } from "./components/ui/sonner"
import { SWRConfig } from "swr"
import { fetcher } from "@/lib/fetcher"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <SWRConfig value={{ fetcher, revalidateOnFocus: false }}>
        <RouterProvider router={router} />
      </SWRConfig>
    <Toaster position="top-center" />
  </StrictMode>
)
