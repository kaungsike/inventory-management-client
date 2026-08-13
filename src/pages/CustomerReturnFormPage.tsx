import { useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { useSalesOrders, useReturnableSalesOrder } from '@/hooks/useSalesOrders'
import { useCustomerReturn, useCustomerReturnMutation } from '@/hooks/useCustomerReturns'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'

interface ReturnFormData {
  sales_order_id: string
  return_date: string
  reason: string
  notes: string
  items: Record<string, string>
}

export default function CustomerReturnFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const editId = id ? Number(id) : null
  const isEdit = !!editId

  const { create, update } = useCustomerReturnMutation()
  const { data: editReturn, isLoading: returnLoading } = useCustomerReturn(editId)
  const { data: soData } = useSalesOrders({ status: 'shipped', per_page: 100 })
  const shippedOrders = soData?.data ?? []

  const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm<ReturnFormData>({
    defaultValues: {
      sales_order_id: '', return_date: new Date().toISOString().split('T')[0], reason: '', notes: '', items: {},
    },
  })

  const salesOrderId = watch('sales_order_id')
  const { data: returnable, isLoading: returnableLoading, error: returnableError, refetch } =
    useReturnableSalesOrder(salesOrderId ? Number(salesOrderId) : null)

  const items = returnable?.items ?? []
  const watchedItems = watch('items')

  useEffect(() => {
    if (isEdit && editReturn) {
      reset({
        sales_order_id: String(editReturn.sales_order_id),
        return_date: editReturn.return_date?.slice(0, 10) ?? new Date().toISOString().split('T')[0],
        reason: editReturn.reason ?? '',
        notes: editReturn.notes ?? '',
        items: {},
      })
    }
  }, [isEdit, editReturn, reset])

  useEffect(() => {
    if (!isEdit || !editReturn || !returnable) return
    setValue('items', {})
    for (const item of editReturn.items ?? []) {
      if (item.sales_order_item_id) {
        setValue(`items.${item.sales_order_item_id}`, String(item.quantity))
      }
    }
  }, [isEdit, editReturn, returnable, setValue])

  const setQty = (soiId: number, max: number) => (value: string) => {
    let num = Number(value)
    if (Number.isNaN(num) || num < 0) num = 0
    if (num > max) num = max
    setValue(`items.${soiId}`, String(num))
  }

  const returnableItems = items.filter((item) => item.returnable_quantity > 0)
  const hasSelection = returnableItems.some((item) => Number(watchedItems[item.id] ?? '0') > 0)
  const totalAmount = returnableItems.reduce((sum, item) =>
    sum + (Number(watchedItems[item.id] ?? '0') * (Number(item.unit_price) || 0)), 0)

  const onSubmit = async (data: ReturnFormData) => {
    const payloadItems = items
      .map((item) => ({ sales_order_item_id: item.id, quantity: Number(watchedItems[item.id] ?? '0') }))
      .filter((item) => item.quantity > 0)
    if (!payloadItems.length) return
    if (isEdit && editId) {
      await update.mutateAsync({
        id: editId,
        data: {
          return_date: data.return_date,
          reason: data.reason || null,
          notes: data.notes || null,
          items: payloadItems,
        },
      })
    } else {
      await create.mutateAsync({
        sales_order_id: Number(data.sales_order_id),
        return_date: data.return_date,
        reason: data.reason || null,
        notes: data.notes || null,
        items: payloadItems,
      })
    }
    navigate(isEdit ? `/customer-returns/${editId}` : '/customer-returns')
  }

  const errorMessage = (returnableError as { response?: { data?: { message?: string } } })?.response?.data?.message

  if (isEdit && (returnLoading || (editReturn && !salesOrderId))) {
    return <LoadingSpinner className="min-h-[400px]" />
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link to={isEdit ? `/customer-returns/${editId}` : '/customer-returns'}>
          <Button variant="ghost" size="sm"><ArrowLeft className="size-4 mr-1" />Back</Button>
        </Link>
        <PageHeader title={isEdit ? `Edit Return: ${editReturn?.return_number ?? ''}` : 'New Customer Return'} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader><CardTitle>Return Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label>Shipped Sales Order *</Label>
              <Controller
                name="sales_order_id" control={control}
                rules={{ required: 'A shipped sales order is required' }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(v) => { field.onChange(v); setValue('items', {}) }}>
                    <SelectTrigger className="w-full mt-1" disabled={isEdit}>
                      <SelectValue placeholder="Select shipped sales order" />
                    </SelectTrigger>
                    <SelectContent>
                      {shippedOrders.map((so) => (
                        <SelectItem key={so.id} value={String(so.id)}>
                          {so.so_number} — {so.customer?.name ?? `Customer #${so.customer_id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.sales_order_id && <p className="text-xs text-destructive mt-1">{errors.sales_order_id.message}</p>}
            </div>

            <div>
              <Label>Return Date *</Label>
              <Input type="date" {...register('return_date', { required: 'Return date is required' })} className="mt-1" />
              {errors.return_date && <p className="text-xs text-destructive mt-1">{errors.return_date.message}</p>}
            </div>

            <div>
              <Label>Reason</Label>
              <Input {...register('reason')} placeholder="e.g. Damaged on delivery, wrong item" className="mt-1" />
            </div>

            <div className="sm:col-span-2">
              <Label>Notes</Label>
              <Textarea {...register('notes')} className="mt-1" rows={2} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Return Items</CardTitle></CardHeader>
          <CardContent>
            {!salesOrderId ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                Select a shipped sales order to load its returnable items.
              </p>
            ) : returnableLoading ? (
              <LoadingSpinner className="min-h-[150px]" />
            ) : returnableError ? (
              <div className="space-y-2">
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive text-sm flex items-start gap-3">
                  <p>{errorMessage ?? 'Could not load returnable items for this order.'}</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => refetch()}>Retry</Button>
              </div>
            ) : items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                This sales order has no items eligible for return.
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left py-2 font-medium text-muted-foreground">Product</th>
                        <th className="text-right py-2 font-medium text-muted-foreground">Shipped</th>
                        <th className="text-right py-2 font-medium text-muted-foreground">Already Returned</th>
                        <th className="text-right py-2 font-medium text-muted-foreground">Returnable</th>
                        <th className="text-right py-2 font-medium text-muted-foreground">Unit Price</th>
                        <th className="text-right py-2 font-medium text-muted-foreground">Qty to Return</th>
                        <th className="text-right py-2 font-medium text-muted-foreground">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {items.map((item) => {
                        const qty = Number(watchedItems[item.id] ?? '0')
                        return (
                          <tr key={item.id} className={item.returnable_quantity === 0 ? 'opacity-50' : ''}>
                            <td className="py-2">
                              <p>{item.product_name}</p>
                              <p className="text-xs text-muted-foreground font-mono">{item.product_sku}</p>
                            </td>
                            <td className="text-right py-2">{item.quantity_shipped}</td>
                            <td className="text-right py-2 text-muted-foreground">{item.already_returned}</td>
                            <td className="text-right py-2 font-semibold">{item.returnable_quantity}</td>
                            <td className="text-right py-2">{formatCurrency(Number(item.unit_price) || 0)}</td>
                            <td className="text-right py-2">
                              <Input
                                type="number"
                                min={0}
                                max={item.returnable_quantity}
                                disabled={item.returnable_quantity === 0}
                                value={qty || ''}
                                onChange={(e) => setQty(item.id, item.returnable_quantity)(e.target.value)}
                                className="w-24 ml-auto text-right"
                              />
                            </td>
                            <td className="text-right py-2">{formatCurrency(qty * (Number(item.unit_price) || 0))}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-end">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Return Total</p>
                    <p className="text-xl font-bold">{formatCurrency(totalAmount)}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Link to={isEdit ? `/customer-returns/${editId}` : '/customer-returns'}>
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={create.isPending || update.isPending || !hasSelection}>
            {create.isPending || update.isPending ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Return Draft'}
          </Button>
        </div>
      </form>
    </div>
  )
}