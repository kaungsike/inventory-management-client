import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/authStore"

export default function RequireStudent() {
  const token = useAuthStore((s) => s.token)
  const student = useAuthStore((s) => s.student)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token || !student) {
      navigate("/login", { replace: true })
    }
  }, [token, student, navigate])

  if (!token || !student) return null

  return <Outlet />
}