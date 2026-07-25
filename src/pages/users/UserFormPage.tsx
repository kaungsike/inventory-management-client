import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useUser, useUserMutation } from '@/hooks/useUsers'

interface UserFormInputs {
  name: string
  email: string
  password?: string
  password_confirmation?: string
  role: 'admin' | 'manager' | 'staff'
  is_active: boolean
}

export default function UserFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id

  const navigate = useNavigate()
  const { data: user, isLoading: isLoadingUser } = useUser(id)
  const { createUser, updateUser } = useUserMutation()

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<UserFormInputs>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: 'staff',
      is_active: true,
    },
  })

  useEffect(() => {
    if (user && isEdit) {
      reset({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.role,
        is_active: user.is_active,
      })
    }
  }, [user, isEdit, reset])

  const isSubmitting = createUser.isPending || updateUser.isPending

  const onSubmit = async (data: UserFormInputs) => {
    const payload: Record<string, unknown> = {
      name: data.name,
      email: data.email,
      role: data.role,
      is_active: data.is_active,
    }

    if (data.password) {
      payload.password = data.password
      payload.password_confirmation = data.password_confirmation
    }

    if (isEdit && id) {
      await updateUser.mutateAsync({ id: Number(id), data: payload })
    } else {
      payload.password = data.password
      payload.password_confirmation = data.password_confirmation
      await createUser.mutateAsync(payload)
    }

    navigate('/users')
  }

  if (isEdit && isLoadingUser) {
    return <LoadingSpinner className="min-h-[400px]" />
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <PageHeader
        title={isEdit ? 'Edit User' : 'Create New User'}
        description={isEdit ? `Update user details for ${user?.name}` : 'Add a new user account with role access'}
        action={
          <Button variant="outline" onClick={() => navigate('/users')}>
            <ArrowLeft className="mr-2 size-4" />
            Back to Users
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'User Information' : 'New Account Details'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="e.g. John Doe"
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                })}
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@inventory.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Password {isEdit && <span className="text-muted-foreground font-normal">(Leave blank to keep current password)</span>}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={isEdit ? '••••••••' : 'Minimum 8 characters'}
                {...register('password', {
                  required: !isEdit ? 'Password is required' : false,
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            {/* Password Confirmation */}
            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirm Password</Label>
              <Input
                id="password_confirmation"
                type="password"
                placeholder="••••••••"
                {...register('password_confirmation', {
                  validate: (val) => {
                    const pass = watch('password')
                    if (!pass && isEdit) return true
                    return val === pass || 'Passwords do not match'
                  },
                })}
              />
              {errors.password_confirmation && (
                <p className="text-xs text-destructive">{errors.password_confirmation.message}</p>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">User Role</Label>
              <Controller
                name="role"
                control={control}
                rules={{ required: 'Role is required' }}
                render={({ field }) => (
                  <select
                    id="role"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    {...field}
                  >
                    <option value="staff">Staff (Read-only catalog, stock transfers & receive POs)</option>
                    <option value="manager">Manager (CRUD on catalog, approve/cancel POs)</option>
                    <option value="admin">Admin (Full system access & user management)</option>
                  </select>
                )}
              />
              {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
            </div>

            {/* Is Active Status */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
              <div className="space-y-0.5">
                <Label htmlFor="is_active">Active Account</Label>
                <p className="text-xs text-muted-foreground">
                  Inactive users will be blocked from logging in.
                </p>
              </div>
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="is_active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Save className="mr-2 size-4" />
                )}
                {isEdit ? 'Save Changes' : 'Create User'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/users')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
