import { apiClient } from "@/lib/api-client"
import type { RegisterFormValues } from "@/auth/hooks/useRegisterForm"

type SubmitPayload = Omit<
  RegisterFormValues,
  "nrc_state" | "nrc_township" | "nrc_type"
>

export const authService = {
  login: (data: { email: string; password: string }) =>
    apiClient.post("/auth/login", data),

  register: (payload: SubmitPayload) =>
    apiClient.post("/auth/register", payload),

  verifyOtp: (email: string, otp: string) =>
    apiClient.post("/auth/email/otp/verify", { email, otp }),

  resendOtp: (email: string) =>
    apiClient.post("/auth/email/otp/resend", {
      email,
      purpose: "email_verification",
    }),
}