import { useState } from 'react'
import { FileText, Download } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { useTransactions } from '@/hooks/useTransactions'
import { useAllWarehouses } from '@/hooks/useWarehouses'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable, TablePagination } from '@/components/common/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import type { InventoryTransaction } from '@/lib/types'

export default function TransactionsPage() {
  const [type, setType] = useState('')
  const [warehouseId, setWarehouseId] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useTransactions({
    type: type || undefined,
    warehouse_id: warehouseId ? Number(warehouseId) : undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    page,
  })
  const { data: warehouses = [] } = useAllWarehouses()

  const exportCSV = () => {
    const rows = data?.data ?? []
    const headers = ['Date', 'Reference', 'Product', 'SKU', 'Warehouse', 'Type', 'Quantity', 'Unit Cost', 'Notes']
    const csvRows = [
      headers.join(','),
      ...rows.map(tx => [
        formatDateTime(tx.transaction_date),
        tx.reference_number ?? '',
        tx.product?.name ?? '',
        tx.product?.sku ?? '',
        tx.warehouse?.name ?? '',
        tx.type,
        tx.quantity,
        tx.unit_cost ?? '',
        (tx.notes ?? '').replace(/,/g, ';'),
      ].join(',')),
    ]
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'transactions.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const columns: ColumnDef<InventoryTransaction, unknown>[] = [
    { accessorKey: 'transaction_date', header: 'Date', cell: ({ row }) => formatDateTime(row.original.transaction_date) },
    { accessorKey: 'reference_number', header: 'Reference', cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.reference_number ?? '—'}</span>
    )},
    { accessorKey: 'product', header: 'Product', cell: ({ row }) => (
      <div>
        <p className="font-medium text-sm">{row.original.product?.name ?? '—'}</p>
        <p className="text-xs text-muted-foreground font-mono">{row.original.product?.sku}</p>
      </div>
    )},
    { accessorKey: 'warehouse', header: 'Warehouse', cell: ({ row }) => row.original.warehouse?.name ?? '—' },
    { accessorKey: 'type', header: 'Type', cell: ({ row }) => <StatusBadge status={row.original.type} /> },
    { accessorKey: 'quantity', header: 'Qty', cell: ({ row }) => (
      <span className={row.original.quantity > 0 ? 'text-green-600' : 'text-destructive'}>
        {row.original.quantity > 0 ? '+' : ''}{row.original.quantity}
      </span>
    )},
    { accessorKey: 'unit_cost', header: 'Unit Cost', cell: ({ row }) => row.original.unit_cost ? formatCurrency(row.original.unit_cost) : '—' },
    { accessorKey: 'notes', header: 'Notes', cell: ({ row }) => (
      <span className="text-xs text-muted-foreground max-w-xs truncate block">{row.original.notes ?? '—'}</span>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions"
        description="View all inventory movements"
        action={
          <Button variant="outline" onClick={exportCSV}>
            <Download className="size-4 mr-2" />Export CSV
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={type} onValueChange={(v) => { setType(v ?? ''); setPage(1) }}>
          <SelectTrigger className="w-40"><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="purchase">Purchase</SelectItem>
            <SelectItem value="sale">Sale</SelectItem>
            <SelectItem value="transfer">Transfer</SelectItem>
            <SelectItem value="adjustment">Adjustment</SelectItem>
            <SelectItem value="return">Return</SelectItem>
          </SelectContent>
        </Select>
        <Select value={warehouseId} onValueChange={(v) => { setWarehouseId(v ?? ''); setPage(1) }}>
          <SelectTrigger className="w-44"><SelectValue placeholder="All Warehouses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Warehouses</SelectItem>
            {warehouses.map((w) => <SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1) }} className="w-36 h-8" />
          <span className="text-muted-foreground text-sm">to</span>
          <Input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1) }} className="w-36 h-8" />
        </div>
      </div>

      {isLoading ? <LoadingSpinner className="min-h-[200px]" /> :
        !data?.data?.length ? <EmptyState icon={FileText} title="No transactions found" /> : (
          <>
            <DataTable data={data.data} columns={columns} />
            {data.meta && <TablePagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} total={data.meta.total} onPageChange={setPage} />}
          </>
        )}
    </div>
  )
}
