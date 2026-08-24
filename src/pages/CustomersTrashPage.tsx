import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { useTrashedCustomers, useCustomerMutation } from '@/hooks/useCustomers'
import { PageHeader } from '@/components/common/PageHeader'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { SearchInput } from '@/components/common/SearchInput'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { DataTable, TablePagination } from '@/components/common/DataTable'
import { Button } from '@/components/ui/button'
import { RoleGuard } from '@/components/auth/RoleGuard'
import type { Customer } from '@/lib/types'

export default function CustomersTrashPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [restoreTarget, setRestoreTarget] = useState<Customer | null>(null)

  const { data, isLoading } = useTrashedCustomers({ search, page })
  const { restore } = useCustomerMutation()

  const columns: ColumnDef<Customer, unknown>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email', cell: ({ row }) => row.original.email || '—' },
    { accessorKey: 'phone', header: 'Phone', cell: ({ row }) => row.original.phone || '—' },
    {
      accessorKey: 'deleted_at',
      header: 'Deleted At',
      cell: ({ row }) => row.original.deleted_at ? new Date(row.original.deleted_at).toLocaleDateString() : '—',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: { original: Customer } }) => (
        <RoleGuard roles={['admin', 'manager']}>
          <Button variant="ghost" size="sm" onClick={() => setRestoreTarget(row.original)}>
            <RotateCcw className="size-3 mr-1" /> Restore
          </Button>
        </RoleGuard>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deleted Customers"
        description="View and restore soft-deleted customers"
        action={
          <Link to="/customers">
            <Button variant="outline">
              <ArrowLeft className="size-4 mr-2" /> Back to Customers
            </Button>
          </Link>
        }
      />

      <SearchInput
        value={search}
        onChange={(v) => { setSearch(v); setPage(1) }}
        placeholder="Search deleted customers..."
        className="max-w-xs"
      />

      {isLoading ? (
        <LoadingSpinner className="min-h-[200px]" />
      ) : !data?.data?.length ? (
        <EmptyState
          icon={Trash2}
          title="No deleted customers"
          description="Soft-deleted customers will appear here"
        />
      ) : (
        <>
          <DataTable data={data.data} columns={columns} loading={isLoading} />
          {data.meta && (
            <TablePagination
              currentPage={data.meta.current_page}
              lastPage={data.meta.last_page}
              total={data.meta.total}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <ConfirmDialog
        open={!!restoreTarget}
        onClose={() => setRestoreTarget(null)}
        onConfirm={async () => { if (restoreTarget) await restore.mutateAsync(restoreTarget.id) }}
        title="Restore Customer"
        description={`Restore "${restoreTarget?.name}"? It will become active again.`}
        confirmLabel="Restore"
        variant="default"
      />
    </div>
  )
}
