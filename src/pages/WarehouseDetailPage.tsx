import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRightLeft, PackageX, Boxes, UserRoundCog, ArchiveRestore } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { useWarehouseDetail, useActiveManagers, useWarehouseMutation } from '@/hooks/useWarehouses'
import { useInventory, useInventoryAdjust, useInventoryTransfer } from '@/hooks/useInventory'
import { useTransactions } from '@/hooks/useTransactions'
import { usePurchaseOrders } from '@/hooks/usePurchaseOrders'
import { useSalesOrders } from '@/hooks/useSalesOrders'
import { useAuth } from '@/hooks/useAuth'
import { useQueryClient } from '@tanstack/react-query'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { DataTable, TablePagination } from '@/components/common/DataTable'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { WriteOffDialog } from '@/components/inventory/WriteOffDialog'
import { WarehouseSelect } from '@/components/forms/WarehouseSelect'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { RoleGuard } from '@/components/auth/RoleGuard'
import { formatCurrency, formatDateTime, formatDate } from '@/lib/utils'
import type { Inventory, InventoryTransaction, PurchaseOrder, SalesOrder } from '@/lib/types'

type Tab = 'overview' | 'inventory' | 'transactions' | 'purchase-orders' | 'sales-orders' | 'transfers'

const TABS: { value: Tab; label: string }[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'transactions', label: 'Transactions' },
  { value: 'purchase-orders', label: 'Purchase Orders' },
  { value: 'sales-orders', label: 'Sales Orders' },
  { value: 'transfers', label: 'Transfers' },
]

interface AdjustFormData { quantity: string; reason: string }
interface TransferFormData { product_id: string; to_warehouse_id: string; quantity: string; notes?: string }

