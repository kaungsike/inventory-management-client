import { createBrowserRouter } from "react-router-dom"
import ErrorPage from "@/public/pages/ErrorPage"
import authRoute from "./authRoute"
import inventoryRoute from "./inventoryRoute"
import publicRoute from "./publicRoute"

export const routes = [
  ...publicRoute,
  ...inventoryRoute,
  ...authRoute,
  { path: "*", element: <ErrorPage /> },
]

export const router = createBrowserRouter(routes)