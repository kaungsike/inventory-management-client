import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { useTrashedSuppliers, useSupplierMutation } from '@/hooks/useSuppliers'
import { PageHeader } from '@/components/common/PageHeader'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { SearchInput } from '@/components/common/SearchInput'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { DataTable, TablePagination } from '@/components/common/DataTable'
import { Button } from '@/components/ui/button'
import { RoleGuard } from '@/components/auth/RoleGuard'
import type { Supplier } from '@/lib/types'

export default function SuppliersTrashPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [restoreTarget, setRestoreTarget] = useState<Supplier | null>(null)

  const { data, isLoading } = useTrashedSuppliers({ search, page })
  const { restore } = useSupplierMutation()

  const columns: ColumnDef<Supplier, unknown>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'phone', header: 'Phone' },
    {
      accessorKey: 'company',
      header: 'Company',
      cell: ({ row }) => row.original.company || '—',
    },
    {
      accessorKey: 'deleted_at',
      header: 'Deleted At',
      cell: ({ row }) => row.original.deleted_at ? new Date(row.original.deleted_at).toLocaleDateString() : '—',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: { original: Supplier } }) => (
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
        title="Deleted Suppliers"
        description="View and restore soft-deleted suppliers"
        action={
          <Link to="/suppliers">
            <Button variant="outline">
              <ArrowLeft className="size-4 mr-2" /> Back to Suppliers
            </Button>
          </Link>
        }
      />

      <SearchInput
        value={search}
        onChange={(v) => { setSearch(v); setPage(1) }}
        placeholder="Search deleted suppliers..."
        className="max-w-xs"
      />

      {isLoading ? (
        <LoadingSpinner className="min-h-[200px]" />
      ) : !data?.data?.length ? (
        <EmptyState
          icon={Trash2}
          title="No deleted suppliers"
          description="Soft-deleted suppliers will appear here"
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
        title="Restore Supplier"
        description={`Restore "${restoreTarget?.name}"? It will become active again.`}
        confirmLabel="Restore"
        variant="default"
      />
    </div>
  )
}
