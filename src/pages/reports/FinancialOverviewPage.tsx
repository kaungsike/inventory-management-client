import { useState } from 'react'
import {
  Boxes,
  DollarSign,
  PackageX,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useFinancialOverview } from '@/hooks/useReports'
import { useAllWarehouses } from '@/hooks/useWarehouses'
import { useAllCategories } from '@/hooks/useCategories'
import { PageHeader } from '@/components/common/PageHeader'
import { StatsCard } from '@/components/common/StatsCard'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { ProductCombobox } from '@/components/forms/ProductCombobox'
import { ReportDateRangeFilter } from '@/components/reports/ReportDateRangeFilter'
import { formatCurrency } from '@/lib/utils'
import { toLabelItems } from '@/lib/labels'
import type { FinancialOverview } from '@/lib/types'

const PIE_COLORS = ['#ef4444', '#f59e0b']

const DEFAULT_OVERVIEW: FinancialOverview = {
  purchase: {
    total_spend: 0,
    ordered_amount: 0,
    received_amount: 0,
    remaining_amount: 0,
    total_pos: 0,
    total_ordered_units: 0,
    total_received_units: 0,
  },
  inventory: { units: 0, value: 0, potential_sales_value: 0, potential_gross_profit: 0 },
  sales: { gross_sales: 0, return_value: 0, net_sales: 0 },
  cost: { sales_cogs: 0, returned_cogs: 0, net_cogs: 0 },
  profit: { gross_profit: 0, write_off_loss: 0, result_after_write_offs: 0 },
  write_offs: {
    damage_quantity: 0,
    expired_quantity: 0,
    total_quantity: 0,
    damage_loss: 0,
    expired_loss: 0,
    total_loss: 0,
  },
}

interface FlowMetric {
  label: string
  value: number
}

function MetricChip({ label, value, strong }: FlowMetric & { strong?: boolean }) {
  return (
    <div className="rounded-lg border bg-card px-4 py-3 text-center">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`text-lg font-bold ${strong ? 'text-primary' : ''}`}>{formatCurrency(value)}</p>
    </div>
  )
}

function FlowRow({ a, b, result }: { a: FlowMetric; b: FlowMetric; result: FlowMetric }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <MetricChip {...a} />
      <span className="text-xl font-bold text-muted-foreground">−</span>
      <MetricChip {...b} />
      <span className="text-xl font-bold text-muted-foreground">=</span>
      <MetricChip {...result} strong />
    </div>
  )
}

