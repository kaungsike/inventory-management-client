import { useState } from 'react'
import { DollarSign, TrendingDown, TrendingUp, Percent, ShoppingBag, Package, Receipt, Undo2, Download } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { useSalesReport } from '@/hooks/useReports'
import { useAllWarehouses } from '@/hooks/useWarehouses'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable } from '@/components/common/DataTable'
import { StatsCard } from '@/components/common/StatsCard'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { ProductCombobox } from '@/components/forms/ProductCombobox'
import { ReportDateRangeFilter } from '@/components/reports/ReportDateRangeFilter'
import { formatCurrency, formatDate } from '@/lib/utils'
import { downloadCsv, csvDate, csvNumber } from '@/lib/csv'
import { toLabelItems } from '@/lib/labels'
import type { SalesReportRow } from '@/lib/types'

export default function SalesReportPage() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [warehouseId, setWarehouseId] = useState('')
  const [productId, setProductId] = useState('')

  const { data, isLoading } = useSalesReport({
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    warehouse_id: warehouseId ? Number(warehouseId) : undefined,
    product_id: productId ? Number(productId) : undefined,
  })
  const { data: warehouses = [] } = useAllWarehouses()

  const summary = data?.summary
  const rows = data?.data ?? []

  const exportCSV = () => {
    const headers = ['Date', 'Product', 'SKU', 'Warehouse', 'Reference', 'Quantity', 'Unit Price', 'Unit Cost', 'Revenue', 'COGS', 'Gross Profit']
    const dataRows = rows.map((row) => [
      csvDate(row.transaction_date),
      row.product_name ?? '',
      row.product_sku ?? '',
      row.warehouse_name ?? '',
      row.reference_number ?? '',
      csvNumber(row.quantity),
      csvNumber(row.unit_price),
      csvNumber(row.unit_cost),
      csvNumber(row.revenue),
      csvNumber(row.cogs),
      csvNumber(row.gross_profit),
    ])
    downloadCsv('sales-report.csv', headers, dataRows)
  }

  const columns: ColumnDef<SalesReportRow, unknown>[] = [
    { accessorKey: 'transaction_date', header: 'Date', cell: ({ row }) => formatDate(row.original.transaction_date) },
    { accessorKey: 'product', header: 'Product', cell: ({ row }) => (
      <div>
        <p className="font-medium text-sm">{row.original.product_name ?? '—'}</p>
        <p className="text-xs text-muted-foreground font-mono">{row.original.product_sku ?? ''}</p>
      </div>
    )},
    { accessorKey: 'warehouse_name', header: 'Warehouse', cell: ({ row }) => row.original.warehouse_name ?? '—' },
    { accessorKey: 'reference_number', header: 'Reference', cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.reference_number ?? '—'}</span>
    )},
    { accessorKey: 'quantity', header: 'Qty', cell: ({ row }) => (
      <span className="text-destructive">{row.original.quantity}</span>
    )},
    { accessorKey: 'unit_price', header: 'Unit Price', cell: ({ row }) => formatCurrency(row.original.unit_price) },
    { accessorKey: 'unit_cost', header: 'Unit Cost', cell: ({ row }) => formatCurrency(row.original.unit_cost) },
    { accessorKey: 'revenue', header: 'Revenue', cell: ({ row }) => <span className="font-medium">{formatCurrency(row.original.revenue)}</span> },
    { accessorKey: 'cogs', header: 'COGS', cell: ({ row }) => formatCurrency(row.original.cogs) },
    { accessorKey: 'gross_profit', header: 'Gross Profit', cell: ({ row }) => (
      <span className={row.original.gross_profit < 0 ? 'text-destructive' : 'text-green-600'}>
        {formatCurrency(row.original.gross_profit)}
      </span>
    )},
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Report"
        description="Historical sales revenue, COGS and profit from transaction snapshots, net of completed customer returns"
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
        <div className="w-56">
          <ProductCombobox value={productId} onChange={(v) => setProductId(v)} placeholder="All Products" />
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard icon={DollarSign} label="Net Revenue (after returns)" value={formatCurrency(summary.revenue)} />
            <StatsCard icon={TrendingDown} label="Net COGS (after returns)" value={formatCurrency(summary.cogs)} />
            <StatsCard
              icon={TrendingUp}
              label="Gross Profit"
              value={formatCurrency(summary.gross_profit)}
              iconClassName={summary.gross_profit < 0 ? 'bg-destructive/10' : undefined}
            />
            <StatsCard icon={Percent} label="Gross Margin" value={`${summary.gross_margin.toFixed(2)}%`} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard icon={TrendingUp} label="Gross Sales" value={formatCurrency(summary.gross_sales)} />
            <StatsCard icon={Undo2} label="Returns" value={formatCurrency(summary.return_value)} iconClassName="bg-emerald-600/10" />
            <StatsCard icon={ShoppingBag} label="Sales Count" value={summary.sales_count} />
            <StatsCard icon={Package} label="Units Sold" value={summary.units_sold} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard icon={TrendingDown} label="Sales COGS" value={formatCurrency(summary.sales_cogs)} />
            <StatsCard icon={Undo2} label="Returned COGS" value={formatCurrency(summary.returned_cogs)} iconClassName="bg-emerald-600/10" />
            <StatsCard icon={Package} label="Returned Units" value={summary.returned_units} />
            <StatsCard icon={Receipt} label="Avg Order Value" value={formatCurrency(summary.average_order_value)} />
          </div>
        </div>
      )}

      {isLoading ? <LoadingSpinner className="min-h-[300px]" /> : !rows.length ? (
        <EmptyState icon={DollarSign} title="No sales in this range" description="Try widening the date range or clearing filters" />
      ) : (
        <DataTable data={rows} columns={columns} />
      )}
    </div>
  )
}