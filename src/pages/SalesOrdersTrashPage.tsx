import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { useTrashedSalesOrders, useSalesOrderMutation } from '@/hooks/useSalesOrders'
import { PageHeader } from '@/components/common/PageHeader'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { DataTable, TablePagination } from '@/components/common/DataTable'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { RoleGuard } from '@/components/auth/RoleGuard'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { SalesOrder } from '@/lib/types'

export default function SalesOrdersTrashPage() {
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [restoreTarget, setRestoreTarget] = useState<SalesOrder | null>(null)

  const { data, isLoading } = useTrashedSalesOrders({
    status: status || undefined,
    page,
  })
  const { restore } = useSalesOrderMutation()

  const columns: ColumnDef<SalesOrder, unknown>[] = [
    {
      accessorKey: 'so_number', header: 'SO Number',
      cell: ({ row }) => <span className="font-mono text-sm">{row.original.so_number}</span>,
    },
    { accessorKey: 'customer', header: 'Customer', cell: ({ row }) => row.original.customer?.name ?? '—' },
    { accessorKey: 'warehouse', header: 'Warehouse', cell: ({ row }) => row.original.warehouse?.name ?? '—' },
    { accessorKey: 'order_date', header: 'Order Date', cell: ({ row }) => formatDate(row.original.order_date) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => row.original.status },
    { accessorKey: 'total_amount', header: 'Total', cell: ({ row }) => formatCurrency(row.original.total_amount) },
    {
      accessorKey: 'deleted_at',
      header: 'Deleted At',
      cell: ({ row }) => row.original.deleted_at ? new Date(row.original.deleted_at).toLocaleDateString() : '—',
    },
    {
      id: 'actions', header: 'Actions',
      cell: ({ row }) => (
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
      <PageHeader title="Deleted Sales Orders" description="View and restore soft-deleted sales orders"
        action={
          <Link to="/sales-orders">
            <Button variant="outline">
              <ArrowLeft className="size-4 mr-2" /> Back to Sales Orders
            </Button>
          </Link>
        }
      />

      <div className="flex flex-wrap gap-3">
        <Select value={status} onValueChange={(v) => { setStatus(v ?? ''); setPage(1) }}>
          <SelectTrigger className="w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? <LoadingSpinner className="min-h-[200px]" /> :
        !data?.data?.length ? <EmptyState icon={Trash2} title="No deleted sales orders"
          description="Soft-deleted sales orders will appear here" /> : (
          <>
            <DataTable data={data.data} columns={columns} />
            {data.meta && <TablePagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} total={data.meta.total} onPageChange={setPage} />}
          </>
        )}

      <ConfirmDialog open={!!restoreTarget} onClose={() => setRestoreTarget(null)}
        onConfirm={async () => { if (restoreTarget) await restore.mutateAsync(restoreTarget.id) }}
        title="Restore Sales Order" description={`Restore SO "${restoreTarget?.so_number}"? It will become active again.`} confirmLabel="Restore" variant="default" />
    </div>
  )
}
