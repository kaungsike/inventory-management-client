import { useState } from 'react'
import { Undo2, Package, Layers, Download } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { useReturnReport } from '@/hooks/useReports'
import { useAllWarehouses } from '@/hooks/useWarehouses'
import { useAllCustomers } from '@/hooks/useCustomers'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable } from '@/components/common/DataTable'
import { StatsCard } from '@/components/common/StatsCard'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { ReportDateRangeFilter } from '@/components/reports/ReportDateRangeFilter'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { ReturnReportRow } from '@/lib/types'

export default function ReturnReportPage() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [warehouseId, setWarehouseId] = useState('')
  const [customerId, setCustomerId] = useState('')

  const { data, isLoading } = useReturnReport({
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    warehouse_id: warehouseId ? Number(warehouseId) : undefined,
    customer_id: customerId ? Number(customerId) : undefined,
  })
  const { data: warehouses = [] } = useAllWarehouses()
  const { data: customers = [] } = useAllCustomers()

  const summary = data?.summary
  const rows = data?.data ?? []

  const exportCSV = () => {
    const headers = ['Return #', 'Date', 'Customer', 'Warehouse', 'SO #', 'Product', 'SKU', 'Quantity', 'Unit Price', 'Unit Cost', 'Value', 'Reason']
    const csvRows = [
      headers.join(','),
      ...rows.map((row) => [
        row.return_number,
        formatDate(row.return_date),
        (row.customer_name ?? '').replace(/,/g, ';'),
        row.warehouse_name ?? '',
        row.so_number ?? '',
        row.product_name.replace(/,/g, ';'),
        row.product_sku,
        row.quantity,
        row.unit_price,
        row.unit_cost,
        row.value,
        (row.reason ?? '').replace(/,/g, ';'),
      ].join(',')),
    ]
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'return-report.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const columns: ColumnDef<ReturnReportRow, unknown>[] = [
    { accessorKey: 'return_number', header: 'Return #', cell: ({ row }) => <span className="font-mono text-sm">{row.original.return_number}</span> },
    { accessorKey: 'return_date', header: 'Date', cell: ({ row }) => formatDate(row.original.return_date) },
    { accessorKey: 'customer_name', header: 'Customer', cell: ({ row }) => row.original.customer_name ?? '—' },
    { accessorKey: 'warehouse_name', header: 'Warehouse', cell: ({ row }) => row.original.warehouse_name ?? '—' },
    { accessorKey: 'so_number', header: 'SO #', cell: ({ row }) => <span className="font-mono text-xs">{row.original.so_number ?? '—'}</span> },
    { accessorKey: 'product', header: 'Product', cell: ({ row }) => (
      <div>
        <p className="font-medium text-sm">{row.original.product_name}</p>
        <p className="text-xs text-muted-foreground font-mono">{row.original.product_sku}</p>
      </div>
    )},
    { accessorKey: 'quantity', header: 'Qty', cell: ({ row }) => row.original.quantity },
    { accessorKey: 'unit_price', header: 'Unit Price', cell: ({ row }) => formatCurrency(row.original.unit_price) },
    { accessorKey: 'unit_cost', header: 'Unit Cost', cell: ({ row }) => formatCurrency(row.original.unit_cost) },
    { accessorKey: 'value', header: 'Value', cell: ({ row }) => (
      <span className="font-medium text-emerald-600 dark:text-emerald-400">{formatCurrency(row.original.value)}</span>
    )},
    { accessorKey: 'reason', header: 'Reason', cell: ({ row }) => (
      <span className="text-xs text-muted-foreground max-w-xs truncate block">{row.original.reason ?? '—'}</span>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Return Report"
        description="Completed customer returns restocked at their original sale cost"
        action={
          <Button variant="outline" onClick={exportCSV} disabled={!rows.length}>
            <Download className="size-4 mr-2" />Export CSV
          </Button>
        }
      />

      <div className="flex flex-wrap gap-3">
        <ReportDateRangeFilter dateFrom={dateFrom} dateTo={dateTo} onChange={(from, to) => { setDateFrom(from); setDateTo(to) }} />
        <Select value={warehouseId} onValueChange={(v) => setWarehouseId(v ?? '')}>
          <SelectTrigger className="w-44 h-8"><SelectValue placeholder="All Warehouses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Warehouses</SelectItem>
            {warehouses.map((w) => <SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={customerId} onValueChange={(v) => setCustomerId(v ?? '')}>
          <SelectTrigger className="w-48 h-8"><SelectValue placeholder="All Customers" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Customers</SelectItem>
            {customers.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard icon={Undo2} label="Total Returns" value={summary.total_returns} />
          <StatsCard icon={Package} label="Total Units" value={summary.total_units} />
          <StatsCard icon={Layers} label="Total Value" value={formatCurrency(summary.total_value)} />
        </div>
      )}

      {isLoading ? <LoadingSpinner className="min-h-[300px]" /> : !rows.length ? (
        <EmptyState icon={Undo2} title="No returns in this range" description="Try widening the date range or clearing filters" />
      ) : (
        <DataTable data={rows} columns={columns} />
      )}
    </div>
  )
}