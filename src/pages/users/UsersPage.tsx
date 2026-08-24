import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Edit2, Plus, Search, Trash2, UserCheck, UserX, Trash } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useUsers, useUserMutation } from '@/hooks/useUsers'
import type { UserItem } from '@/hooks/useUsers'
import { useAuthStore } from '@/store/useAuthStore'
import { formatDateTime } from '@/lib/utils'

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const currentUser = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const { data, isLoading } = useUsers({
    search: search || undefined,
    role: roleFilter !== 'all' ? roleFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  })

  const { deleteUser, toggleStatus } = useUserMutation()

  const users: UserItem[] = data?.data ?? []

  const handleDelete = (user: UserItem) => {
    if (user.id === currentUser?.id) {
      setDeleteError('You cannot delete your own account.')
      return
    }
    setDeleteError(null)
    setDeleteTarget(user)
  }

  const handleToggleStatus = (user: UserItem) => {
    if (user.id === currentUser?.id) {
      setDeleteError('You cannot deactivate your own account.')
      return
    }
    toggleStatus.mutate(user.id)
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive'
      case 'manager':
        return 'default'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage system users, roles, and access permissions"
        action={
          <div className="flex gap-2">
            <Link to="/users/trash">
              <Button variant="outline">
                <Trash className="size-4 mr-2" />Deleted
              </Button>
            </Link>
            <Link to="/users/new">
              <Button className="flex items-center gap-2">
                <Plus className="size-4" />
                Add User
              </Button>
            </Link>
          </div>
        }
      />

      {/* Toolbar / Filters */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full md:max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Role:</span>
              <select
                className="h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Status:</span>
              <select
                className="h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      {isLoading ? (
        <LoadingSpinner className="min-h-[300px]" />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium border-b border-border">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created At</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const isSelf = u.id === currentUser?.id
                    return (
                      <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-medium text-foreground">
                          {u.name}
                          {isSelf && (
                            <span className="ml-2 text-xs text-muted-foreground font-normal">(You)</span>
                          )}
                        </td>
                        <td className="p-4 text-muted-foreground font-mono text-xs">{u.email}</td>
                        <td className="p-4">
                          <Badge variant={getRoleBadgeVariant(u.role)} className="capitalize text-xs">
                            {u.role}
                          </Badge>
                        </td>
                        <td className="p-4">
                          {u.is_active ? (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 text-xs">
                              Inactive
                            </Badge>
                          )}
                        </td>
                        <td className="p-4 text-xs text-muted-foreground">
                          {formatDateTime(u.created_at)}
                        </td>
                        <td className="p-4 text-right space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/users/${u.id}/edit`)}
                            title="Edit User"
                          >
                            <Edit2 className="size-4" />
                          </Button>

                          {!isSelf && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleStatus(u)}
                                title={u.is_active ? 'Deactivate User' : 'Activate User'}
                              >
                                {u.is_active ? (
                                  <UserX className="size-4 text-amber-500" />
                                ) : (
                                  <UserCheck className="size-4 text-emerald-500" />
                                )}
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(u)}
                                title="Delete User"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {deleteError && (
        <div className="p-3 text-xs rounded-md bg-destructive/10 text-destructive border border-destructive/20 text-center">
          {deleteError}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { if (deleteTarget) await deleteUser.mutateAsync(deleteTarget.id) }}
        title="Delete User"
        description={`This item will be moved to Deleted Items. Historical records will be preserved and the item can be restored later.`}
        confirmLabel="Delete"
      />
    </div>
  )
}
