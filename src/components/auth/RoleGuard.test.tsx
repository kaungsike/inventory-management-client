import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { RoleGuard } from './RoleGuard'
import { useAuthStore } from '@/store/useAuthStore'

const admin = { id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' as const, is_active: true }
const manager = { id: 2, name: 'Manager', email: 'manager@example.com', role: 'manager' as const, is_active: true }

afterEach(() => {
  useAuthStore.getState().logout()
})

describe('RoleGuard', () => {
  it('renders children for an admin', () => {
    useAuthStore.setState({ user: admin, isAuthenticated: true })

    render(<RoleGuard roles={['admin', 'manager']}>visible</RoleGuard>)

    expect(screen.getByText('visible')).toBeInTheDocument()
  })

  it('renders children for a manager', () => {
    useAuthStore.setState({ user: manager, isAuthenticated: true })

    render(<RoleGuard roles={['admin', 'manager']}>visible</RoleGuard>)

    expect(screen.getByText('visible')).toBeInTheDocument()
  })

  it('renders the fallback when the role is not allowed', () => {
    useAuthStore.setState({ user: manager, isAuthenticated: true })

    render(<RoleGuard roles={['admin']} fallback={<span>blocked</span>}>hidden</RoleGuard>)

    expect(screen.getByText('blocked')).toBeInTheDocument()
    expect(screen.queryByText('hidden')).not.toBeInTheDocument()
  })
})