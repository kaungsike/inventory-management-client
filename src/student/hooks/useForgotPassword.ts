import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"

type Step = "email" | "otp" | "reset"

export function useForgotPassword() {
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [otpError, setOtpError] = useState("")
  const [passwords, setPasswords] = useState({ newPass: "", confirm: "" })
  const [passwordError, setPasswordError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const handleSendOtp = async () => {
    if (!email) return
    setIsLoading(true)
    try {
      const response = await apiClient.post("/auth/forgot-password", { email })
      toast.success(response.data?.message ?? "Reset code sent.")
      setStep("otp")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Failed to send reset code.")
      } else {
        toast.error("Something went wrong.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (cooldown > 0) return
    setIsLoading(true)
    try {
      const response = await apiClient.post("/auth/email/otp/resend", {
        email,
        purpose: "password_reset",
      })
      const retryAfter = response.data?.data?.retry_after_seconds
      setCooldown(retryAfter ?? 60)
      toast.success(response.data?.message ?? "Code resent.")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const retryAfter = error.response?.data?.data?.retry_after_seconds
        if (retryAfter) setCooldown(retryAfter)
        toast.error(error.response?.data?.message ?? "Failed to resend.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError("Please enter the full 6-digit code.")
      return
    }
    setOtpError("")
    setIsLoading(true)
    try {
      await apiClient.post("/auth/email/otp/verify", {
        email,
        otp,
        purpose: "password_reset",
      })
      setStep("reset")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setOtpError(error.response?.data?.message ?? "Invalid or expired code.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async () => {
    setPasswordError("")
    if (passwords.newPass.length < 8) {
      setPasswordError("Password must be at least 8 characters.")
      return
    }
    if (passwords.newPass !== passwords.confirm) {
      setPasswordError("Passwords don't match.")
      return
    }
    setIsLoading(true)
    try {
      const response = await apiClient.post("/auth/reset-password", {
        email,
        otp,
        password: passwords.newPass,
        password_confirmation: passwords.confirm,
      })
      toast.success(response.data?.message ?? "Password reset successfully.")
      navigate("/login")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setPasswordError(error.response?.data?.message ?? "Failed to reset password.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const goBack = () => {
    if (step === "email") navigate(-1)
    else if (step === "otp") setStep("email")
    else setStep("otp")
  }

  return {
    step,
    email, setEmail,
    otp, setOtp,
    otpError, setOtpError,
    passwords, setPasswords,
    passwordError,
    isLoading,
    cooldown,
    handleSendOtp,
    handleResend,
    handleVerifyOtp,
    handleResetPassword,
    goBack,
  }
}