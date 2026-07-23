import { useNavigate } from 'react-router-dom'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePurchaseOrderMutation } from '@/hooks/usePurchaseOrders'
import { useAllSuppliers } from '@/hooks/useSuppliers'
import { useAllWarehouses } from '@/hooks/useWarehouses'
import { useProducts } from '@/hooks/useProducts'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'

interface LineItem { product_id: string; quantity_ordered: string; unit_cost: string }
interface POFormData {
  supplier_id: string; warehouse_id: string
  order_date: string; expected_date: string; notes: string
  items: LineItem[]
}

export default function PurchaseOrderFormPage() {
  const navigate = useNavigate()
  const { create } = usePurchaseOrderMutation()
  const { data: suppliers = [] } = useAllSuppliers()
  const { data: warehouses = [] } = useAllWarehouses()
  const { data: productsData } = useProducts({ per_page: 100 })
  const products = productsData?.data ?? []

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<POFormData>({
    defaultValues: {
      supplier_id: '', warehouse_id: '1', order_date: new Date().toISOString().split('T')[0],
      expected_date: '', notes: '',
      items: [{ product_id: '', quantity_ordered: '1', unit_cost: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })
  const watchedItems = watch('items')

  const orderTotal = watchedItems.reduce((sum, item) => {
    return sum + (Number(item.quantity_ordered) || 0) * (Number(item.unit_cost) || 0)
  }, 0)

  const onSubmit = async (data: POFormData) => {
    await create.mutateAsync({
      supplier_id: Number(data.supplier_id),
      order_date: data.order_date,
      expected_date: data.expected_date || null,
      notes: data.notes || null,
      items: data.items.map(item => ({
        product_id: Number(item.product_id),
        quantity_ordered: Number(item.quantity_ordered),
        unit_cost: Number(item.unit_cost),
      })),
    })
    navigate('/purchase-orders')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link to="/purchase-orders"><Button variant="ghost" size="sm"><ArrowLeft className="size-4 mr-1" />Back</Button></Link>
        <PageHeader title="New Purchase Order" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader><CardTitle>Order Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Supplier *</Label>
              <Controller
                name="supplier_id" control={control}
                rules={{ required: 'Supplier is required' }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full mt-1"><SelectValue placeholder="Select supplier" /></SelectTrigger>
                    <SelectContent>
                      {suppliers.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.supplier_id && <p className="text-xs text-destructive mt-1">{errors.supplier_id.message}</p>}
            </div>

            <div>
              <Label>Receiving Warehouse *</Label>
              <Controller
                name="warehouse_id" control={control}
                rules={{ required: 'Warehouse is required' }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full mt-1"><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                    <SelectContent>
                      {warehouses.map(w => <SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.warehouse_id && <p className="text-xs text-destructive mt-1">{errors.warehouse_id.message}</p>}
            </div>

            <div>
              <Label>Order Date *</Label>
              <Input type="date" {...register('order_date', { required: 'Order date is required' })} className="mt-1" />
              {errors.order_date && <p className="text-xs text-destructive mt-1">{errors.order_date.message}</p>}
            </div>

            <div>
              <Label>Expected Date</Label>
              <Input type="date" {...register('expected_date')} className="mt-1" />
            </div>

            <div className="sm:col-span-2">
              <Label>Notes</Label>
              <Textarea {...register('notes')} className="mt-1" rows={2} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Line Items</CardTitle>
              <Button type="button" variant="outline" size="sm"
                onClick={() => append({ product_id: '', quantity_ordered: '1', unit_cost: '' })}>
                <Plus className="size-3 mr-1" />Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {fields.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No items. Add at least one product.</p>
            )}
            {fields.map((field, index) => {
              const qty = Number(watchedItems[index]?.quantity_ordered) || 0
              const cost = Number(watchedItems[index]?.unit_cost) || 0
              return (
                <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-5">
                    {index === 0 && <Label className="text-xs">Product *</Label>}
                    <Controller
                      name={`items.${index}.product_id`}
                      control={control}
                      rules={{ required: 'Product required' }}
                      render={({ field: f }) => (
                        <Select value={f.value} onValueChange={f.onChange}>
                          <SelectTrigger className="w-full mt-1"><SelectValue placeholder="Select product" /></SelectTrigger>
                          <SelectContent>
                            {products.map(p => (
                              <SelectItem key={p.id} value={String(p.id)}>{p.sku} — {p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.items?.[index]?.product_id && (
                      <p className="text-xs text-destructive">{errors.items[index]?.product_id?.message}</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    {index === 0 && <Label className="text-xs">Qty *</Label>}
                    <Input
                      type="number"
                      {...register(`items.${index}.quantity_ordered`, { required: 'Required', min: { value: 1, message: 'Min 1' } })}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-3">
                    {index === 0 && <Label className="text-xs">Unit Cost *</Label>}
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.unit_cost`, { required: 'Required', min: { value: 0.01, message: 'Min 0.01' } })}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-1 flex items-end">
                    <p className="text-xs text-muted-foreground pb-2">{formatCurrency(qty * cost)}</p>
                  </div>
                  <div className="col-span-1 flex items-end pb-1">
                    <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}
                      disabled={fields.length === 1} className="text-destructive p-1">
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>
              )
            })}
            <Separator />
            <div className="flex justify-end">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Order Total</p>
                <p className="text-xl font-bold">{formatCurrency(orderTotal)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Link to="/purchase-orders"><Button type="button" variant="outline">Cancel</Button></Link>
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? 'Creating...' : 'Create Purchase Order'}
          </Button>
        </div>
      </form>
    </div>
  )
}
