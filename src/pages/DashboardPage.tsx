import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Package, AlertTriangle, TrendingUp, Users } from 'lucide-react'
import { useDashboardStats } from '@/hooks/useDashboard'
import { PageHeader } from '@/components/common/PageHeader'
import { StatsCard } from '@/components/common/StatsCard'
import { StatusBadge } from '@/components/common/StatusBadge'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDateTime } from '@/lib/utils'

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats()

  if (isLoading) return <LoadingSpinner className="min-h-[400px]" />

  // Process monthly data for bar chart
  const monthlyData = stats?.monthly_transaction_summary?.reduce((acc, item) => {
    const existing = acc.find(d => d.month === item.month)
    if (existing) {
      existing[item.type] = item.total_quantity
    } else {
      acc.push({ month: item.month, [item.type]: item.total_quantity })
    }
    return acc
  }, [] as Record<string, unknown>[]) ?? []

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
        <StatsCard icon={TrendingUp} label="Inventory Value" value={formatCurrency(stats?.total_inventory_value ?? 0)} />
        <StatsCard icon={Users} label="Active Suppliers" value={stats?.total_suppliers ?? 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Transactions (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="purchase" fill="#3b82f6" name="Purchase" radius={[2, 2, 0, 0]} />
                <Bar dataKey="sale" fill="#10b981" name="Sale" radius={[2, 2, 0, 0]} />
                <Bar dataKey="adjustment" fill="#f59e0b" name="Adjustment" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
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
                    <p className="text-sm font-medium truncate">{tx.product?.name ?? `Product #${tx.product_id}`}</p>
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
