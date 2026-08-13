import { useState } from 'react'
import { DollarSign, TrendingDown, TrendingUp, Percent, ShoppingBag, Package, Undo2, CalendarDays, CalendarRange } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { useProfitReport } from '@/hooks/useReports'
import { useAllWarehouses } from '@/hooks/useWarehouses'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable } from '@/components/common/DataTable'
import { StatsCard } from '@/components/common/StatsCard'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { ReportDateRangeFilter } from '@/components/reports/ReportDateRangeFilter'
import { formatCurrency } from '@/lib/utils'
import type { DailySalesRow, MonthlySalesRow } from '@/lib/types'

const monthLabel = (month: string) => {
  const [y, m] = month.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

export default function ProfitReportPage() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [warehouseId, setWarehouseId] = useState('')

  const { data, isLoading } = useProfitReport({
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    warehouse_id: warehouseId ? Number(warehouseId) : undefined,
  })
  const { data: warehouses = [] } = useAllWarehouses()

  const summary = data?.summary
  const daily = data?.daily ?? []
  const monthly = data?.monthly ?? []

  const dailyColumns: ColumnDef<DailySalesRow, unknown>[] = [
    { accessorKey: 'date', header: 'Date' },
    { accessorKey: 'gross_sales', header: 'Gross Sales', cell: ({ row }) => formatCurrency(row.original.gross_sales) },
    { accessorKey: 'return_value', header: 'Returns', cell: ({ row }) => (
      <span className="text-emerald-600 dark:text-emerald-400">-{formatCurrency(row.original.return_value)}</span>
    )},
    { accessorKey: 'revenue', header: 'Net Revenue', cell: ({ row }) => formatCurrency(row.original.revenue) },
    { accessorKey: 'cogs', header: 'Net COGS', cell: ({ row }) => formatCurrency(row.original.cogs) },
    { accessorKey: 'gross_profit', header: 'Gross Profit', cell: ({ row }) => (
      <span className={row.original.gross_profit < 0 ? 'text-destructive' : 'text-green-600'}>{formatCurrency(row.original.gross_profit)}</span>
    )},
    { accessorKey: 'gross_margin', header: 'Margin', cell: ({ row }) => `${row.original.gross_margin.toFixed(2)}%` },
    { accessorKey: 'sales_count', header: 'Sales' },
    { accessorKey: 'units_sold', header: 'Units' },
  ]

  const monthlyColumns: ColumnDef<MonthlySalesRow, unknown>[] = [
    { accessorKey: 'month', header: 'Month', cell: ({ row }) => monthLabel(row.original.month) },
    { accessorKey: 'gross_sales', header: 'Gross Sales', cell: ({ row }) => formatCurrency(row.original.gross_sales) },
    { accessorKey: 'return_value', header: 'Returns', cell: ({ row }) => (
      <span className="text-emerald-600 dark:text-emerald-400">-{formatCurrency(row.original.return_value)}</span>
    )},
    { accessorKey: 'revenue', header: 'Net Revenue', cell: ({ row }) => formatCurrency(row.original.revenue) },
    { accessorKey: 'cogs', header: 'Net COGS', cell: ({ row }) => formatCurrency(row.original.cogs) },
    { accessorKey: 'gross_profit', header: 'Gross Profit', cell: ({ row }) => (
      <span className={row.original.gross_profit < 0 ? 'text-destructive' : 'text-green-600'}>{formatCurrency(row.original.gross_profit)}</span>
    )},
    { accessorKey: 'gross_margin', header: 'Margin', cell: ({ row }) => `${row.original.gross_margin.toFixed(2)}%` },
    { accessorKey: 'sales_count', header: 'Sales' },
    { accessorKey: 'units_sold', header: 'Units' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profit Report"
        description="Gross profit breakdown by day and month from completed sales"
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <ReportDateRangeFilter dateFrom={dateFrom} dateTo={dateTo} onChange={(from, to) => { setDateFrom(from); setDateTo(to) }} />
        <Select value={warehouseId} onValueChange={(v) => setWarehouseId(v ?? '')}>
          <SelectTrigger className="w-44 h-8"><SelectValue placeholder="All Warehouses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Warehouses</SelectItem>
            {warehouses.map((w) => <SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      {summary && (
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
          <StatsCard icon={TrendingUp} label="Gross Sales" value={formatCurrency(summary.gross_sales)} />
          <StatsCard icon={Undo2} label="Returns" value={formatCurrency(summary.return_value)} iconClassName="bg-emerald-600/10" />
          <StatsCard icon={ShoppingBag} label="Sales Count" value={summary.sales_count} />
          <StatsCard icon={Package} label="Units Sold" value={summary.units_sold} />
        </div>
      )}

      {isLoading ? <LoadingSpinner className="min-h-[300px]" /> : (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CalendarDays className="size-4" /> Daily Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {daily.length ? <DataTable data={daily} columns={dailyColumns} /> : <EmptyState icon={CalendarDays} title="No daily data" />}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CalendarRange className="size-4" /> Monthly Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {monthly.length ? <DataTable data={monthly} columns={monthlyColumns} /> : <EmptyState icon={CalendarRange} title="No monthly data" />}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}