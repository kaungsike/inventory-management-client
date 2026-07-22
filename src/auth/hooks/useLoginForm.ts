import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "sonner"
import { useAuthStore } from "@/store/authStore"
import { authService } from "@/auth/services/auth.service"

export type LoginFormValues = {
  email: string
  password: string
}

export function useLoginForm() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const form = useForm<LoginFormValues>({ mode: "onTouched" })

  const {
    setError,
    formState: { isSubmitting },
  } = form

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await authService.login(data)
      toast.success(response.data?.message ?? "Login successful!")
      setAuth(response.data.token, response.data.data)
      navigate("/student/profile")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Invalid email or password.")

        const fieldErrors = error.response?.data?.errors
        if (fieldErrors && typeof fieldErrors === "object") {
          Object.entries(fieldErrors).forEach(([field, messages]) => {
            setError(field as keyof LoginFormValues, {
              type: "server",
              message: Array.isArray(messages) ? messages[0] : String(messages),
            })
          })
        }
      } else {
        toast.error("Something went wrong. Please try again.", {
          position: "top-center",
        })
      }
    }
  }

  return { form, isSubmitting, onSubmit }
}