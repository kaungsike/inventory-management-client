import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye, Trash2, ShoppingCart } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { usePurchaseOrders, usePurchaseOrderMutation } from '@/hooks/usePurchaseOrders'
import { useAllSuppliers } from '@/hooks/useSuppliers'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable, TablePagination } from '@/components/common/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { PurchaseOrder } from '@/lib/types'

export default function PurchaseOrdersPage() {
  const [status, setStatus] = useState('')
  const [supplierId, setSupplierId] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<PurchaseOrder | null>(null)

  const { data, isLoading } = usePurchaseOrders({
    status: status || undefined,
    supplier_id: supplierId ? Number(supplierId) : undefined,
    page,
  })
  const { data: suppliers = [] } = useAllSuppliers()
  const { remove } = usePurchaseOrderMutation()

  const columns: ColumnDef<PurchaseOrder, unknown>[] = [
    {
      accessorKey: 'po_number', header: 'PO Number',
      cell: ({ row }) => <span className="font-mono text-sm">{row.original.po_number}</span>,
    },
    { accessorKey: 'supplier', header: 'Supplier', cell: ({ row }) => row.original.supplier?.name ?? '—' },
    { accessorKey: 'order_date', header: 'Order Date', cell: ({ row }) => formatDate(row.original.order_date) },
    { accessorKey: 'expected_date', header: 'Expected', cell: ({ row }) => formatDate(row.original.expected_date) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'total_amount', header: 'Total', cell: ({ row }) => formatCurrency(row.original.total_amount) },
    {
      id: 'actions', header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Link to={`/purchase-orders/${row.original.id}`}>
            <Button variant="ghost" size="sm"><Eye className="size-3" /></Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(row.original)} className="text-destructive">
            <Trash2 className="size-3" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Purchase Orders" description="Manage supplier purchase orders"
        action={<Link to="/purchase-orders/new"><Button><Plus className="size-4 mr-2" />New PO</Button></Link>}
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
        <Select value={supplierId} onValueChange={(v) => { setSupplierId(v ?? ''); setPage(1) }}>
          <SelectTrigger className="w-48"><SelectValue placeholder="All Suppliers" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Suppliers</SelectItem>
            {suppliers.map((s) => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? <LoadingSpinner className="min-h-[200px]" /> :
        !data?.data?.length ? <EmptyState icon={ShoppingCart} title="No purchase orders found"
          action={{ label: 'Create PO', onClick: () => {} }} /> : (
          <>
            <DataTable data={data.data} columns={columns} />
            {data.meta && <TablePagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} total={data.meta.total} onPageChange={setPage} />}
          </>
        )}

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { if (deleteTarget) await remove.mutateAsync(deleteTarget.id) }}
        title="Delete Purchase Order" description={`Delete PO "${deleteTarget?.po_number}"?`} confirmLabel="Delete" />
    </div>
  )
}
