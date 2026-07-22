import { createBrowserRouter } from "react-router-dom"
import MainLayout from "@/layout/MainLayout"
import ErrorPage from "@/public/pages/ErrorPage"
import Home from "@/public/pages/Home"
import authRoute from "./authRoute"
import studentRoute from "./studentRoute"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
    ],
  },
  ...authRoute,
  ...studentRoute,
  { path: "*", element: <ErrorPage /> },
])