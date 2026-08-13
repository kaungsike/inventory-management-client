import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye, Undo2 } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { useCustomerReturns } from '@/hooks/useCustomerReturns'
import { useAllCustomers } from '@/hooks/useCustomers'
import { useAllWarehouses } from '@/hooks/useWarehouses'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable, TablePagination } from '@/components/common/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { CustomerReturn } from '@/lib/types'

export default function CustomerReturnsPage() {
  const [status, setStatus] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [warehouseId, setWarehouseId] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useCustomerReturns({
    status: status || undefined,
    customer_id: customerId ? Number(customerId) : undefined,
    warehouse_id: warehouseId ? Number(warehouseId) : undefined,
    page,
  })
  const { data: customers = [] } = useAllCustomers()
  const { data: warehouses = [] } = useAllWarehouses()

  const columns: ColumnDef<CustomerReturn, unknown>[] = [
    {
      accessorKey: 'return_number', header: 'Return Number',
      cell: ({ row }) => <span className="font-mono text-sm">{row.original.return_number}</span>,
    },
    { accessorKey: 'customer', header: 'Customer', cell: ({ row }) => row.original.customer?.name ?? '—' },
    { accessorKey: 'warehouse', header: 'Warehouse', cell: ({ row }) => row.original.warehouse?.name ?? '—' },
    { accessorKey: 'sales_order', header: 'Sales Order', cell: ({ row }) => (
      <Link to={`/sales-orders/${row.original.sales_order_id}`} className="font-mono text-xs hover:underline">
        {row.original.sales_order?.so_number ?? `#${row.original.sales_order_id}`}
      </Link>
    )},
    { accessorKey: 'return_date', header: 'Return Date', cell: ({ row }) => formatDate(row.original.return_date) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'total_amount', header: 'Total', cell: ({ row }) => formatCurrency(row.original.total_amount) },
    {
      id: 'actions', header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Link to={`/customer-returns/${row.original.id}`}>
            <Button variant="ghost" size="sm"><Eye className="size-3" /></Button>
          </Link>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Customer Returns" description="Manage returned stock from shipped sales orders"
        action={
          <Link to="/customer-returns/new"><Button><Plus className="size-4 mr-2" />New Customer Return</Button></Link>
        }
      />

      <div className="flex flex-wrap gap-3">
        <Select value={status} onValueChange={(v) => { setStatus(v ?? ''); setPage(1) }}>
          <SelectTrigger className="w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={customerId} onValueChange={(v) => { setCustomerId(v ?? ''); setPage(1) }}>
          <SelectTrigger className="w-48"><SelectValue placeholder="All Customers" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Customers</SelectItem>
            {customers.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={warehouseId} onValueChange={(v) => { setWarehouseId(v ?? ''); setPage(1) }}>
          <SelectTrigger className="w-48"><SelectValue placeholder="All Warehouses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Warehouses</SelectItem>
            {warehouses.map((w) => <SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? <LoadingSpinner className="min-h-[200px]" /> :
        !data?.data?.length ? <EmptyState icon={Undo2} title="No customer returns found" /> : (
          <>
            <DataTable data={data.data} columns={columns} />
            {data.meta && <TablePagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} total={data.meta.total} onPageChange={setPage} />}
          </>
        )}
    </div>
  )
}