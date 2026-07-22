import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"
import { useAuthStore } from "@/store/authStore"

const POLL_INTERVAL_MS = 30_000

export function useStudentSync() {
  const token = useAuthStore((s) => s.token)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!token) return

    const sync = async () => {
      const { token: currentToken, student, setAuth } = useAuthStore.getState()
      if (!currentToken || !student) return

      try {
        const response = await apiClient.get("/auth/me")
        const raw = response.data.data

        // ✅ /auth/me returns "name" but store uses "student_name"
        // Merge raw response ON TOP of existing student to keep fields
        // that /auth/me doesn't return (phone_number, nrc_number, etc.)
        const updatedStudent = {
          ...student, // keep all existing fields
          ...raw, // overwrite with fresh data
          student_name: raw.name ?? student.student_name, // map name → student_name
        }

        if (
          student.status === "pending" &&
          updatedStudent.status === "accepted"
        ) {
          toast.success("Registration approved!", {
            description: "Your account has been verified by the admin.",
            duration: 6000,
          })
        }

        const hasChanges =
          JSON.stringify(updatedStudent) !== JSON.stringify(student)
        if (hasChanges) {
          setAuth(currentToken, updatedStudent)
        }
      } catch (error: any) {
        const status = error?.response?.status
        if (status === 401 || status === 403 || status === 404) {
          useAuthStore.getState().clearAuth()
          window.location.href = "/login?reason=session_expired"
        }
      }
    }

    const startTimeout = setTimeout(() => {
      sync()
      intervalRef.current = setInterval(sync, POLL_INTERVAL_MS)
    }, 3000)

    return () => {
      clearTimeout(startTimeout)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [token])
}
