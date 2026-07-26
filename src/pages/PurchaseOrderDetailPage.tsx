import { useParams, Link } from 'react-router-dom'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { ArrowLeft, CheckCircle, Info } from 'lucide-react'
import { usePurchaseOrder, usePurchaseOrderMutation } from '@/hooks/usePurchaseOrders'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useAllWarehouses } from '@/hooks/useWarehouses'
import { RoleGuard } from '@/components/auth/RoleGuard'

interface ReceiveFormData {
  warehouse_id: string
  items: { id: number; quantity_received: string; max: number }[]
}

export default function PurchaseOrderDetailPage() {
  const { id } = useParams()
  const { data: po, isLoading } = usePurchaseOrder(id ? Number(id) : null)
  const { receive, updateStatus } = usePurchaseOrderMutation()
  const { data: warehouses = [] } = useAllWarehouses()

  const defaultWarehouseId = String(po?.warehouse_id ?? warehouses[0]?.id ?? 1)

  const { register, handleSubmit, control } = useForm<ReceiveFormData>({
    values: {
      warehouse_id: defaultWarehouseId,
      items: po?.items?.map(item => ({
        id: item.id,
        quantity_received: '0',
        max: item.quantity_ordered - item.quantity_received,
      })) ?? [],
    },
  })
  const { fields } = useFieldArray({ control, name: 'items' })

  if (isLoading) return <LoadingSpinner className="min-h-[400px]" />
  if (!po) return <div className="p-6 text-center text-muted-foreground">Purchase order not found</div>

  const canReceive = ['draft', 'sent', 'partial'].includes(po.status)
  const isTerminal = ['received', 'cancelled'].includes(po.status)

  const onReceive = async (data: ReceiveFormData) => {
    await receive.mutateAsync({
      id: po.id,
      warehouse_id: Number(data.warehouse_id),
      items: data.items.map(item => ({
        id: item.id,
        quantity_received: Number(item.quantity_received),
      })),
    })
  }

  // Calculate total ordered vs total received
  const totalOrdered = po.items?.reduce((sum, item) => sum + item.quantity_ordered, 0) ?? 0
  const totalReceived = po.items?.reduce((sum, item) => sum + item.quantity_received, 0) ?? 0

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link to="/purchase-orders"><Button variant="ghost" size="sm"><ArrowLeft className="size-4 mr-1" />Back</Button></Link>
        <PageHeader title={`PO: ${po.po_number}`} />
      </div>

      {/* PO Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Order Information</CardTitle>
            <StatusBadge status={po.status} />
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div><p className="text-muted-foreground">Supplier</p><p className="font-medium">{po.supplier?.name ?? '—'}</p></div>
          <div><p className="text-muted-foreground">Receiving Warehouse</p><p className="font-medium">{po.warehouse?.name ?? 'Default Warehouse'}</p></div>
          <div><p className="text-muted-foreground">Order Date</p><p className="font-medium">{formatDate(po.order_date)}</p></div>
          <div><p className="text-muted-foreground">Expected</p><p className="font-medium">{formatDate(po.expected_date)}</p></div>
          <div><p className="text-muted-foreground">Total Amount</p><p className="font-bold">{formatCurrency(po.total_amount)}</p></div>
          <div><p className="text-muted-foreground">Receipt Progress</p><p className="font-semibold">{totalReceived} / {totalOrdered} pcs</p></div>
          {po.notes && <div className="col-span-2 sm:col-span-4"><p className="text-muted-foreground">Notes</p><p>{po.notes}</p></div>}
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
                  <th className="text-right py-2 font-medium text-muted-foreground">Received</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Remaining</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Unit Cost</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {po.items?.map((item) => {
                  const remaining = item.quantity_ordered - item.quantity_received
                  return (
                    <tr key={item.id}>
                      <td className="py-2">
                        <p>{item.product?.name ?? '—'}</p>
                        <p className="text-xs text-muted-foreground font-mono">{item.product?.sku}</p>
                      </td>
                      <td className="text-right py-2">{item.quantity_ordered}</td>
                      <td className="text-right py-2 font-medium text-emerald-600 dark:text-emerald-400">{item.quantity_received}</td>
                      <td className="text-right py-2 font-medium text-amber-600 dark:text-amber-400">{remaining}</td>
                      <td className="text-right py-2">{formatCurrency(item.unit_cost)}</td>
                      <td className="text-right py-2">{formatCurrency(item.total_cost)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <Separator className="my-3" />
          <div className="flex justify-end">
            <p className="font-bold">Total: {formatCurrency(po.total_amount)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Partial Receipt Explanation Banner */}
      {po.status === 'partial' && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-amber-600 dark:text-amber-400 text-sm flex items-start gap-3">
          <Info className="size-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Partially Received Order ({totalReceived} of {totalOrdered} items received)</p>
            <p className="text-xs mt-1 text-muted-foreground">
              This order remains open to receive the remaining {totalOrdered - totalReceived} items. If the supplier will not deliver the remaining quantity, managers can click "Force Close / Complete Order" below.
            </p>
          </div>
        </div>
      )}

      {/* Status Update — admin + manager only */}
      <RoleGuard roles={['admin', 'manager']}>
        <Card>
          <CardHeader><CardTitle>Order Status Actions</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2 items-center">
            {isTerminal ? (
              <p className="text-sm text-muted-foreground">
                This purchase order is <span className="font-semibold capitalize">{po.status}</span> and cannot be modified.
              </p>
            ) : (
              <>
                {/* Draft -> Sent */}
                {po.status === 'draft' && (
                  <Button
                    variant="default" size="sm"
                    disabled={updateStatus.isPending}
                    onClick={() => updateStatus.mutateAsync({ id: po.id, status: 'sent' })}
                  >
                    Mark as Sent
                  </Button>
                )}

                {/* Force Complete for partial order */}
                {po.status === 'partial' && (
                  <Button
                    variant="outline" size="sm"
                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                    disabled={updateStatus.isPending}
                    onClick={() => updateStatus.mutateAsync({ id: po.id, status: 'received' })}
                  >
                    Force Close / Complete Order
                  </Button>
                )}

                {/* Cancel Order */}
                <Button
                  variant="outline" size="sm"
                  className="text-destructive hover:text-destructive"
                  disabled={updateStatus.isPending}
                  onClick={() => updateStatus.mutateAsync({ id: po.id, status: 'cancelled' })}
                >
                  Cancel Order
                </Button>

                {po.status === 'sent' && (
                  <span className="text-xs text-muted-foreground ml-2">
                    (Order sent to supplier. Draft status is disabled once sent.)
                  </span>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </RoleGuard>

      {/* Receive Items — all roles */}
      {canReceive && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle className="size-4" />Receive Items</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onReceive)} className="space-y-4">
              <div>
                <Label>Receiving Warehouse *</Label>
                <Controller
                  name="warehouse_id" control={control}
                  rules={{ required: 'Warehouse is required' }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full max-w-xs mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {warehouses.map(w => <SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                <p className="text-xs text-muted-foreground mt-1">Pre-filled with the order's designated warehouse.</p>
              </div>
              <div className="space-y-3">
                {fields.map((field, index) => {
                  const poItem = po.items?.[index]
                  const remaining = (poItem?.quantity_ordered ?? 0) - (poItem?.quantity_received ?? 0)
                  return (
                    <div key={field.id} className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{poItem?.product?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Ordered: {poItem?.quantity_ordered} | Received: {poItem?.quantity_received} | <span className="font-semibold text-amber-600 dark:text-amber-400">Remaining: {remaining}</span>
                        </p>
                      </div>
                      <div className="w-28">
                        <Input
                          type="number"
                          {...register(`items.${index}.quantity_received`, {
                            min: { value: 0, message: 'Min 0' },
                            max: { value: remaining, message: `Max ${remaining}` },
                          })}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={receive.isPending}>
                  <CheckCircle className="size-4 mr-2" />
                  {receive.isPending ? 'Processing...' : 'Receive Items into Stock'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
