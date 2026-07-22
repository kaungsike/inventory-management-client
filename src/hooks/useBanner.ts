import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { useAuthStore } from "@/store/authStore"
import { arabicToMyanmar } from "@/util/myanmar-digits"

interface RegistrationForm {
  id: number
  academic_year: string
  semester: string
  form_type: string
  end_date: string
  is_open: boolean
  amount_of_payment: number | null
}

const SEMESTER_MM: Record<string, string> = {
  first: "ပထမ",
  second: "ဒုတိယ",
}

export function useBanner() {
  const student = useAuthStore((s) => s.student)
  const [openForm, setOpenForm] = useState<RegistrationForm | null>(null)

  useEffect(() => {
    if (student?.status !== "accepted") return

    apiClient
      .get("/registration-forms", {
        params: {
          is_open: true,
          form_type: "student_registration",
          limit: 1,
        },
      })
      .then((res) => {
        const forms: RegistrationForm[] = res.data.data
        setOpenForm(forms[0] ?? null)
      })
      .catch(() => {})
  }, [student?.status])

  const message = openForm
    ? `${arabicToMyanmar(openForm.academic_year)} ပညာသင်နှစ် ${SEMESTER_MM[openForm.semester] ?? openForm.semester} နှစ်ဝက် ကျောင်းတက်ရောက်ခွင့် လျှောက်လွှာများ လက်ခံနေပါသည်။`
    : null

  return { message }
}