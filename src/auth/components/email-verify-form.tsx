import { Link } from "react-router-dom"
import { RefreshCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { CustomSpinner } from "@/components/ui/spinner"
import { useEmailVerify } from "@/auth/hooks/useEmailVerify"

export function EmailVerifyForm() {
  const {
    email,
    otp,
    otpError,
    isVerifying,
    isResending,
    cooldown,
    handleOtpChange,
    handleVerify,
    handleResend,
  } = useEmailVerify()

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>သင့်အီးမေးလ်ကို အတည်ပြုပါ</CardTitle>
        <CardDescription>
          ကျွန်ုပ်တို့ ဒီ <span className="font-medium">{email}</span>{" "}
          သို့ပို့ထားသော ဂဏန်း ၆ လုံးပါ အတည်ပြုကုဒ်ကို ထည့်သွင်းပါ။
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Field data-invalid={!!otpError}>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="otp-verification">အတည်ပြုကုဒ်</FieldLabel>
            <Button
              type="button"
              variant="outline"
              size="xs"
              disabled={cooldown > 0 || isResending}
              onClick={handleResend}
            >
              {isResending ? <CustomSpinner /> : <RefreshCwIcon />}
              {cooldown > 0
                ? `${cooldown} စက္ကန့်အတွင်း ပြန်ပို့ပါ`
                : "ကုဒ်ပြန်ပို့ပါ"}
            </Button>
          </div>

          <InputOTP
            id="otp-verification"
            maxLength={6}
            className="w-fit"
            value={otp}
            onChange={handleOtpChange}
            onComplete={handleVerify}
          >
            <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:rounded-lg *:data-[slot=input-otp-slot]:border">
              <InputOTPSlot index={0} className="size-13 text-lg" />
              <InputOTPSlot index={1} className="size-13 text-lg" />
              <InputOTPSlot index={2} className="size-13 text-lg" />
              <InputOTPSlot index={3} className="size-13 text-lg" />
              <InputOTPSlot index={4} className="size-13 text-lg" />
              <InputOTPSlot index={5} className="size-13 text-lg" />
            </InputOTPGroup>
          </InputOTP>

          {otpError && <FieldError>{otpError}</FieldError>}

          <FieldDescription>
            <Link to="/login">လော့ဂ်အင်သို့ပြန်သွားပါ</Link>
          </FieldDescription>
        </Field>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <Field>
          <Button
            type="button"
            className="w-full"
            disabled={otp.length !== 6 || isVerifying}
            onClick={handleVerify}
          >
            {isVerifying ? <CustomSpinner /> : "အီးမေးလ်ကို အတည်ပြုပါ"}
          </Button>
          <div className="text-sm text-muted-foreground">
            <a
              href=""
              className="underline underline-offset-4 transition-colors hover:text-primary"
            >
              Having trouble? Contact support
            </a>
          </div>
        </Field>
      </CardFooter>
    </Card>
  )
}
