import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { useTrashedPurchaseOrders, usePurchaseOrderMutation } from '@/hooks/usePurchaseOrders'
import { PageHeader } from '@/components/common/PageHeader'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { DataTable, TablePagination } from '@/components/common/DataTable'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { RoleGuard } from '@/components/auth/RoleGuard'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { PurchaseOrder } from '@/lib/types'

export default function PurchaseOrdersTrashPage() {
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [restoreTarget, setRestoreTarget] = useState<PurchaseOrder | null>(null)

  const { data, isLoading } = useTrashedPurchaseOrders({
    status: status || undefined,
    page,
  })
  const { restore } = usePurchaseOrderMutation()

  const columns: ColumnDef<PurchaseOrder, unknown>[] = [
    {
      accessorKey: 'po_number', header: 'PO Number',
      cell: ({ row }) => <span className="font-mono text-sm">{row.original.po_number}</span>,
    },
    { accessorKey: 'supplier', header: 'Supplier', cell: ({ row }) => row.original.supplier?.name ?? '—' },
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
      <PageHeader title="Deleted Purchase Orders" description="View and restore soft-deleted purchase orders"
        action={
          <Link to="/purchase-orders">
            <Button variant="outline">
              <ArrowLeft className="size-4 mr-2" /> Back to Purchase Orders
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
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="received">Received</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? <LoadingSpinner className="min-h-[200px]" /> :
        !data?.data?.length ? <EmptyState icon={Trash2} title="No deleted purchase orders"
          description="Soft-deleted purchase orders will appear here" /> : (
          <>
            <DataTable data={data.data} columns={columns} />
            {data.meta && <TablePagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} total={data.meta.total} onPageChange={setPage} />}
          </>
        )}

      <ConfirmDialog open={!!restoreTarget} onClose={() => setRestoreTarget(null)}
        onConfirm={async () => { if (restoreTarget) await restore.mutateAsync(restoreTarget.id) }}
        title="Restore Purchase Order" description={`Restore PO "${restoreTarget?.po_number}"? It will become active again.`} confirmLabel="Restore" variant="default" />
    </div>
  )
}
