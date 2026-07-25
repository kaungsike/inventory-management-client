import type { ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface RoleGuardProps {
  roles: ('admin' | 'manager' | 'staff')[]
  children: ReactNode
  fallback?: ReactNode
}

export function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
  const { hasRole } = useAuth()

  if (!hasRole(roles)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
