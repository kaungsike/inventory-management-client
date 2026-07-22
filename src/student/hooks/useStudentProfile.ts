import { useEffect } from "react"
import { useAuthStore } from "@/store/authStore"
import { apiClient } from "@/lib/api-client"

export function useStudentProfile() {
  const student = useAuthStore((s) => s.student)
  const token = useAuthStore((s) => s.token)
  const setAuth = useAuthStore((s) => s.setAuth)

  // Fresh fetch on mount
  useEffect(() => {
    if (!token) return
    apiClient
      .get("/student/profile")
      .then((res) => setAuth(token, res.data.data))
      .catch(() => {})
  }, [token])

  // Poll every 20s, stops automatically once accepted
  useEffect(() => {
    if (!token || student?.status === "accepted") return

    const interval = setInterval(() => {
      apiClient
        .get("/student/profile")
        .then((res) => {
          if (res.data.data.status === "accepted") {
            setAuth(token, res.data.data)
          }
        })
        .catch(() => {})
    }, 20_000)

    return () => clearInterval(interval)
  }, [token, student?.status])

  const initials = student?.student_name
    ? student.student_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??"

  const academicFields = [
    { label: "ကျောင်းဝင်အမှတ်", value: student?.university_reg_no },
    { label: "ခုံအမှတ်", value: student?.roll_number },
    { label: "မှတ်ပုံတင်အမှတ်", value: student?.nrc_number },
    { label: "တက္ကသိုလ်ဝင်တန်းခုံအမှတ်", value: student?.matriculation_roll_no },
    { label: "တက္ကသိုလ်ဝင်တန်းရမှတ်", value: student?.total_matriculation_marks },
  ]

  const personalFields = [
    { label: "အမည်", value: student?.student_name, full: true },
    { label: "အီးမေးလ်", value: student?.email },
    { label: "ဖုန်းနံပါတ်", value: student?.phone_number },
  ]

  return { student, initials, academicFields, personalFields }
}