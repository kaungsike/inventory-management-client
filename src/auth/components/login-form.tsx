import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { CustomSpinner } from "@/components/ui/spinner"
import { useLoginForm } from "@/auth/hooks/useLoginForm"

function Req() {
  return (
    <span className="text-destructive" aria-hidden="true">
      {" "}
      *
    </span>
  )
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { form, isSubmitting, onSubmit } = useLoginForm()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>သင့်အကောင့်သို့ ဝင်ရောက်ပါ</CardTitle>
          <CardDescription>
            သင့်အကောင့်သို့ ဝင်ရောက်ရန် သင့်အီးမေးလ်နှင့် စကားဝှက်ကို
            ရိုက်ထည့်ပါ။
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">
                  အီးမေးလ် <Req />
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  aria-invalid={!!errors.email}
                  {...register("email", {
                    required: "အီးမေးလ် လိုအပ်ပါသည်။",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "မှန်ကန်သော အီးမေးလ်ကို ရိုက်ထည့်ပါ။",
                    },
                  })}
                />
                {errors.email && <FieldError>{errors.email.message}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">
                  စကားဝှက် <Req />
                </FieldLabel>
                <Input
                  id="password"
                  type="password"
                  aria-invalid={!!errors.password}
                  {...register("password", {
                    required: "စကားဝှက် လိုအပ်ပါသည်။",
                    minLength: {
                      value: 8,
                      message: "စကားဝှက်သည် အနည်းဆုံး စာလုံး ၈ လုံး ရှိရမည်။",
                    },
                  })}
                />
                {errors.password && <FieldError>{errors.password.message}</FieldError>}
              </Field>

              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <CustomSpinner /> : "လော့ဂ်အင်"}
                </Button>
                <FieldDescription className="text-center">
                  အကောင့်မရှိဘူးလား? <Link to="/register">မှတ်ပုံတင်ပါ</Link>
                </FieldDescription>
                <FieldDescription className="text-center">
                  <Link to="/">ပင်မစာမျက်နှာသို့ </Link>ပြန်သွားရန်
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}