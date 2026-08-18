import { useState } from 'react'
import { PackageX, CalendarClock, AlertTriangle, Package, Download } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { useStockWriteOffReport } from '@/hooks/useReports'
import { useAllWarehouses } from '@/hooks/useWarehouses'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable } from '@/components/common/DataTable'
import { StatsCard } from '@/components/common/StatsCard'
import { StatusBadge } from '@/components/common/StatusBadge'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { ProductCombobox } from '@/components/forms/ProductCombobox'
import { ReportDateRangeFilter } from '@/components/reports/ReportDateRangeFilter'
import { formatCurrency, formatDate } from '@/lib/utils'
import { STATUS_LABELS, toLabelItems } from '@/lib/labels'
import type { StockWriteOffRow } from '@/lib/types'

export default function StockWriteOffReportPage() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [warehouseId, setWarehouseId] = useState('')
  const [productId, setProductId] = useState('')
  const [type, setType] = useState('')

  const { data, isLoading } = useStockWriteOffReport({
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    warehouse_id: warehouseId ? Number(warehouseId) : undefined,
    product_id: productId ? Number(productId) : undefined,
    type: type ? (type as 'damage' | 'expired') : undefined,
  })
  const { data: warehouses = [] } = useAllWarehouses()

  const summary = data?.summary
  const rows = data?.data ?? []

  const exportCSV = () => {
    const headers = ['Date', 'Product', 'SKU', 'Warehouse', 'Type', 'Quantity', 'Unit Cost', 'Value', 'Reason']
    const csvRows = [
      headers.join(','),
      ...rows.map((row) => [
        formatDate(row.transaction_date),
        row.product_name.replace(/,/g, ';'),
        row.product_sku,
        row.warehouse_name ?? '',
        row.type,
        row.quantity,
        row.unit_cost,
        row.value,
        (row.reason ?? '').replace(/,/g, ';'),
      ].join(',')),
    ]
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'write-off-report.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const columns: ColumnDef<StockWriteOffRow, unknown>[] = [
    { accessorKey: 'transaction_date', header: 'Date', cell: ({ row }) => formatDate(row.original.transaction_date) },
    { accessorKey: 'product', header: 'Product', cell: ({ row }) => (
      <div>
        <p className="font-medium text-sm">{row.original.product_name}</p>
        <p className="text-xs text-muted-foreground font-mono">{row.original.product_sku}</p>
      </div>
    )},
    { accessorKey: 'warehouse_name', header: 'Warehouse', cell: ({ row }) => row.original.warehouse_name ?? '—' },
    { accessorKey: 'type', header: 'Type', cell: ({ row }) => <StatusBadge status={row.original.type} /> },
    { accessorKey: 'quantity', header: 'Qty', cell: ({ row }) => row.original.quantity },
    { accessorKey: 'unit_cost', header: 'Unit Cost', cell: ({ row }) => formatCurrency(row.original.unit_cost) },
    { accessorKey: 'value', header: 'Value', cell: ({ row }) => (
      <span className="font-medium text-destructive">{formatCurrency(row.original.value)}</span>
    )},
    { accessorKey: 'reason', header: 'Reason', cell: ({ row }) => (
      <span className="text-xs text-muted-foreground max-w-xs truncate block">{row.original.reason ?? '—'}</span>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Write-Off Report"
        description="Damaged and expired stock removed from inventory at their historical cost"
        action={
          <Button variant="outline" onClick={exportCSV} disabled={!rows.length}>
            <Download className="size-4 mr-2" />Export CSV
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <ReportDateRangeFilter dateFrom={dateFrom} dateTo={dateTo} onChange={(from, to) => { setDateFrom(from); setDateTo(to) }} />
        <Select value={warehouseId} onValueChange={(v) => setWarehouseId(v ?? '')} items={toLabelItems(warehouses, (w) => w.name)}>
          <SelectTrigger className="w-44 h-8"><SelectValue placeholder="All Warehouses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Warehouses</SelectItem>
            {warehouses.map((w) => <SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={(v) => setType(v ?? '')} items={STATUS_LABELS}>
          <SelectTrigger className="w-40 h-8"><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="damage">Damage</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
        <div className="w-56">
          <ProductCombobox value={productId} onChange={(v) => setProductId(v)} placeholder="All Products" />
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard icon={PackageX} label="Total Written Off" value={formatCurrency(summary.total_value)} />
          <StatsCard icon={Package} label="Total Quantity" value={summary.total_quantity} />
          <StatsCard icon={AlertTriangle} label="Damage Value" value={formatCurrency(summary.damage_value)} iconClassName="bg-destructive/10" />
          <StatsCard icon={CalendarClock} label="Expired Value" value={formatCurrency(summary.expired_value)} iconClassName="bg-destructive/10" />
        </div>
      )}

      {isLoading ? <LoadingSpinner className="min-h-[300px]" /> : !rows.length ? (
        <EmptyState icon={PackageX} title="No write-offs in this range" description="Try widening the date range or clearing filters" />
      ) : (
        <DataTable data={rows} columns={columns} />
      )}
    </div>
  )
}