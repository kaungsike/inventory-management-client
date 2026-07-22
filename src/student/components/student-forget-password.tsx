import { useState } from "react"
import { ArrowLeftIcon, MailIcon, LockIcon } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { apiClient } from "@/lib/api-client"
import { CustomSpinner } from "@/components/ui/spinner"

type Step = "email" | "otp" | "reset"

export default function StudentForgotPasswordPage() {
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [otpError, setOtpError] = useState("")
  const [passwords, setPasswords] = useState({ newPass: "", confirm: "" })
  const [passwordError, setPasswordError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  // ── Step 1: Send OTP ──
  const handleSendOtp = async () => {
    if (!email) return
    setIsLoading(true)
    try {
      const response = await apiClient.post("/auth/forgot-password", { email })
      toast.success(response.data?.message ?? "Reset code sent to your email.")
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

  // ── Resend OTP ──
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

  // ── Step 2: Verify OTP ──
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

  // ── Step 3: Reset Password ──
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

  return (
    <div className="mx-auto max-w-md space-y-6 px-4 py-8">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            step === "email" ? navigate(-1) : setStep(step === "reset" ? "otp" : "email")
          }
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold">Forgot Password</h1>
      </div>

      {/* Step 1 — Email */}
      {step === "email" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enter your email</CardTitle>
            <CardDescription>
              We'll send a 6-digit reset code to your email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button
              className="w-full gap-2"
              onClick={handleSendOtp}
              disabled={!email || isLoading}
            >
              {isLoading ? <CustomSpinner /> : <MailIcon className="h-4 w-4" />}
              Send reset code
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2 — OTP */}
      {step === "otp" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enter reset code</CardTitle>
            <CardDescription>
              Enter the 6-digit code sent to{" "}
              <span className="font-medium">{email}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(val) => { setOtp(val); setOtpError("") }}
              onComplete={handleVerifyOtp}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className="size-12 text-lg" />
                <InputOTPSlot index={1} className="size-12 text-lg" />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={2} className="size-12 text-lg" />
                <InputOTPSlot index={3} className="size-12 text-lg" />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={4} className="size-12 text-lg" />
                <InputOTPSlot index={5} className="size-12 text-lg" />
              </InputOTPGroup>
            </InputOTP>

            {otpError && <p className="text-sm text-destructive">{otpError}</p>}

            <div className="flex gap-2">
              <Button
                className="flex-1 gap-2"
                onClick={handleVerifyOtp}
                disabled={otp.length !== 6 || isLoading}
              >
                {isLoading ? <CustomSpinner /> : "Verify code"}
              </Button>
              <Button
                variant="outline"
                onClick={handleResend}
                disabled={cooldown > 0 || isLoading}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3 — New Password */}
      {step === "reset" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Set new password</CardTitle>
            <CardDescription>
              Choose a strong password you don't use anywhere else.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="newPass">New password</Label>
              <Input
                id="newPass"
                type="password"
                value={passwords.newPass}
                onChange={(e) =>
                  setPasswords((p) => ({ ...p, newPass: e.target.value }))
                }
                autoComplete="new-password"
              />
              <p className="text-xs text-muted-foreground">Minimum 8 characters.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPass">Confirm new password</Label>
              <Input
                id="confirmPass"
                type="password"
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords((p) => ({ ...p, confirm: e.target.value }))
                }
                autoComplete="new-password"
              />
            </div>

            {passwordError && (
              <p className="text-sm text-destructive">{passwordError}</p>
            )}

            <Button
              className="w-full gap-2"
              onClick={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? <CustomSpinner /> : <LockIcon className="h-4 w-4" />}
              Reset password
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}