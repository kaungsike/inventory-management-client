import { useAuthStore } from '@/store/useAuthStore'

export const useAuth = () => {
  const { user, token, isAuthenticated, setAuth, logout } = useAuthStore()

  return {
    user,
    token,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager',
    isStaff: user?.role === 'staff',
    hasRole: (roles: string[]) => roles.includes(user?.role ?? ''),
    canDelete: user?.role === 'admin',
    canManageUsers: user?.role === 'admin',
    canCreatePO: ['admin', 'manager'].includes(user?.role ?? ''),
    setAuth,
    logout,
  }
}