export default function FinancialOverviewPage() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [warehouseId, setWarehouseId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [productId, setProductId] = useState('')

  const { data, isLoading } = useFinancialOverview({
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    warehouse_id: warehouseId ? Number(warehouseId) : undefined,
    category_id: categoryId ? Number(categoryId) : undefined,
    product_id: productId ? Number(productId) : undefined,
  })
  const { data: warehouses = [] } = useAllWarehouses()
  const { data: categories = [] } = useAllCategories()

  const overview = data ?? DEFAULT_OVERVIEW
  const hasData = (data?.purchase?.total_spend ?? 0) > 0 ||
    (data?.sales?.gross_sales ?? 0) > 0 ||
    (data?.inventory?.units ?? 0) > 0 ||
    (data?.write_offs?.total_quantity ?? 0) > 0

  const moneyBars = [
    { name: 'Gross Sales', value: overview.sales.gross_sales },
    { name: 'Net Sales', value: overview.sales.net_sales },
    { name: 'Gross Profit', value: overview.profit.gross_profit },
    { name: 'After Write-offs', value: overview.profit.result_after_write_offs },
  ]

  const purchaseBars = [
    { name: 'Ordered', value: overview.purchase.ordered_amount },
    { name: 'Received', value: overview.purchase.received_amount },
    { name: 'Outstanding', value: overview.purchase.remaining_amount },
  ]

  const writeOffPie = [
    { name: 'Damage', value: overview.write_offs.damage_loss },
    { name: 'Expired', value: overview.write_offs.expired_loss },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Financial Overview"
        description="Purchase spend, current inventory value, write-off losses and net sales profit — purchase spending is cash flow, not an expense"
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
        <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? '')} items={toLabelItems(categories, (c) => c.name)}>
          <SelectTrigger className="w-44 h-8"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="w-56">
          <ProductCombobox value={productId} onChange={(v) => setProductId(v)} placeholder="All Products" />
        </div>
      </div>

      {isLoading && !data ? (
        <LoadingSpinner className="min-h-[300px]" />
      ) : !hasData ? (
        <EmptyState
          icon={DollarSign}
          title="No financial data"
          description="Record purchases, sales and write-offs to see the inventory financial overview"
        />
      ) : (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard icon={ShoppingCart} label="Total Purchase Spend" value={formatCurrency(overview.purchase.total_spend)} />
            <StatsCard icon={Boxes} label="Current Inventory Value" value={formatCurrency(overview.inventory.value)} />
            <StatsCard icon={TrendingUp} label="Gross Sales" value={formatCurrency(overview.sales.gross_sales)} />
            <StatsCard icon={DollarSign} label="Net Sales" value={formatCurrency(overview.sales.net_sales)} />
            <StatsCard icon={TrendingDown} label="Net COGS" value={formatCurrency(overview.cost.net_cogs)} />
            <StatsCard icon={TrendingUp} label="Gross Profit" value={formatCurrency(overview.profit.gross_profit)} iconClassName={overview.profit.gross_profit < 0 ? 'bg-destructive/10' : undefined} />
            <StatsCard icon={PackageX} label="Write-off Loss" value={formatCurrency(overview.profit.write_off_loss)} iconClassName="bg-destructive/10" />
            <StatsCard icon={Wallet} label="Result After Write-offs" value={formatCurrency(overview.profit.result_after_write_offs)} iconClassName={overview.profit.result_after_write_offs < 0 ? 'bg-destructive/10' : undefined} />
          </div>

          {/* Financial flow */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profit Flow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <FlowRow
                  a={{ label: 'Gross Sales', value: overview.sales.gross_sales }}
                  b={{ label: 'Returns', value: overview.sales.return_value }}
                  result={{ label: 'Net Sales', value: overview.sales.net_sales }}
                />
                <FlowRow
                  a={{ label: 'Net Sales', value: overview.sales.net_sales }}
                  b={{ label: 'Net COGS', value: overview.cost.net_cogs }}
                  result={{ label: 'Gross Profit', value: overview.profit.gross_profit }}
                />
                <FlowRow
                  a={{ label: 'Gross Profit', value: overview.profit.gross_profit }}
                  b={{ label: 'Write-off Loss', value: overview.profit.write_off_loss }}
                  result={{ label: 'Result After Write-offs', value: overview.profit.result_after_write_offs }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Purchase Spending vs Current Inventory Value</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <MetricChip label="Purchase Spend" value={overview.purchase.total_spend} />
                  <span className="text-xl font-bold text-muted-foreground">→</span>
                  <MetricChip label="Inventory Value" value={overview.inventory.value} strong />
                  <span className="text-xl font-bold text-muted-foreground">→</span>
                  <MetricChip label="Potential Sales" value={overview.inventory.potential_sales_value} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Potential sales value and potential gross profit ({formatCurrency(overview.inventory.potential_gross_profit)}) assume
                  all on-hand stock sells at today&apos;s unit price.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Sales &amp; Profit</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={moneyBars}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(v: number) => formatCurrency(v)} width={80} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
                    <Bar dataKey="value" fill="#3b82f6" name="Amount" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Write-off Composition</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={writeOffPie} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} label>
                      {writeOffPie.map((entry, index) => (
                        <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Purchase Orders</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={purchaseBars}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(v: number) => formatCurrency(v)} width={80} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
                    <Bar dataKey="value" fill="#10b981" name="Amount" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Purchase breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><ShoppingCart className="size-4 text-muted-foreground" />Purchase Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div><dt className="text-xs text-muted-foreground">Total POs</dt><dd className="font-semibold">{overview.purchase.total_pos}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Ordered Units</dt><dd className="font-semibold">{overview.purchase.total_ordered_units}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Received Units</dt><dd className="font-semibold">{overview.purchase.total_received_units}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Ordered Amount</dt><dd className="font-semibold">{formatCurrency(overview.purchase.ordered_amount)}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Received Amount</dt><dd className="font-semibold">{formatCurrency(overview.purchase.received_amount)}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Outstanding</dt><dd className="font-semibold">{formatCurrency(overview.purchase.remaining_amount)}</dd></div>
                </dl>
              </CardContent>
            </Card>

            {/* Inventory breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Boxes className="size-4 text-muted-foreground" />Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div><dt className="text-xs text-muted-foreground">Units on Hand</dt><dd className="font-semibold">{overview.inventory.units}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Current Value</dt><dd className="font-semibold">{formatCurrency(overview.inventory.value)}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Potential Sales Value</dt><dd className="font-semibold">{formatCurrency(overview.inventory.potential_sales_value)}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Potential Gross Profit</dt><dd className="font-semibold">{formatCurrency(overview.inventory.potential_gross_profit)}</dd></div>
                </dl>
              </CardContent>
            </Card>

            {/* Write-off breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><PackageX className="size-4 text-muted-foreground" />Write-offs</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div><dt className="text-xs text-muted-foreground">Damage Units</dt><dd className="font-semibold">{overview.write_offs.damage_quantity}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Damage Loss</dt><dd className="font-semibold">{formatCurrency(overview.write_offs.damage_loss)}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Expired Units</dt><dd className="font-semibold">{overview.write_offs.expired_quantity}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Expired Loss</dt><dd className="font-semibold">{formatCurrency(overview.write_offs.expired_loss)}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Total Units</dt><dd className="font-semibold">{overview.write_offs.total_quantity}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Total Loss</dt><dd className="font-semibold">{formatCurrency(overview.write_offs.total_loss)}</dd></div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}