// RegisterForm.tsx
import { Controller } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { state_code, nrc_types, getTownshipsByState } from "@/util/nrc-data"
import {
  filterMyanmarDigitsWithConversion,
  filterMyanmarPhoneWithPrefix,
  PHONE_PREFIX,
} from "@/util/myanmar-digits"
import { CustomSpinner } from "@/components/ui/spinner"
import { useRegisterForm } from "@/auth/hooks/useRegisterForm"

function Req() {
  return (
    <span className="text-destructive" aria-hidden="true">
      {" "}
      *
    </span>
  )
}

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
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
  } = useRegisterForm()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Fill in the details below to register as a student
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <FieldSeparator>ကျောင်းသားဟောင်း</FieldSeparator>

              <Field data-invalid={!!errors.roll_number}>
                <FieldLabel htmlFor="roll_number" className="flex justify-between">
                  ခုံအမှတ်
                </FieldLabel>
                <Input
                  id="roll_number"
                  type="text"
                  placeholder="၂၀၂၀၃-ကသ-၁၂၃"
                  disabled={!isExistingStudent}
                  {...register("roll_number", {
                    required: isExistingStudent ? "Roll number is required." : false,
                    pattern: { value: /^\S+$/, message: "Roll number must not contain spaces." },
                  })}
                />
                {errors.roll_number && <FieldError>{errors.roll_number.message}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.university_reg_no}>
                <FieldLabel htmlFor="university_reg_no" className="flex justify-between">
                  ကျောင်းဝင်အမှတ်
                </FieldLabel>
                <Input
                  id="university_reg_no"
                  type="text"
                  placeholder="ကပတ(ဘအ)-၁၂၃၄"
                  disabled={!isExistingStudent}
                  {...register("university_reg_no", {
                    required: isExistingStudent ? "University registration number is required." : false,
                    pattern: { value: /^\S+$/, message: "University registration number must not contain spaces." },
                  })}
                />
                {errors.university_reg_no && <FieldError>{errors.university_reg_no.message}</FieldError>}
              </Field>

              <FieldGroup className="mb-2 max-w-sm">
                <Field orientation="horizontal">
                  <Controller
                    name="is_existing_student"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          onExistingStudentChange(checked === true, field.onChange)
                        }
                      />
                    )}
                  />
                  <Label htmlFor="is_existing_student">ကျောင်းသားဟောင်းများအတွက်သာ</Label>
                </Field>
              </FieldGroup>

              <FieldSeparator>အကောက်အချက်အလက်များ</FieldSeparator>

              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="name">အမည် <Req /></FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="မောင်မောင်"
                  aria-invalid={!!errors.name}
                  {...register("name", {
                    required: "Full name is required.",
                    minLength: { value: 2, message: "Name must be at least 2 characters." },
                    maxLength: { value: 100, message: "Name must be at most 100 characters." },
                  })}
                />
                {errors.name && <FieldError>{errors.name.message}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">အီးမေးလ် <Req /></FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  aria-invalid={!!errors.email}
                  {...register("email", {
                    required: "Email is required.",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address." },
                  })}
                />
                {errors.email && <FieldError>{errors.email.message}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.phone_number}>
                <FieldLabel htmlFor="phone_number">ဖုန်းနံပါတ် <Req /></FieldLabel>
                <Controller
                  name="phone_number"
                  control={control}
                  defaultValue={PHONE_PREFIX}
                  rules={{
                    required: "ဖုန်းနံပါတ် လိုအပ်ပါသည်။",
                    validate: (value) => {
                      const afterPrefix = value.slice(PHONE_PREFIX.length)
                      if (afterPrefix.length < 7) return "ဖုန်းနံပါတ် အနည်းဆုံး ၇ လုံး ရှိရမည်။"
                      if (!/^[\u1040-\u1049]+$/.test(afterPrefix)) return "မြန်မာဂဏန်းများသာ ရိုက်ထည့်ပါ။"
                      return true
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      id="phone_number"
                      type="tel"
                      placeholder="၉၅၉၉၁၂၃၄၅၆၇၈"
                      aria-invalid={!!errors.phone_number}
                      value={field.value ?? PHONE_PREFIX}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      onKeyDown={(e) => {
                        const pos = e.currentTarget.selectionStart ?? 0
                        if ((e.key === "Backspace" || e.key === "Delete") && pos <= PHONE_PREFIX.length) {
                          e.preventDefault()
                        }
                      }}
                      onChange={(e) => field.onChange(filterMyanmarPhoneWithPrefix(e.target.value))}
                    />
                  )}
                />
                {errors.phone_number && <FieldError>{errors.phone_number.message}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">စကားဝှက် <Req /></FieldLabel>
                <Input
                  id="password"
                  type="password"
                  aria-invalid={!!errors.password}
                  {...register("password", {
                    required: "Password is required.",
                    minLength: { value: 8, message: "Password must be at least 8 characters." },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                      message: "Password must include uppercase, lowercase, and a number.",
                    },
                  })}
                />
                {errors.password && <FieldError>{errors.password.message}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.password_confirmation}>
                <FieldLabel htmlFor="password_confirmation">စကားဝှက်အတည်ပြုရန် <Req /></FieldLabel>
                <Input
                  id="password_confirmation"
                  type="password"
                  aria-invalid={!!errors.password_confirmation}
                  {...register("password_confirmation", {
                    required: "Please confirm your password.",
                    validate: (value) => value === password || "Passwords do not match.",
                  })}
                />
                {errors.password_confirmation && <FieldError>{errors.password_confirmation.message}</FieldError>}
              </Field>

              <FieldSeparator />

              <Field
                data-invalid={
                  !isNrcInProcess &&
                  !!(errors.nrc_state || errors.nrc_township || errors.nrc_type || errors.nrc_number)
                }
              >
                <FieldLabel>မှတ်ပုံတင်အမှတ်</FieldLabel>

                <div className="flex w-full items-center gap-2">
                  <Controller
                    name="nrc_state"
                    control={control}
                    rules={{ required: isNrcInProcess ? false : "State is required." }}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={(val) => onStateChange(val ?? "", field.onChange)}
                        disabled={isNrcInProcess}
                      >
                        <SelectTrigger id="nrc_state" aria-invalid={!isNrcInProcess && !!errors.nrc_state} className="flex-1" disabled={isNrcInProcess}>
                          <SelectValue placeholder="တိုင်း" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {state_code.map((s) => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <span className="shrink-0 select-none text-muted-foreground">/</span>

                  <Controller
                    name="nrc_township"
                    control={control}
                    rules={{ required: isNrcInProcess ? false : "Township is required." }}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        disabled={!selectedState || isNrcInProcess}
                      >
                        <SelectTrigger id="nrc_township" aria-invalid={!isNrcInProcess && !!errors.nrc_township} className="flex-1" disabled={!selectedState || isNrcInProcess}>
                          <SelectValue placeholder="မြို့နယ်" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {getTownshipsByState(selectedState ?? "").map((t) => (
                              <SelectItem key={t.township_code} value={t.township_code}>{t.township_code}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <Controller
                    name="nrc_type"
                    control={control}
                    rules={{ required: isNrcInProcess ? false : "Type is required." }}
                    render={({ field }) => (
                      <Select value={field.value ?? ""} onValueChange={field.onChange} disabled={isNrcInProcess}>
                        <SelectTrigger id="nrc_type" aria-invalid={!isNrcInProcess && !!errors.nrc_type} className="flex-1" disabled={isNrcInProcess}>
                          <SelectValue placeholder="အမျိုးအစား" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {nrc_types.map((t) => (
                              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <Controller
                  name="nrc_number"
                  control={control}
                  rules={{
                    required: isNrcInProcess ? false : "NRC number is required.",
                    pattern: isNrcInProcess
                      ? undefined
                      : { value: /^[\u1040-\u1049]{6}$/, message: "NRC number must be exactly 6 Myanmar digits." },
                  }}
                  render={({ field }) => (
                    <Input
                      id="nrc_number"
                      type="text"
                      placeholder="၁၂၃၄၅၆"
                      className="w-full"
                      aria-invalid={!isNrcInProcess && !!errors.nrc_number}
                      disabled={isNrcInProcess}
                      value={field.value ?? ""}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      onChange={(e) => field.onChange(filterMyanmarDigitsWithConversion(e.target.value))}
                    />
                  )}
                />

                {!isNrcInProcess && errors.nrc_state && <FieldError>{errors.nrc_state.message}</FieldError>}
                {!isNrcInProcess && errors.nrc_township && <FieldError>{errors.nrc_township.message}</FieldError>}
                {!isNrcInProcess && errors.nrc_type && <FieldError>{errors.nrc_type.message}</FieldError>}
                {!isNrcInProcess && errors.nrc_number && <FieldError>{errors.nrc_number.message}</FieldError>}
              </Field>

              <FieldGroup className="mb-2 max-w-sm">
                <Field orientation="horizontal">
                  <Controller
                    name="nrc_in_process"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          onNrcInProcessChange(checked === true, field.onChange)
                        }
                      />
                    )}
                  />
                  <Label htmlFor="nrc_in_process">လျှောက်ထားဆဲ</Label>
                </Field>
              </FieldGroup>

              <FieldSeparator />

              <Field data-invalid={!!errors.fathers_name}>
                <FieldLabel htmlFor="fathers_name">ဖခင်အမည် <Req /></FieldLabel>
                <Input
                  id="fathers_name"
                  type="text"
                  placeholder="ဦးမောင်မောင်"
                  aria-invalid={!!errors.fathers_name}
                  {...register("fathers_name", {
                    required: "Father's name is required.",
                    minLength: { value: 2, message: "Father's name must be at least 2 characters." },
                  })}
                />
                {errors.fathers_name && <FieldError>{errors.fathers_name.message}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.matriculation_roll_no}>
                <FieldLabel htmlFor="matriculation_roll_no">တက္ကသိုလ်ဝင်တန်းခုံအမှတ် <Req /></FieldLabel>
                <Input
                  id="matriculation_roll_no"
                  type="text"
                  placeholder="ညဖ-၁၂၃"
                  aria-invalid={!!errors.matriculation_roll_no}
                  {...register("matriculation_roll_no", {
                    required: "Matriculation roll number is required.",
                    pattern: { value: /^\S+$/, message: "Roll number must not contain spaces." },
                  })}
                />
                {errors.matriculation_roll_no && <FieldError>{errors.matriculation_roll_no.message}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.total_matriculation_marks}>
                <FieldLabel htmlFor="total_matriculation_marks">တက္ကသိုလ်ဝင်တန်းရမှတ် <Req /></FieldLabel>
                <Controller
                  name="total_matriculation_marks"
                  control={control}
                  rules={{
                    required: "Total marks is required.",
                    pattern: { value: /^[\u1040-\u1049]+$/, message: "Myanmar digits only (၀၁၂၃၄၅၆၇၈၉)." },
                  }}
                  render={({ field }) => (
                    <Input
                      id="total_matriculation_marks"
                      type="text"
                      placeholder="၃၈၀"
                      aria-invalid={!!errors.total_matriculation_marks}
                      value={field.value ?? ""}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      onChange={(e) => field.onChange(filterMyanmarDigitsWithConversion(e.target.value))}
                    />
                  )}
                />
                {errors.total_matriculation_marks && <FieldError>{errors.total_matriculation_marks.message}</FieldError>}
              </Field>

              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <CustomSpinner /> : "Register"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link to="/login">Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}