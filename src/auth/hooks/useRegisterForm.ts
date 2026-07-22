import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "sonner"
import { authService } from "@/auth/services/auth.service"

export type RegisterFormValues = {
  roll_number?: string
  university_reg_no?: string
  is_existing_student: boolean
  name: string
  email: string
  phone_number: string
  password: string
  password_confirmation: string
  nrc_state: string
  nrc_township: string
  nrc_type: string
  nrc_number: string | null
  nrc_in_process: boolean
  fathers_name: string
  matriculation_roll_no: string
  total_matriculation_marks: string
}

type SubmitPayload = Omit<
  RegisterFormValues,
  "nrc_state" | "nrc_township" | "nrc_type"
>

export function useRegisterForm() {
  const navigate = useNavigate()
  const [selectedState, setSelectedState] = useState<string | null>(null)

  const form = useForm<RegisterFormValues>({
    mode: "onTouched",
    defaultValues: {
      is_existing_student: false,
      nrc_in_process: false,
    },
  })

  const {
    watch,
    setValue,
    setError,
    formState: { isSubmitting },
  } = form

  const isExistingStudent = watch("is_existing_student")
  const isNrcInProcess = watch("nrc_in_process")
  const password = watch("password")

  const onStateChange = (val: string, fieldOnChange: (...args: unknown[]) => void) => {
    fieldOnChange(val)
    setSelectedState(val)
    setValue("nrc_township", "")
  }

  const onExistingStudentChange = (
    checked: boolean,
    fieldOnChange: (...args: unknown[]) => void
  ) => {
    fieldOnChange(checked)
    if (!checked) {
      setValue("roll_number", "")
      setValue("university_reg_no", "")
    }
  }

  const onNrcInProcessChange = (
    checked: boolean,
    fieldOnChange: (...args: unknown[]) => void
  ) => {
    fieldOnChange(checked)
    if (checked) {
      setValue("nrc_state", "")
      setValue("nrc_township", "")
      setValue("nrc_type", "")
      setValue("nrc_number", "")
      setSelectedState(null)
    }
  }

  const onSubmit = async (data: RegisterFormValues) => {
    const fullNrc = isNrcInProcess
      ? null
      : `${data.nrc_state}/${data.nrc_township}${data.nrc_type}-${data.nrc_number}`

    const { nrc_state, nrc_township, nrc_type, ...rest } = data
    const payload: SubmitPayload = { ...rest, nrc_number: fullNrc }

    try {
      const response = await authService.register(payload)
      toast.success(response.data?.message ?? "Registration successful!")
      navigate("/verify-email", { state: { email: data.email } })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ??
          error.response?.data?.error ??
          "Registration failed. Please check your details and try again."
        )

        const fieldErrors = error.response?.data?.errors
        if (fieldErrors && typeof fieldErrors === "object") {
          Object.entries(fieldErrors).forEach(([field, messages]) => {
            setError(field as keyof RegisterFormValues, {
              type: "server",
              message: Array.isArray(messages) ? messages[0] : String(messages),
            })
          })
        }
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    }
  }

  return {
    form,
    selectedState,
    isExistingStudent,
    isNrcInProcess,
    password,
    isSubmitting,
    onSubmit,
    onStateChange,
    onExistingStudentChange,
    onNrcInProcessChange,
  }
}