export default function WarehouseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const warehouseId = Number(id)
  const queryClient = useQueryClient()

  const [tab, setTab] = useState<Tab>('overview')
  const [inventoryPage, setInventoryPage] = useState(1)
  const [txPage, setTxPage] = useState(1)
  const [poPage, setPoPage] = useState(1)
  const [soPage, setSoPage] = useState(1)
  const [transferPage, setTransferPage] = useState(1)

  const [adjustTarget, setAdjustTarget] = useState<Inventory | null>(null)
  const [writeOffTarget, setWriteOffTarget] = useState<Inventory | null>(null)
  const [showTransfer, setShowTransfer] = useState(false)
  const [assignManagerId, setAssignManagerId] = useState('')
  const [savingManager, setSavingManager] = useState(false)

  const { isAdmin } = useAuth()
  const managers = useActiveManagers(isAdmin)
  const managerItems = Object.fromEntries(managers.map((m) => [String(m.id), m.name]))

  const { data: detail, isLoading, isError } = useWarehouseDetail(warehouseId)
  const { update, restore } = useWarehouseMutation()
  const adjust = useInventoryAdjust()
  const transfer = useInventoryTransfer()

  const { data: inventoryData, isLoading: inventoryLoading } = useInventory(
    tab === 'inventory' ? { warehouse_id: warehouseId, page: inventoryPage } : { warehouse_id: warehouseId },
  )
  const { data: txData, isLoading: txLoading } = useTransactions(
    tab === 'transactions' ? { warehouse_id: warehouseId, page: txPage } : { warehouse_id: warehouseId, per_page: 1 },
  )
  const { data: poData, isLoading: poLoading } = usePurchaseOrders(
    tab === 'purchase-orders' ? { warehouse_id: warehouseId, page: poPage } : { warehouse_id: warehouseId, per_page: 1 },
  )
  const { data: soData, isLoading: soLoading } = useSalesOrders(
    tab === 'sales-orders' ? { warehouse_id: warehouseId, page: soPage } : { warehouse_id: warehouseId, per_page: 1 },
  )
  const { data: transferData, isLoading: transferLoading } = useTransactions(
    tab === 'transfers'
      ? { warehouse_id: warehouseId, type: 'transfer', page: transferPage }
      : { warehouse_id: warehouseId, type: 'transfer', per_page: 1 },
  )

  const adjustForm = useForm<AdjustFormData>({ defaultValues: { quantity: '', reason: '' } })
  const transferForm = useForm<TransferFormData>({ defaultValues: { product_id: '', to_warehouse_id: '', quantity: '', notes: '' } })

  useEffect(() => {
    if (detail) setAssignManagerId(detail.manager_id ? String(detail.manager_id) : '')
  }, [detail?.manager_id])

  if (isLoading) return <LoadingSpinner className="min-h-[300px]" />

  if (isError || !detail) {
    return (
      <div className="space-y-6">
        <Link to="/warehouses"><Button variant="outline" size="sm"><ArrowLeft className="size-4 mr-1" />Back to Warehouses</Button></Link>
        <EmptyState
          icon={Boxes}
          title="Warehouse not found or not accessible"
          description="The warehouse may be archived or you may not have permission to view it."
        />
      </div>
    )
  }

  const isArchived = !!detail.archived_at

  const selectedProduct = transferForm.watch('product_id')
  const selectedInv = detail.inventory.find((inv) => String(inv.id) === selectedProduct)
  const availableQty = selectedInv?.available_quantity ?? 0

  const onAdjust = async (d: AdjustFormData) => {
    if (!adjustTarget) return
    await adjust.mutateAsync({ id: adjustTarget.id, quantity: Number(d.quantity), reason: d.reason })
    queryClient.invalidateQueries({ queryKey: ['warehouses', warehouseId] })
    setAdjustTarget(null)
    adjustForm.reset()
  }

  const onTransfer = async (d: TransferFormData) => {
    const inventory = detail.inventory.find((inv) => String(inv.id) === d.product_id)
    await transfer.mutateAsync({
      product_id: inventory?.product_id ?? 0,
      from_warehouse_id: warehouseId,
      to_warehouse_id: Number(d.to_warehouse_id),
      quantity: Number(d.quantity),
      notes: d.notes || undefined,
    })
    queryClient.invalidateQueries({ queryKey: ['warehouses', warehouseId] })
    setShowTransfer(false)
    transferForm.reset()
  }

  const onAssignManager = async () => {
    setSavingManager(true)
    try {
      await update.mutateAsync({
        id: warehouseId,
        data: {
          name: detail.name,
          location: detail.location,
          description: detail.description ?? '',
          manager_name: detail.manager_name ?? '',
          phone: detail.phone ?? '',
          status: detail.status,
          manager_id: assignManagerId ? Number(assignManagerId) : null,
        },
      })
    } finally {
      setSavingManager(false)
    }
  }

  const inventoryColumns: ColumnDef<Inventory, unknown>[] = [
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
    { accessorKey: 'quantity', header: 'On Hand', cell: ({ row }) => row.original.quantity },
    { accessorKey: 'reserved_quantity', header: 'Reserved', cell: ({ row }) => row.original.reserved_quantity },
    { accessorKey: 'available_quantity', header: 'Available', cell: ({ row }) => row.original.available_quantity },
    { accessorKey: 'reorder_point', header: 'Reorder Point', cell: ({ row }) => row.original.reorder_point },
    {
      accessorKey: 'value',
      header: 'Value',
      cell: ({ row }) => formatCurrency(row.original.quantity * (row.original.product?.average_cost ?? 0)),
    },
    ...(!isArchived
      ? [{
          id: 'actions', header: 'Actions',
          cell: ({ row }: { row: { original: Inventory } }) => (
            <div className="flex gap-1">
              <RoleGuard roles={['admin', 'manager']}>
                <Button variant="outline" size="sm" onClick={() => {
                  setAdjustTarget(row.original)
                  adjustForm.reset({ quantity: String(row.original.quantity), reason: '' })
                }}>Adjust</Button>
              </RoleGuard>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setWriteOffTarget(row.original)}>
                <PackageX className="size-3 mr-1" />Write Off
              </Button>
            </div>
          ),
        } as ColumnDef<Inventory, unknown>]
      : []),
  ]

  const transactionColumns: ColumnDef<InventoryTransaction, unknown>[] = [
    { accessorKey: 'transaction_date', header: 'Date', cell: ({ row }) => formatDateTime(row.original.transaction_date) },
    { accessorKey: 'reference_number', header: 'Reference', cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.reference_number ?? '—'}</span>
    )},
    { accessorKey: 'product', header: 'Product', cell: ({ row }) => (
      <div>
        <p className="font-medium text-sm">{row.original.product_name ?? '—'}</p>
        <p className="text-xs text-muted-foreground font-mono">{row.original.product_sku ?? ''}</p>
      </div>
    )},
    { accessorKey: 'type', header: 'Type', cell: ({ row }) => <StatusBadge status={row.original.type} /> },
    { accessorKey: 'quantity', header: 'Qty', cell: ({ row }) => (
      <span className={row.original.quantity > 0 ? 'text-green-600' : 'text-destructive'}>
        {row.original.quantity > 0 ? '+' : ''}{row.original.quantity}
      </span>
    )},
    { accessorKey: 'unit_cost', header: 'Unit Cost', cell: ({ row }) => row.original.unit_cost ? formatCurrency(row.original.unit_cost) : '—' },
  ]

  const poColumns: ColumnDef<PurchaseOrder, unknown>[] = [
    { accessorKey: 'po_number', header: 'PO Number', cell: ({ row }) => <span className="font-mono text-xs">{row.original.po_number}</span> },
    { accessorKey: 'supplier', header: 'Supplier', cell: ({ row }) => row.original.supplier?.name ?? '—' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'order_date', header: 'Order Date', cell: ({ row }) => formatDate(row.original.order_date) },
    { accessorKey: 'items_count', header: 'Items', cell: ({ row }) => row.original.items_count ?? row.original.items?.length ?? 0 },
    { accessorKey: 'total_amount', header: 'Total', cell: ({ row }) => formatCurrency(row.original.total_amount) },
  ]

  const soColumns: ColumnDef<SalesOrder, unknown>[] = [
    { accessorKey: 'so_number', header: 'SO Number', cell: ({ row }) => <span className="font-mono text-xs">{row.original.so_number}</span> },
    { accessorKey: 'customer', header: 'Customer', cell: ({ row }) => row.original.customer?.name ?? '—' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'order_date', header: 'Order Date', cell: ({ row }) => formatDate(row.original.order_date) },
    { accessorKey: 'items_count', header: 'Items', cell: ({ row }) => row.original.items_count ?? row.original.items?.length ?? 0 },
    { accessorKey: 'total_amount', header: 'Total', cell: ({ row }) => formatCurrency(row.original.total_amount) },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/warehouses">
          <Button variant="ghost" size="sm"><ArrowLeft className="size-4 mr-1" />Back</Button>
        </Link>
        <PageHeader
          title={detail.name}
          description={`${detail.location} · ${detail.manager?.name ?? 'Unassigned manager'}`}
          action={
            <div className="flex items-center gap-2">
              {isArchived ? (
                <RoleGuard roles={['admin']}>
                  <Button onClick={() => restore.mutateAsync(warehouseId)}>
                    <ArchiveRestore className="size-4 mr-2" />Restore Warehouse
                  </Button>
                </RoleGuard>
              ) : (
                <RoleGuard roles={['admin', 'manager']}>
                  <Button onClick={() => setShowTransfer(true)}>
                    <ArrowRightLeft className="size-4 mr-2" />Transfer Stock
                  </Button>
                </RoleGuard>
              )}
            </div>
          }
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-3 py-2 text-sm rounded-t-lg border-b-2 transition-colors ${
              tab === t.value ? 'border-primary text-foreground font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground">Product Types</p>
                <p className="text-2xl font-semibold mt-1">{detail.total_products}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground">Total Units</p>
                <p className="text-2xl font-semibold mt-1">{detail.total_units}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground">Reserved Units</p>
                <p className="text-2xl font-semibold mt-1">{detail.reserved_units}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground">Available Units</p>
                <p className="text-2xl font-semibold mt-1">{detail.available_units}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground">Inventory Value</p>
                <p className="text-2xl font-semibold mt-1">{formatCurrency(detail.inventory_value)}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Warehouse Details</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><StatusBadge status={isArchived ? 'archived' : detail.status} /></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span>{detail.location}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{detail.phone ?? '—'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Contact Name</span><span>{detail.manager_name ?? '—'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Created</span><span>{formatDate(detail.created_at)}</span></div>
                {detail.description && <p className="text-muted-foreground">{detail.description}</p>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <UserRoundCog className="size-4 text-muted-foreground" />
                <CardTitle>Manager Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isAdmin ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Current: <span className="font-medium text-foreground">{detail.manager?.name ?? 'Unassigned'}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <Select value={assignManagerId} onValueChange={(v) => setAssignManagerId(v ?? '')} items={managerItems}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a manager" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Unassigned</SelectItem>
                          {managers.map((m) => (
                            <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={onAssignManager} disabled={savingManager}>
                        {savingManager ? 'Saving...' : 'Assign'}
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Assigned Manager: </span>
                    <span className="font-medium">{detail.manager?.name ?? 'Unassigned'}</span>
                  </p>
                )}
                {isArchived && (
                  <p className="text-xs text-muted-foreground">This warehouse is archived. Restore it to resume operations.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Inventory tab */}
      {tab === 'inventory' && (
        <>
          {inventoryLoading ? <LoadingSpinner className="min-h-[200px]" /> :
            !inventoryData?.data?.length ? <EmptyState icon={Boxes} title="No stock in this warehouse" /> : (
              <>
                <DataTable data={inventoryData.data} columns={inventoryColumns} />
                {inventoryData.meta && <TablePagination currentPage={inventoryData.meta.current_page} lastPage={inventoryData.meta.last_page} total={inventoryData.meta.total} onPageChange={setInventoryPage} />}
              </>
            )}
        </>
      )}

      {/* Transactions tab */}
      {tab === 'transactions' && (
        <>
          {txLoading ? <LoadingSpinner className="min-h-[200px]" /> :
            !txData?.data?.length ? <EmptyState icon={Boxes} title="No transactions for this warehouse" /> : (
              <>
                <DataTable data={txData.data} columns={transactionColumns} />
                {txData.meta && <TablePagination currentPage={txData.meta.current_page} lastPage={txData.meta.last_page} total={txData.meta.total} onPageChange={setTxPage} />}
              </>
            )}
        </>
      )}

      {/* Purchase Orders tab */}
      {tab === 'purchase-orders' && (
        <>
          {poLoading ? <LoadingSpinner className="min-h-[200px]" /> :
            !poData?.data?.length ? <EmptyState icon={Boxes} title="No purchase orders for this warehouse" /> : (
              <>
                <DataTable data={poData.data} columns={poColumns} />
                {poData.meta && <TablePagination currentPage={poData.meta.current_page} lastPage={poData.meta.last_page} total={poData.meta.total} onPageChange={setPoPage} />}
              </>
            )}
        </>
      )}

      {/* Sales Orders tab */}
      {tab === 'sales-orders' && (
        <>
          {soLoading ? <LoadingSpinner className="min-h-[200px]" /> :
            !soData?.data?.length ? <EmptyState icon={Boxes} title="No sales orders for this warehouse" /> : (
              <>
                <DataTable data={soData.data} columns={soColumns} />
                {soData.meta && <TablePagination currentPage={soData.meta.current_page} lastPage={soData.meta.last_page} total={soData.meta.total} onPageChange={setSoPage} />}
              </>
            )}
        </>
      )}

      {/* Transfers tab */}
      {tab === 'transfers' && (
        <>
          {transferLoading ? <LoadingSpinner className="min-h-[200px]" /> :
            !transferData?.data?.length ? <EmptyState icon={Boxes} title="No transfers involving this warehouse" /> : (
              <>
                <DataTable data={transferData.data} columns={transactionColumns} />
                {transferData.meta && <TablePagination currentPage={transferData.meta.current_page} lastPage={transferData.meta.last_page} total={transferData.meta.total} onPageChange={setTransferPage} />}
              </>
            )}
        </>
      )}

      {/* Adjust Modal */}
      {adjustTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setAdjustTarget(null)} />
          <div className="relative bg-card border border-border rounded-xl shadow-lg p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold mb-1">Adjust Stock</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {adjustTarget.product?.name} @ {detail.name}
            </p>
            <form onSubmit={adjustForm.handleSubmit(onAdjust)} className="space-y-4">
              <div>
                <Label>New Quantity *</Label>
                <Input
                  type="number"
                  {...adjustForm.register('quantity', { required: 'Quantity is required', min: { value: 0, message: 'Min 0' } })}
                  className="mt-1"
                />
                {adjustForm.formState.errors.quantity && <p className="text-xs text-destructive mt-1">{adjustForm.formState.errors.quantity.message}</p>}
              </div>
              <div>
                <Label>Reason *</Label>
                <Input
                  {...adjustForm.register('reason', { required: 'Reason is required' })}
                  placeholder="e.g. Physical count correction"
                  className="mt-1"
                />
                {adjustForm.formState.errors.reason && <p className="text-xs text-destructive mt-1">{adjustForm.formState.errors.reason.message}</p>}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setAdjustTarget(null)}>Cancel</Button>
                <Button type="submit" disabled={adjust.isPending}>{adjust.isPending ? 'Saving...' : 'Adjust'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Write Off Modal */}
      {writeOffTarget && (
        <WriteOffDialog
          inventory={writeOffTarget}
          onClose={() => {
            setWriteOffTarget(null)
            queryClient.invalidateQueries({ queryKey: ['warehouses', warehouseId] })
          }}
        />
      )}

      {/* Transfer Modal */}
      {showTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowTransfer(false)} />
          <div className="relative bg-card border border-border rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold mb-1">Transfer Stock Out</h2>
            <p className="text-sm text-muted-foreground mb-4">From {detail.name}</p>
            <form onSubmit={transferForm.handleSubmit(onTransfer)} className="space-y-4">
              <div>
                <Label>Product *</Label>
                <Controller
                  name="product_id"
                  control={transferForm.control}
                  rules={{ required: 'Product is required' }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={(v) => field.onChange(v ?? '')} items={{}}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {detail.inventory.filter((inv) => inv.quantity > 0).map((inv) => (
                          <SelectItem key={inv.id} value={String(inv.id)}>
                            {inv.product?.name} (available: {inv.available_quantity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {transferForm.formState.errors.product_id && <p className="text-xs text-destructive mt-1">{transferForm.formState.errors.product_id.message}</p>}
              </div>
              <div>
                <Label>To Warehouse *</Label>
                <Controller
                  name="to_warehouse_id"
                  control={transferForm.control}
                  rules={{ required: 'Destination warehouse is required' }}
                  render={({ field }) => (
                    <div className="mt-1">
                      <WarehouseSelect value={field.value} onChange={field.onChange} excludeId={warehouseId} placeholder="Select destination" />
                    </div>
                  )}
                />
                {transferForm.formState.errors.to_warehouse_id && <p className="text-xs text-destructive mt-1">{transferForm.formState.errors.to_warehouse_id.message}</p>}
              </div>
              <div>
                <Label>Quantity *</Label>
                <Input
                  type="number"
                  {...transferForm.register('quantity', {
                    required: 'Quantity is required',
                    min: { value: 1, message: 'Minimum 1' },
                    max: availableQty > 0 ? { value: availableQty, message: `Max available: ${availableQty}` } : undefined,
                  })}
                  className="mt-1"
                />
                {transferForm.formState.errors.quantity && <p className="text-xs text-destructive mt-1">{transferForm.formState.errors.quantity.message}</p>}
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea {...transferForm.register('notes')} placeholder="Optional transfer notes..." className="mt-1" rows={2} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowTransfer(false)}>Cancel</Button>
                <Button type="submit" disabled={transfer.isPending}>{transfer.isPending ? 'Transferring...' : 'Transfer'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}