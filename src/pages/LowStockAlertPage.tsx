import { Link } from 'react-router-dom'
import { AlertTriangle, ShoppingCart } from 'lucide-react'
import { useLowStockInventory } from '@/hooks/useInventory'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { calculateStockStatus } from '@/lib/utils'

export default function LowStockAlertPage() {
  const { data: lowStockItems, isLoading } = useLowStockInventory()

  if (isLoading) return <LoadingSpinner className="min-h-[400px]" />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Low Stock Alerts"
        description={`${lowStockItems?.length ?? 0} item(s) need attention`}
      />

      {!lowStockItems?.length ? (
        <EmptyState
          icon={AlertTriangle}
          title="All stock levels are healthy"
          description="No items are below their reorder point"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lowStockItems.map((item) => {
            const status = calculateStockStatus(item.quantity, item.reorder_point)
            const isCritical = status === 'critical'

            return (
              <Card
                key={item.id}
                className={isCritical ? 'border-destructive/50' : 'border-orange-500/30'}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{item.product?.name ?? '—'}</CardTitle>
                      <p className="text-xs font-mono text-muted-foreground mt-0.5">{item.product?.sku}</p>
                    </div>
                    <Badge variant={isCritical ? 'destructive' : 'secondary'}>
                      {isCritical ? 'Critical' : 'Low'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Warehouse</span>
                    <span className="font-medium">{item.warehouse?.name ?? '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Stock</span>
                    <span className={`font-bold ${isCritical ? 'text-destructive' : 'text-orange-500'}`}>
                      {item.quantity} {item.product?.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reorder Point</span>
                    <span>{item.reorder_point}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Suggested Qty</span>
                    <span className="font-medium">{item.reorder_quantity}</span>
                  </div>
                  <div className="pt-2">
                    <Link
                      to={`/purchase-orders/new?supplier_id=${item.product?.supplier_id ?? ''}&product_id=${item.product_id}`}
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        <ShoppingCart className="size-3 mr-1" />
                        Create Purchase Order
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
