import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { ProtectedRoute } from './ProtectedRoute'
import { useAuthStore } from '@/store/useAuthStore'

const admin = { id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' as const, is_active: true }
const manager = { id: 2, name: 'Manager', email: 'manager@example.com', role: 'manager' as const, is_active: true }

function renderWithRouter(ui: React.ReactNode) {
  return render(<MemoryRouter initialEntries={['/warehouses']}>{ui}</MemoryRouter>)
}

afterEach(() => {
  useAuthStore.getState().logout()
})

describe('ProtectedRoute', () => {
  it('lets a manager navigate to /warehouses', () => {
    useAuthStore.setState({ user: manager, isAuthenticated: true })

    renderWithRouter(<ProtectedRoute allowedRoles={['admin', 'manager']}><div>warehouses page</div></ProtectedRoute>)

    expect(screen.getByText('warehouses page')).toBeInTheDocument()
  })

  it('lets an admin navigate to /warehouses', () => {
    useAuthStore.setState({ user: admin, isAuthenticated: true })

    renderWithRouter(<ProtectedRoute allowedRoles={['admin', 'manager']}><div>warehouses page</div></ProtectedRoute>)

    expect(screen.getByText('warehouses page')).toBeInTheDocument()
  })

  it('lets a manager into role-open routes (no allowedRoles)', () => {
    useAuthStore.setState({ user: manager, isAuthenticated: true })

    renderWithRouter(<ProtectedRoute><div>open page</div></ProtectedRoute>)

    expect(screen.getByText('open page')).toBeInTheDocument()
  })

  it('redirects a manager away from an admin-only route', () => {
    useAuthStore.setState({ user: manager, isAuthenticated: true })

    renderWithRouter(<ProtectedRoute allowedRoles={['admin']}><div>users page</div></ProtectedRoute>)

    expect(screen.queryByText('users page')).not.toBeInTheDocument()
  })

  it('redirects unauthenticated users to /login', () => {
    useAuthStore.setState({ user: null, isAuthenticated: false })

    renderWithRouter(<ProtectedRoute><div>private page</div></ProtectedRoute>)

    expect(screen.queryByText('private page')).not.toBeInTheDocument()
  })
})