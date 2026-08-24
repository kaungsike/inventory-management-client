import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye, Trash2, ShoppingBag, Trash } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { useSalesOrders, useSalesOrderMutation } from '@/hooks/useSalesOrders'
import { useAllCustomers } from '@/hooks/useCustomers'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable, TablePagination } from '@/components/common/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { RoleGuard } from '@/components/auth/RoleGuard'
import { formatCurrency, formatDate } from '@/lib/utils'
import { STATUS_LABELS, toLabelItems } from '@/lib/labels'
import type { SalesOrder } from '@/lib/types'

export default function SalesOrdersPage() {
  const [status, setStatus] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<SalesOrder | null>(null)

  const { data, isLoading } = useSalesOrders({
    status: status || undefined,
    customer_id: customerId ? Number(customerId) : undefined,
    page,
  })
  const { data: customers = [] } = useAllCustomers()
  const { remove } = useSalesOrderMutation()

  const columns: ColumnDef<SalesOrder, unknown>[] = [
    {
      accessorKey: 'so_number', header: 'SO Number',
      cell: ({ row }) => <span className="font-mono text-sm">{row.original.so_number}</span>,
    },
    { accessorKey: 'customer', header: 'Customer', cell: ({ row }) => row.original.customer?.name ?? '—' },
    { accessorKey: 'warehouse', header: 'Warehouse', cell: ({ row }) => row.original.warehouse?.name ?? '—' },
    { accessorKey: 'order_date', header: 'Order Date', cell: ({ row }) => formatDate(row.original.order_date) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'total_amount', header: 'Total', cell: ({ row }) => formatCurrency(row.original.total_amount) },
    {
      id: 'actions', header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Link to={`/sales-orders/${row.original.id}`}>
            <Button variant="ghost" size="sm"><Eye className="size-3" /></Button>
          </Link>
          <RoleGuard roles={['admin']}>
            <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(row.original)} className="text-destructive">
              <Trash2 className="size-3" />
            </Button>
          </RoleGuard>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Sales Orders" description="Manage customer sales orders"
        action={
          <div className="flex gap-2">
            <RoleGuard roles={['admin', 'manager']}>
              <Link to="/sales-orders/trash">
                <Button variant="outline">
                  <Trash className="size-4 mr-2" />Deleted
                </Button>
              </Link>
            </RoleGuard>
            <RoleGuard roles={['admin', 'manager']}>
              <Link to="/sales-orders/new"><Button><Plus className="size-4 mr-2" />New Sales Order</Button></Link>
            </RoleGuard>
          </div>
        }
      />

      <div className="flex flex-wrap gap-3">
        <Select value={status} onValueChange={(v) => { setStatus(v ?? ''); setPage(1) }} items={STATUS_LABELS}>
          <SelectTrigger className="w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={customerId} onValueChange={(v) => { setCustomerId(v ?? ''); setPage(1) }} items={toLabelItems(customers, (c) => c.name)}>
          <SelectTrigger className="w-48"><SelectValue placeholder="All Customers" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Customers</SelectItem>
            {customers.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? <LoadingSpinner className="min-h-[200px]" /> :
        !data?.data?.length ? <EmptyState icon={ShoppingBag} title="No sales orders found" /> : (
          <>
            <DataTable data={data.data} columns={columns} />
            {data.meta && <TablePagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} total={data.meta.total} onPageChange={setPage} />}
          </>
        )}

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { if (deleteTarget) await remove.mutateAsync(deleteTarget.id) }}
        title="Delete Sales Order" description={`This item will be moved to Deleted Items. Historical records will be preserved and the item can be restored later.`} confirmLabel="Delete" />
    </div>
  )
}
