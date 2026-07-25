import { lazy, Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  return <>{children}</>
}

const authRoute = [
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Suspense fallback={<LoadingSpinner className="min-h-screen flex items-center justify-center" />}>
          <LoginPage />
        </Suspense>
      </PublicRoute>
    ),
  },
]

export default authRoute