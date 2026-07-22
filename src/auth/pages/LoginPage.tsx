import { LoginForm } from "../components/login-form"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useEffect, useRef } from "react"
import { toast } from "sonner"

const LoginPage = () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const toastShown = useRef(false) 

  useEffect(() => {
    if (params.get("reason") === "session_expired" && !toastShown.current) {
      toastShown.current = true
      navigate("/login", { replace: true }) 
      setTimeout(() => {
        toast.error("သင့်အကောင့် ရပ်စဲသွားပါပြီ။ ထပ်မံ ဝင်ရောက်ပါ။", {
          duration: 5000,
          id: "session-expired",
        })
      }, 300)
    }
  }, [])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage