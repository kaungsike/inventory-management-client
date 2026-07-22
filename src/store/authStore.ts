import { create } from "zustand"
import { persist } from "zustand/middleware"

type Student = {
  id: number
  student_name: string
  email: string
  email_verified: boolean
  phone_number: string
  profile_image_url: string | null
  university_reg_no: string | null
  roll_number: string | null
  nrc_number: string | null
  matriculation_roll_no: string | null
  total_matriculation_marks: string | null
  status: string
}

type AuthState = {
  token: string | null
  student: Student | null
  setAuth: (token: string, student: Student) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      student: null,
      setAuth: (token, student) => set({ token, student }),
      clearAuth: () => set({ token: null, student: null }),
    }),
    { name: "auth" } // persists to localStorage automatically
  )
)
