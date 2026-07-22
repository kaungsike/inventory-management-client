import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "sonner"
import { authService } from "@/auth/services/auth.service"

const RESEND_COOLDOWN = 60

export function useEmailVerify() {
  const location = useLocation()
  const navigate = useNavigate()

  const email: string = location.state?.email ?? ""

  const [otp, setOtp] = useState("")
  const [otpError, setOtpError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    if (cooldown <= 0) return
    const id = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(id)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [cooldown])

  useEffect(() => {
    if (!email) {
      toast.error("No email address found. Please register again.")
      navigate("/register")
    }
  }, [email, navigate])

  const handleOtpChange = (val: string) => {
    setOtp(val)
    if (otpError) setOtpError(null)
  }

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setOtpError("Please enter the full 6-digit code.")
      return
    }

    setOtpError(null)
    setIsVerifying(true)

    try {
      const response = await authService.verifyOtp(email, otp)
      toast.success(response.data?.message ?? "Email verified successfully!")
      navigate("/login")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setOtpError(
          error.response?.data?.message ?? "Invalid or expired code. Please try again."
        )
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return

    setIsResending(true)
    setOtp("")
    setOtpError(null)

    try {
      const response = await authService.resendOtp(email)
      const retryAfter = response.data?.data?.retry_after_seconds
      setCooldown(retryAfter ?? RESEND_COOLDOWN)
      toast.success(response.data?.message ?? "Verification code resent.")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const retryAfter = error.response?.data?.data?.retry_after_seconds
        if (error.response?.status === 429 && retryAfter) {
          setCooldown(retryAfter)
        }
        toast.error(error.response?.data?.message ?? "Failed to resend code. Try again.")
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    } finally {
      setIsResending(false)
    }
  }

  return {
    email,
    otp,
    otpError,
    isVerifying,
    isResending,
    cooldown,
    handleOtpChange,
    handleVerify,
    handleResend,
  }
}