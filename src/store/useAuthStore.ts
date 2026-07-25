import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  id: number
  name: string
  email: string
  role: 'admin' | 'manager' | 'staff'
  is_active: boolean
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: AuthUser, token: string) => void
  logout: () => void
  hasRole: (roles: string[]) => boolean
  canDelete: () => boolean
  canManageUsers: () => boolean
  canCreatePO: () => boolean
  isAdmin: () => boolean
  isManager: () => boolean
  isStaff: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      hasRole: (roles) => {
        const user = get().user
        return !!user && roles.includes(user.role)
      },
      canDelete: () => get().user?.role === 'admin',
      canManageUsers: () => get().user?.role === 'admin',
      canCreatePO: () => ['admin', 'manager'].includes(get().user?.role ?? ''),
      isAdmin: () => get().user?.role === 'admin',
      isManager: () => get().user?.role === 'manager',
      isStaff: () => get().user?.role === 'staff',
    }),
    {
      name: 'auth_store',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)
