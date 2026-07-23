import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ArrowLeftRight, Archive } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router-dom'
import { useInventory, useInventoryAdjust } from '@/hooks/useInventory'
import { useAllWarehouses } from '@/hooks/useWarehouses'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable, TablePagination } from '@/components/common/DataTable'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { calculateStockStatus } from '@/lib/utils'
import type { Inventory } from '@/lib/types'

function StockBadge({ qty, reorderPoint }: { qty: number; reorderPoint: number }) {
  const status = calculateStockStatus(qty, reorderPoint)
  const variants = { critical: 'destructive' as const, low: 'secondary' as const, normal: 'default' as const, overstock: 'outline' as const }
  return <Badge variant={variants[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
}

interface AdjustFormData { quantity: string; reason: string }

export default function InventoryPage() {
  const [warehouseId, setWarehouseId] = useState('')
  const [stockFilter, setStockFilter] = useState('')
  const [page, setPage] = useState(1)
  const [adjustTarget, setAdjustTarget] = useState<Inventory | null>(null)

  const { data, isLoading } = useInventory({
    warehouse_id: warehouseId ? Number(warehouseId) : undefined,
    low_stock: stockFilter === 'low',
    page,
  })
  const { data: warehouses = [] } = useAllWarehouses()
  const adjust = useInventoryAdjust()

  const { register, handleSubmit, formState: { errors }, reset } = useForm<AdjustFormData>({
    defaultValues: { quantity: '', reason: '' }
  })

  const onAdjust = async (formData: AdjustFormData) => {
    if (!adjustTarget) return
    await adjust.mutateAsync({ id: adjustTarget.id, quantity: Number(formData.quantity), reason: formData.reason })
    setAdjustTarget(null)
    reset()
  }

  const columns: ColumnDef<Inventory, unknown>[] = [
    {
      accessorKey: 'product',
      header: 'Product',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.product?.name ?? '—'}</p>
          <p className="text-xs text-muted-foreground font-mono">{row.original.product?.sku}</p>
        </div>
      ),
    },
    { accessorKey: 'warehouse', header: 'Warehouse', cell: ({ row }) => row.original.warehouse?.name ?? '—' },
    { accessorKey: 'quantity', header: 'On Hand', cell: ({ row }) => row.original.quantity },
    { accessorKey: 'reserved_quantity', header: 'Reserved', cell: ({ row }) => row.original.reserved_quantity },
    { accessorKey: 'available_quantity', header: 'Available', cell: ({ row }) => row.original.available_quantity },
    { accessorKey: 'reorder_point', header: 'Reorder Point', cell: ({ row }) => row.original.reorder_point },
    {
      id: 'stock_status', header: 'Status',
      cell: ({ row }) => <StockBadge qty={row.original.quantity} reorderPoint={row.original.reorder_point} />,
    },
    {
      id: 'actions', header: 'Actions',
      cell: ({ row }) => (
        <Button variant="outline" size="sm" onClick={() => {
          setAdjustTarget(row.original)
          reset({ quantity: String(row.original.quantity), reason: '' })
        }}>
          Adjust
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Track stock levels across warehouses"
        action={
          <Link to="/inventory/transfer">
            <Button variant="outline"><ArrowLeftRight className="size-4 mr-2" />Transfer Stock</Button>
          </Link>
        }
      />

      {/* Adjust Modal */}
      {adjustTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setAdjustTarget(null)} />
          <div className="relative bg-card border border-border rounded-xl shadow-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold mb-1">Adjust Stock</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {adjustTarget.product?.name} @ {adjustTarget.warehouse?.name}
            </p>
            <form onSubmit={handleSubmit(onAdjust)} className="space-y-4">
              <div>
                <Label>New Quantity *</Label>
                <Input
                  type="number"
                  {...register('quantity', { required: 'Quantity is required', min: { value: 0, message: 'Min 0' } })}
                  className="mt-1"
                />
                {errors.quantity && <p className="text-xs text-destructive mt-1">{errors.quantity.message}</p>}
              </div>
              <div>
                <Label>Reason *</Label>
                <Input
                  {...register('reason', { required: 'Reason is required' })}
                  placeholder="e.g. Physical count correction"
                  className="mt-1"
                />
                {errors.reason && <p className="text-xs text-destructive mt-1">{errors.reason.message}</p>}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setAdjustTarget(null)}>Cancel</Button>
                <Button type="submit" disabled={adjust.isPending}>{adjust.isPending ? 'Saving...' : 'Adjust'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={warehouseId} onValueChange={(v) => { setWarehouseId(v ?? ''); setPage(1) }}>
          <SelectTrigger className="w-48"><SelectValue placeholder="All Warehouses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Warehouses</SelectItem>
            {warehouses.map((w) => <SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={stockFilter} onValueChange={(v) => { setStockFilter(v ?? ''); setPage(1) }}>
          <SelectTrigger className="w-40"><SelectValue placeholder="All Stock" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Stock</SelectItem>
            <SelectItem value="low">Low Stock Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? <LoadingSpinner className="min-h-[200px]" /> :
        !data?.data?.length ? <EmptyState icon={Archive} title="No inventory records found" /> : (
          <>
            <DataTable data={data.data} columns={columns} />
            {data.meta && <TablePagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} total={data.meta.total} onPageChange={setPage} />}
          </>
        )}
    </div>
  )
}
