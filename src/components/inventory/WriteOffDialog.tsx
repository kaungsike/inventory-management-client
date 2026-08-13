import { useForm } from 'react-hook-form'
import { AlertTriangle, CalendarClock } from 'lucide-react'
import { useInventoryWriteOff } from '@/hooks/useInventory'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Inventory } from '@/lib/types'

interface WriteOffFormData {
  type: 'damage' | 'expired'
  quantity: string
  reason: string
}

interface WriteOffDialogProps {
  inventory: Inventory
  onClose: () => void
}

export function WriteOffDialog({ inventory, onClose }: WriteOffDialogProps) {
  const writeOff = useInventoryWriteOff()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<WriteOffFormData>({
    defaultValues: { type: 'damage', quantity: '', reason: '' },
  })

  const selectedType = watch('type')
  const availableQty = inventory.available_quantity

  const onSubmit = async (data: WriteOffFormData) => {
    await writeOff.mutateAsync({
      id: inventory.id,
      type: data.type,
      quantity: Number(data.quantity),
      reason: data.reason,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl shadow-lg p-6 max-w-sm w-full mx-4">
        <h2 className="text-lg font-semibold mb-1">Write Off Stock</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {inventory.product?.name} @ {inventory.warehouse?.name} — Available: {availableQty}
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Write-off Type *</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <label
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors ${
                  selectedType === 'damage' ? 'border-destructive bg-destructive/10 text-destructive' : 'border-border'
                }`}
              >
                <input type="radio" value="damage" {...register('type')} className="sr-only" />
                <AlertTriangle className="size-4" /> Damage
              </label>
              <label
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors ${
                  selectedType === 'expired' ? 'border-destructive bg-destructive/10 text-destructive' : 'border-border'
                }`}
              >
                <input type="radio" value="expired" {...register('type')} className="sr-only" />
                <CalendarClock className="size-4" /> Expired
              </label>
            </div>
          </div>
          <div>
            <Label>Quantity *</Label>
            <Input
              type="number"
              {...register('quantity', {
                required: 'Quantity is required',
                min: { value: 1, message: 'Minimum 1' },
                max: { value: availableQty, message: `Max available: ${availableQty}` },
              })}
              className="mt-1"
            />
            {errors.quantity && <p className="text-xs text-destructive mt-1">{errors.quantity.message}</p>}
          </div>
          <div>
            <Label>Reason *</Label>
            <Textarea
              {...register('reason', {
                required: 'Reason is required',
                maxLength: { value: 500, message: 'Max 500 characters' },
              })}
              placeholder={`Why is this stock ${selectedType}?`}
              className="mt-1"
              rows={3}
            />
            {errors.reason && <p className="text-xs text-destructive mt-1">{errors.reason.message}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="destructive" disabled={writeOff.isPending}>
              {writeOff.isPending ? 'Writing off...' : `Write Off as ${selectedType === 'damage' ? 'Damage' : 'Expired'}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}