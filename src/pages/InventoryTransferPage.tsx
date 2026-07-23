import { useForm, Controller } from 'react-hook-form'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useInventoryTransfer } from '@/hooks/useInventory'
import { useInventory } from '@/hooks/useInventory'
import { PageHeader } from '@/components/common/PageHeader'
import { WarehouseSelect } from '@/components/forms/WarehouseSelect'
import { ProductCombobox } from '@/components/forms/ProductCombobox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TransferFormData {
  product_id: string
  from_warehouse_id: string
  to_warehouse_id: string
  quantity: string
  notes: string
}

export default function InventoryTransferPage() {
  const navigate = useNavigate()
  const transfer = useInventoryTransfer()

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<TransferFormData>({
    defaultValues: { product_id: '', from_warehouse_id: '', to_warehouse_id: '', quantity: '', notes: '' },
  })

  const [productId, fromWarehouseId] = watch(['product_id', 'from_warehouse_id'])

  const { data: inventoryData } = useInventory({
    product_id: productId ? Number(productId) : undefined,
    warehouse_id: fromWarehouseId ? Number(fromWarehouseId) : undefined,
  })
  const currentInventory = inventoryData?.data?.[0]
  const availableQty = currentInventory?.available_quantity ?? 0

  const onSubmit = async (data: TransferFormData) => {
    await transfer.mutateAsync({
      product_id: Number(data.product_id),
      from_warehouse_id: Number(data.from_warehouse_id),
      to_warehouse_id: Number(data.to_warehouse_id),
      quantity: Number(data.quantity),
      notes: data.notes || undefined,
    })
    navigate('/inventory')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link to="/inventory">
          <Button variant="ghost" size="sm"><ArrowLeft className="size-4 mr-1" />Back</Button>
        </Link>
        <PageHeader title="Transfer Stock" description="Move inventory between warehouses" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader><CardTitle>Transfer Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Product *</Label>
              <Controller
                name="product_id"
                control={control}
                rules={{ required: 'Product is required' }}
                render={({ field }) => (
                  <div className="mt-1">
                    <ProductCombobox value={field.value} onChange={field.onChange} />
                  </div>
                )}
              />
              {errors.product_id && <p className="text-xs text-destructive mt-1">{errors.product_id.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>From Warehouse *</Label>
                <Controller
                  name="from_warehouse_id"
                  control={control}
                  rules={{ required: 'Source warehouse is required' }}
                  render={({ field }) => (
                    <div className="mt-1">
                      <WarehouseSelect value={field.value} onChange={field.onChange} placeholder="Select source" />
                    </div>
                  )}
                />
                {errors.from_warehouse_id && <p className="text-xs text-destructive mt-1">{errors.from_warehouse_id.message}</p>}
                {currentInventory && (
                  <p className="text-xs text-muted-foreground mt-1">Available: {availableQty} {currentInventory.product?.unit}</p>
                )}
              </div>

              <div>
                <Label>To Warehouse *</Label>
                <Controller
                  name="to_warehouse_id"
                  control={control}
                  rules={{
                    required: 'Destination warehouse is required',
                    validate: (v) => v !== fromWarehouseId || 'Must be different from source warehouse',
                  }}
                  render={({ field }) => (
                    <div className="mt-1">
                      <WarehouseSelect
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select destination"
                        excludeId={fromWarehouseId ? Number(fromWarehouseId) : undefined}
                      />
                    </div>
                  )}
                />
                {errors.to_warehouse_id && <p className="text-xs text-destructive mt-1">{errors.to_warehouse_id.message}</p>}
              </div>
            </div>

            <div>
              <Label>Quantity *</Label>
              <Input
                type="number"
                {...register('quantity', {
                  required: 'Quantity is required',
                  min: { value: 1, message: 'Minimum 1' },
                  max: availableQty > 0 ? { value: availableQty, message: `Max available: ${availableQty}` } : undefined,
                  validate: (v) => Number(v) > 0 || 'Must be greater than 0',
                })}
                className="mt-1"
              />
              {errors.quantity && <p className="text-xs text-destructive mt-1">{errors.quantity.message}</p>}
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea {...register('notes')} placeholder="Optional transfer notes..." className="mt-1" rows={3} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 mt-4">
          <Link to="/inventory">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={transfer.isPending}>
            {transfer.isPending ? 'Transferring...' : (
              <><ArrowRight className="size-4 mr-2" />Transfer Stock</>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
