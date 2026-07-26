import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, Package } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { inventoryApi } from '@/lib/api'
import { useAuthStore } from '@/store/useAuthStore'

interface LoginFormInputs {
  email: string
  password: string
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>()

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const response = await inventoryApi.post('/auth/login', data)
      if (response.data.success) {
        const { user, token } = response.data.data
        setAuth(user, token)
        navigate('/dashboard', { replace: true })
      } else {
        setErrorMessage(response.data.message || 'Login failed')
      }
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } }
        setErrorMessage(axiosErr.response?.data?.message || 'Invalid credentials')
      } else {
        setErrorMessage('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="size-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
              <Package className="size-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Inventory Management System</CardTitle>
          <CardDescription>Enter your credentials to sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@inventory.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Minimum 6 characters',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {errorMessage && (
              <div className="p-3 text-xs rounded-md bg-destructive/10 text-destructive border border-destructive/20 text-center">
                {errorMessage}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">Demo Credentials:</p>
            <p>Admin: <span className="font-mono text-foreground">admin@gmail.com</span></p>
            <p>Manager: <span className="font-mono text-foreground">manager@gmail.com</span></p>
            <p>Staff: <span className="font-mono text-foreground">staff@mgail.com</span></p>
            <p className="pt-1">Password: <span className="font-mono font-semibold text-foreground">asdffdsa</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
