import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"
import { useAuthStore } from "@/store/authStore"

export function useChangePassword() {
  const navigate = useNavigate()
  const clearAuth = useAuthStore((s) => s.clearAuth)

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  })
  const [passwordError, setPasswordError] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const handleChangePassword = async () => {
    setPasswordError("")

    if (!passwords.current) {
      setPasswordError("Enter your current password.")
      return
    }
    if (passwords.newPass.length < 8) {
      setPasswordError("New password must be at least 8 characters.")
      return
    }
    if (passwords.newPass !== passwords.confirm) {
      setPasswordError("Passwords don't match.")
      return
    }

    setIsUpdating(true)
    try {
      const response = await apiClient.patch("/student/change-password", {
        current_password: passwords.current,
        password: passwords.newPass,
        password_confirmation: passwords.confirm,
      })
      clearAuth()
      navigate("/login")
      toast.success(response.data?.message ?? "Password updated successfully.")
      setPasswords({ current: "", newPass: "", confirm: "" })
      navigate("/student/profile")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setPasswordError(
          error.response?.data?.message ?? "Failed to update password."
        )
      } else {
        toast.error("Something went wrong.")
      }
    } finally {
      setIsUpdating(false)
    }
  }

  return {
    passwords,
    setPasswords,
    passwordError,
    isUpdating,
    handleChangePassword,
  }
}
