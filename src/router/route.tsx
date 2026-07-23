import { createBrowserRouter, Navigate } from "react-router-dom"
import ErrorPage from "@/public/pages/ErrorPage"
import authRoute from "./authRoute"
import studentRoute from "./studentRoute"
import inventoryRoute from "./inventoryRoute"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  ...inventoryRoute,
  ...authRoute,
  ...studentRoute,
  { path: "*", element: <ErrorPage /> },
])