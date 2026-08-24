import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { TablePagination } from '@/components/common/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useTrashedUsers, useUserMutation } from '@/hooks/useUsers'
import type { UserItem } from '@/hooks/useUsers'
import { formatDateTime } from '@/lib/utils'

export default function UsersTrashPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [restoreTarget, setRestoreTarget] = useState<UserItem | null>(null)

  const { data, isLoading } = useTrashedUsers({
    search: search || undefined,
    page,
  })

  const { restoreUser } = useUserMutation()

  const users: UserItem[] = data?.data ?? []

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
        title="Deleted Users"
        description="View and restore soft-deleted users"
        action={
          <Link to="/users">
            <Button variant="outline">
              <ArrowLeft className="size-4 mr-2" /> Back to Users
            </Button>
          </Link>
        }
      />

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Search deleted users..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="max-w-sm"
          />
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
                  <th className="p-4">Deleted At</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No deleted users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium text-foreground">{u.name}</td>
                      <td className="p-4 text-muted-foreground font-mono text-xs">{u.email}</td>
                      <td className="p-4">
                        <Badge variant={getRoleBadgeVariant(u.role)} className="capitalize text-xs">
                          {u.role}
                        </Badge>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">
                        {formatDateTime(u.created_at)}
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setRestoreTarget(u)}
                          title="Restore User"
                        >
                          <RotateCcw className="size-4 mr-1" /> Restore
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {data?.meta && (
        <TablePagination
          currentPage={data.meta.current_page}
          lastPage={data.meta.last_page}
          total={data.meta.total}
          onPageChange={setPage}
        />
      )}

      <ConfirmDialog
        open={!!restoreTarget}
        onClose={() => setRestoreTarget(null)}
        onConfirm={async () => { if (restoreTarget) await restoreUser.mutateAsync(restoreTarget.id) }}
        title="Restore User"
        description={`Restore user "${restoreTarget?.name}"? They will become active again.`}
        confirmLabel="Restore"
        variant="default"
      />
    </div>
  )
}
