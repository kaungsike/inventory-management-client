import { useParams } from 'react-router-dom'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
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

interface ReceiveFormData {
  warehouse_id: string
  items: { id: number; quantity_received: string; max: number }[]
}

export default function PurchaseOrderDetailPage() {
  const { id } = useParams()
  const { data: po, isLoading } = usePurchaseOrder(id ? Number(id) : null)
  const { receive, updateStatus } = usePurchaseOrderMutation()
  const { data: warehouses = [] } = useAllWarehouses()

  const { register, handleSubmit, control } = useForm<ReceiveFormData>({
    values: {
      warehouse_id: String(warehouses[0]?.id ?? 1),
      items: po?.items?.map(item => ({
        id: item.id,
        quantity_received: '0',
        max: item.quantity_ordered - item.quantity_received,
      })) ?? [],
    },
  })
  const { fields } = useFieldArray({ control, name: 'items' })

  if (isLoading) return <LoadingSpinner className="min-h-[400px]" />
  if (!po) return <div>Purchase order not found</div>

  const canReceive = ['draft', 'sent', 'partial'].includes(po.status)

  const onReceive = async (data: ReceiveFormData) => {
    await receive.mutateAsync({
      id: po.id,
      items: data.items.map(item => ({
        id: item.id,
        quantity_received: Number(item.quantity_received),
      })),
    })
  }

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
          <div><p className="text-muted-foreground">Supplier</p><p className="font-medium">{po.supplier?.name}</p></div>
          <div><p className="text-muted-foreground">Order Date</p><p className="font-medium">{formatDate(po.order_date)}</p></div>
          <div><p className="text-muted-foreground">Expected</p><p className="font-medium">{formatDate(po.expected_date)}</p></div>
          <div><p className="text-muted-foreground">Total Amount</p><p className="font-bold">{formatCurrency(po.total_amount)}</p></div>
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
                  <th className="text-right py-2 font-medium text-muted-foreground">Unit Cost</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {po.items?.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2">
                      <p>{item.product?.name ?? '—'}</p>
                      <p className="text-xs text-muted-foreground font-mono">{item.product?.sku}</p>
                    </td>
                    <td className="text-right py-2">{item.quantity_ordered}</td>
                    <td className="text-right py-2">{item.quantity_received}</td>
                    <td className="text-right py-2">{formatCurrency(item.unit_cost)}</td>
                    <td className="text-right py-2">{formatCurrency(item.total_cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Separator className="my-3" />
          <div className="flex justify-end">
            <p className="font-bold">Total: {formatCurrency(po.total_amount)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Status Update */}
      <Card>
        <CardHeader><CardTitle>Update Status</CardTitle></CardHeader>
        <CardContent className="flex gap-2">
          {['draft', 'sent', 'cancelled'].map(s => (
            <Button key={s} variant="outline" size="sm" disabled={po.status === s || updateStatus.isPending}
              onClick={() => updateStatus.mutateAsync({ id: po.id, status: s })}>
              Mark {s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Receive Items */}
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
              </div>
              <div className="space-y-3">
                {fields.map((field, index) => {
                  const poItem = po.items?.[index]
                  const remaining = (poItem?.quantity_ordered ?? 0) - (poItem?.quantity_received ?? 0)
                  return (
                    <div key={field.id} className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{poItem?.product?.name}</p>
                        <p className="text-xs text-muted-foreground">Remaining: {remaining}</p>
                      </div>
                      <div className="w-24">
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
                  {receive.isPending ? 'Processing...' : 'Receive Items'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
