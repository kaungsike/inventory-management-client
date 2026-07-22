import { useNavigate } from "react-router-dom"
import { ArrowLeftIcon,LockIcon } from "lucide-react"
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
import { Separator } from "@/components/ui/separator"
import { CustomSpinner } from "@/components/ui/spinner"
import { useChangePassword } from "@/student/hooks/useChangePassword"

export default function ChangePasswordPage() {

    const navigate = useNavigate()

  const {
    passwords,
    setPasswords,
    passwordError,
    isUpdating,
    handleChangePassword,
  } = useChangePassword()
  return (
    <div className="mx-auto max-w-md space-y-6 px-4 py-8">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/student/profile")}
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold">Change Password</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Update your password</CardTitle>
          <CardDescription>
            Use a strong password you don't use anywhere else.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="currentPass">Current password</Label>
            <Input
              id="currentPass"
              type="password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords((p) => ({ ...p, current: e.target.value }))
              }
              autoComplete="current-password"
            />
          </div>

          <Separator />

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

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleChangePassword}
              disabled={isUpdating}
              className="gap-2"
            >
              {isUpdating ? <CustomSpinner /> : <LockIcon className="h-4 w-4" />}
              Update password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}