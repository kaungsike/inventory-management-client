import { useBanner } from "@/hooks/useBanner"
import { Button } from "./button"
import { Link } from "react-router-dom"

export function Banner() {
  const { message } = useBanner()

  if (!message) return null

  return (
    <div className="fix flex items-center gap-2 justify-center bg-blue-900 px-4 py-2 text-center text-sm text-primary-foreground">
      <p>{message} </p>
      <Link to="/registration/registration-submission">
      <Button variant="outline" className="text-black">လျှောက်ရန်</Button>
      </Link>
    </div>
  )
}
