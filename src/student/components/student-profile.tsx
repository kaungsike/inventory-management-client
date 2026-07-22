import { UserIcon, SettingsIcon, LockIcon, MailIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useStudentProfile } from "@/student/hooks/useStudentProfile"

export default function StudentProfile() {
  const navigate = useNavigate()
  const { student, initials, academicFields, personalFields } =
    useStudentProfile()

  if (!student) return null

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage src={student.profile_image_url ?? undefined} />
            <AvatarFallback className="text-2xl font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>

        <div>
          <h1 className="text-xl font-semibold">{student.student_name}</h1>
          <p className="text-sm text-muted-foreground">{student.email}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <Badge variant="secondary">{student.roll_number ?? "—"}</Badge>
            <Badge
              className={
                student.status === "accepted"
                  ? "border-transparent bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "border-transparent bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              }
            >
              {student.status === "accepted" ? "စီစစ်ပြီး" : "စီစစ်ဆဲ"}
            </Badge>
          </div>
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="profile">
        <TabsList className="w-full">
          <TabsTrigger value="profile" className="flex-1 gap-2">
            <UserIcon className="h-4 w-4" /> ပရိုဖိုင်အချက်အလက်
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1 gap-2">
            <SettingsIcon className="h-4 w-4" /> ဆက်တင်များ
          </TabsTrigger>
        </TabsList>

        {/* ── Profile Tab ── */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">ပညာရေးဆိုင်ရာ အချက်အလက်</CardTitle>
              <CardDescription>မှတ်ပုံတင်အရာရှိမှ စီမံခန့်ခွဲထားသည်။</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {academicFields.map(({ label, value }) => (
                <div key={label} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    {label}
                  </Label>
                  <p className="text-sm font-medium">{value ?? "—"}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">ကိုယ်ရေးကိုယ်တာအချက်အလက်များ</CardTitle>
              <CardDescription>
                သင်မှတ်ပုံတင်ထားသော ဆက်သွယ်ရန်အသေးစိတ်အချက်အလက်များ။
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {personalFields.map(({ label, value, full }) => (
                <div
                  key={label}
                  className={`space-y-1 ${full ? "sm:col-span-2" : ""}`}
                >
                  <Label className="text-xs text-muted-foreground">
                    {label}
                  </Label>
                  <p className="text-sm font-medium">{value ?? "—"}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Settings Tab ── */}
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">အကောင့်ဆက်တင်များ</CardTitle>
              <CardDescription>
                သင့်စကားဝှက်နှင့် အကောင့်လုံခြုံရေးကို စီမံခန့်ခွဲပါ။
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">စကားဝှက်</p>
                  <p className="text-xs text-muted-foreground">
                    သင့်လက်ရှိစကားဝှက်ကို ပြောင်းလဲပါ
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/student/change-password")}
                >
                  <LockIcon className="mr-2 h-4 w-4" /> ပြောင်:ရန်
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">စကားဝှက်မေ့နေပါသလား</p>
                  <p className="text-xs text-muted-foreground">
                    အီးမေးလ်အတည်ပြုချက်မှတစ်ဆင့် ပြန်လည်သတ်မှတ်ပါ
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/forgot-password")}
                >
                  <MailIcon className="mr-2 h-4 w-4" /> ပြန်လည်သတ်မှတ်ရန်
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
