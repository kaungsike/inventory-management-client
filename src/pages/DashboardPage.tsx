import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Package, AlertTriangle, TrendingUp, Users, CalendarDays, CalendarRange } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useDashboardStats } from '@/hooks/useDashboard'
import { PageHeader } from '@/components/common/PageHeader'
import { StatsCard } from '@/components/common/StatsCard'
import { StatusBadge } from '@/components/common/StatusBadge'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { RoleGuard } from '@/components/auth/RoleGuard'
import type { FinancialSummary } from '@/lib/types'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

function FinancialCard({ title, icon: Icon, data }: { title: string; icon: LucideIcon; data?: FinancialSummary }) {
  const financial = data ?? { revenue: 0, cogs: 0, gross_profit: 0, gross_margin: 0, sales_count: 0, units_sold: 0, average_order_value: 0 }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="size-4 text-muted-foreground" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <div>
            <p className="text-xs text-muted-foreground">Revenue</p>
            <p className="text-lg font-bold">{formatCurrency(financial.revenue)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">COGS</p>
            <p className="text-lg font-bold">{formatCurrency(financial.cogs)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Gross Profit</p>
            <p className={`text-lg font-bold ${financial.gross_profit < 0 ? 'text-destructive' : 'text-green-600'}`}>
              {formatCurrency(financial.gross_profit)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Gross Margin</p>
            <p className="text-lg font-bold">{financial.gross_margin.toFixed(2)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats()

  if (isLoading) return <LoadingSpinner className="min-h-[400px]" />

  const shortDate = (value: string) => {
    const d = new Date(value)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const last30Days = stats?.last_30_days_sales?.map((row) => ({
    date: shortDate(row.date),
    Revenue: row.revenue,
    COGS: row.cogs,
    'Gross Profit': row.gross_profit,
  })) ?? []

  const monthlyFinancial = stats?.monthly_financial_summary?.map((row) => {
    const [y, m] = row.month.split('-').map(Number)
    return {
      month: new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'short' }),
      Revenue: row.revenue,
      COGS: row.cogs,
      'Gross Profit': row.gross_profit,
    }
  }) ?? []

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Inventory management overview" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Package} label="Total Products" value={stats?.total_products ?? 0} />
        <StatsCard
          icon={AlertTriangle}
          label="Low Stock Items"
          value={stats?.low_stock_count ?? 0}
          iconClassName={stats?.low_stock_count ? 'bg-destructive/10' : undefined}
          className={stats?.low_stock_count ? 'border-destructive/30' : undefined}
        />
        <RoleGuard roles={['admin', 'manager']}>
          <StatsCard icon={TrendingUp} label="Inventory Value" value={formatCurrency(stats?.total_inventory_value ?? 0)} />
        </RoleGuard>
        <RoleGuard roles={['admin', 'manager']}>
          <StatsCard icon={Users} label="Active Suppliers" value={stats?.total_suppliers ?? 0} />
        </RoleGuard>
      </div>

      {/* Financial KPIs */}
      <RoleGuard roles={['admin', 'manager']}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FinancialCard title="Today's Sales" icon={CalendarDays} data={stats?.today_financial} />
          <FinancialCard title="This Month's Sales" icon={CalendarRange} data={stats?.month_financial} />
        </div>
      </RoleGuard>

      <RoleGuard roles={['admin', 'manager']}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Last 30 Days Financial Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Last 30 Days — Revenue / COGS / Gross Profit</CardTitle>
            </CardHeader>
            <CardContent>
              {last30Days.length ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={last30Days}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatCurrency(Number(v))} />
                    <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                    <Legend />
                    <Bar dataKey="Revenue" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="COGS" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="Gross Profit" fill="#10b981" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground py-16 text-center">No sales data in the last 30 days</p>
              )}
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products by Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.top_products_by_value?.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div
                      className="size-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: COLORS[i] + '20', color: COLORS[i] }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.sku}</p>
                    </div>
                    <span className="text-sm font-medium">{formatCurrency(p.total_value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </RoleGuard>

      <RoleGuard roles={['admin', 'manager']}>
        {/* Monthly Financial Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue / COGS / Gross Profit</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyFinancial.length ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyFinancial}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatCurrency(Number(v))} />
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                  <Legend />
                  <Bar dataKey="Revenue" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="COGS" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="Gross Profit" fill="#10b981" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground py-16 text-center">No sales data available</p>
            )}
          </CardContent>
        </Card>
      </RoleGuard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats?.recent_transactions?.slice(0, 8).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{tx.product_name ?? `Product #${tx.product_id}`}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(tx.transaction_date)}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <StatusBadge status={tx.type} />
                    <span className="text-sm font-mono">{tx.quantity > 0 ? '+' : ''}{tx.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <Link to="/transactions">
                <Button variant="outline" size="sm" className="w-full">View All Transactions</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        {(stats?.low_stock_count ?? 0) > 0 && (
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="size-4" />
                Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {stats?.low_stock_count} item(s) need restocking
              </p>
              <Link to="/low-stock">
                <Button variant="destructive" size="sm">View All Low Stock Items</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}