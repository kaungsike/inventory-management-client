import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Truck, XCircle, AlertTriangle } from 'lucide-react'
import { useSalesOrder, useSalesOrderMutation } from '@/hooks/useSalesOrders'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { formatCurrency, formatDate } from '@/lib/utils'
import { RoleGuard } from '@/components/auth/RoleGuard'
import { useState } from 'react'

export default function SalesOrderDetailPage() {
  const { id } = useParams()
  const { data: so, isLoading } = useSalesOrder(id ? Number(id) : null)
  const { confirm, ship, cancel } = useSalesOrderMutation()
  const [showCancel, setShowCancel] = useState(false)

  if (isLoading) return <LoadingSpinner className="min-h-[400px]" />
  if (!so) return <div className="p-6 text-center text-muted-foreground">Sales order not found</div>

  const canConfirm = so.status === 'draft'
  const canShip = so.status === 'confirmed'
  const canCancel = ['draft', 'confirmed'].includes(so.status)
  const isTerminal = ['shipped', 'cancelled'].includes(so.status)

  const totalOrdered = so.items?.reduce((sum, item) => sum + item.quantity_ordered, 0) ?? 0
  const totalShipped = so.items?.reduce((sum, item) => sum + item.quantity_shipped, 0) ?? 0

  const shipError = ship.error
  const shipErrorMessage = (shipError as { response?: { data?: { message?: string } } })?.response?.data?.message

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link to="/sales-orders"><Button variant="ghost" size="sm"><ArrowLeft className="size-4 mr-1" />Back</Button></Link>
        <PageHeader title={`SO: ${so.so_number}`} />
      </div>

      {/* SO Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Order Information</CardTitle>
            <StatusBadge status={so.status} />
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div><p className="text-muted-foreground">Customer</p><p className="font-medium">{so.customer?.name ?? '—'}</p></div>
          <div><p className="text-muted-foreground">Warehouse</p><p className="font-medium">{so.warehouse?.name ?? '—'}</p></div>
          <div><p className="text-muted-foreground">Order Date</p><p className="font-medium">{formatDate(so.order_date)}</p></div>
          <div><p className="text-muted-foreground">Ship Date</p><p className="font-medium">{formatDate(so.ship_date)}</p></div>
          <div><p className="text-muted-foreground">Total Amount</p><p className="font-bold">{formatCurrency(so.total_amount)}</p></div>
          <div><p className="text-muted-foreground">Shipment Progress</p><p className="font-semibold">{totalShipped} / {totalOrdered} pcs</p></div>
          {so.notes && <div className="col-span-2 sm:col-span-4"><p className="text-muted-foreground">Notes</p><p>{so.notes}</p></div>}
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card>
        <CardHeader><CardTitle>Order Items</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-2 font-medium text-muted-foreground">Product</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Ordered</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Shipped</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Unit Price</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Unit Cost</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {so.items?.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2">
                      <p>{item.product?.name ?? '—'}</p>
                      <p className="text-xs text-muted-foreground font-mono">{item.product?.sku}</p>
                    </td>
                    <td className="text-right py-2">{item.quantity_ordered}</td>
                    <td className="text-right py-2 font-medium text-emerald-600 dark:text-emerald-400">{item.quantity_shipped}</td>
                    <td className="text-right py-2">{formatCurrency(item.unit_price)}</td>
                    <td className="text-right py-2">{item.unit_cost !== null ? formatCurrency(item.unit_cost) : '—'}</td>
                    <td className="text-right py-2">{formatCurrency(item.total_amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Separator className="my-3" />
          <div className="flex justify-end">
            <p className="font-bold">Total: {formatCurrency(so.total_amount)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Shipment error */}
      {shipErrorMessage && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive text-sm flex items-start gap-3">
          <AlertTriangle className="size-5 shrink-0 mt-0.5" />
          <p>{shipErrorMessage}</p>
        </div>
      )}

      {/* Status Actions */}
      <RoleGuard roles={['admin', 'manager', 'staff']}>
        <Card>
          <CardHeader><CardTitle>Order Status Actions</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2 items-center">
            {isTerminal ? (
              <p className="text-sm text-muted-foreground">
                This sales order is <span className="font-semibold capitalize">{so.status}</span> and cannot be modified.
              </p>
            ) : (
              <>
                {canConfirm && (
                  <Button variant="default" size="sm" disabled={confirm.isPending}
                    onClick={() => confirm.mutateAsync(so.id)}>
                    <CheckCircle className="size-4 mr-1" />Confirm Order
                  </Button>
                )}
                {canShip && (
                  <Button variant="default" size="sm" className="bg-emerald-600 hover:bg-emerald-700"
                    disabled={ship.isPending}
                    onClick={() => ship.mutateAsync(so.id)}>
                    <Truck className="size-4 mr-1" />{ship.isPending ? 'Shipping...' : 'Ship Order'}
                  </Button>
                )}
                {canCancel && (
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive"
                    disabled={cancel.isPending} onClick={() => setShowCancel(true)}>
                    <XCircle className="size-4 mr-1" />Cancel Order
                  </Button>
                )}
                {so.status === 'confirmed' && (
                  <span className="text-xs text-muted-foreground ml-2">
                    Stock is checked and deducted when this order is shipped.
                  </span>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </RoleGuard>

      <ConfirmDialog open={showCancel} onClose={() => setShowCancel(false)}
        onConfirm={async () => { await cancel.mutateAsync(so.id); setShowCancel(false) }}
        title="Cancel Sales Order"
        description={`Cancel ${so.so_number}? No stock is deducted for cancelled orders.`}
        confirmLabel="Cancel Order" />
    </div>
  )
}
