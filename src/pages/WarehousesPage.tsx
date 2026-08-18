import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Edit2, Archive, ArchiveRestore, Eye, X, Warehouse as WarehouseIcon } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { useWarehouses, useWarehouseDetail, useWarehouseMutation } from '@/hooks/useWarehouses'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { SearchInput } from '@/components/common/SearchInput'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { DataTable, TablePagination } from '@/components/common/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { RoleGuard } from '@/components/auth/RoleGuard'
import { STATUS_LABELS } from '@/lib/labels'
import { formatCurrency } from '@/lib/utils'
import type { Warehouse, Inventory } from '@/lib/types'

const WAREHOUSE_STATUS_ITEMS = {
  active: 'Active',
  inactive: 'Inactive',
  archived: 'Archived',
}

interface WarehouseFormData {
  name: string
  location: string
  description: string
  manager_name: string
  phone: string
  status: 'active' | 'inactive'
}

function WarehouseForm({ defaultValues, onSubmit, onCancel, loading, isEdit }: {
  defaultValues?: Partial<WarehouseFormData>
  onSubmit: (d: WarehouseFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
  isEdit?: boolean
}) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<WarehouseFormData>({
    defaultValues: {
      name: '', location: '', description: '',
      manager_name: '', phone: '', status: 'active',
      ...defaultValues,
    },
  })
  const status = watch('status')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label>Name *</Label>
        <Input {...register('name', { required: 'Name is required' })} className="mt-1" />
        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <Label>Location *</Label>
        <Input {...register('location', { required: 'Location is required' })} className="mt-1" />
        {errors.location && <p className="text-xs text-destructive mt-1">{errors.location.message}</p>}
      </div>
      <div>
        <Label>Manager Name</Label>
        <Input {...register('manager_name')} className="mt-1" />
      </div>
      <div>
        <Label>Phone</Label>
        <Input {...register('phone')} className="mt-1" />
      </div>
      <div>
        <Label>Status</Label>
        <Select value={status} onValueChange={(v) => setValue('status', v as 'active' | 'inactive')} items={STATUS_LABELS}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="sm:col-span-2">
        <Label>Description</Label>
        <Textarea {...register('description')} className="mt-1" rows={2} />
      </div>
      <div className="sm:col-span-2 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}

function InventoryDetailTable({ inventory }: { inventory: Inventory[] }) {
  const columns: ColumnDef<Inventory, unknown>[] = [
    {
      accessorKey: 'sku',
      header: 'SKU',
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.product?.sku ?? '—'}</span>,
    },
    {
      accessorKey: 'product',
      header: 'Product',
      cell: ({ row }) => row.original.product?.name ?? '—',
    },
    {
      accessorKey: 'quantity',
      header: 'Qty',
      cell: ({ row }) => row.original.quantity,
    },
    {
      accessorKey: 'reserved_quantity',
      header: 'Reserved',
      cell: ({ row }) => row.original.reserved_quantity,
    },
    {
      accessorKey: 'available_quantity',
      header: 'Available',
      cell: ({ row }) => row.original.available_quantity,
    },
    {
      accessorKey: 'average_cost',
      header: 'Avg Cost',
      cell: ({ row }) => formatCurrency(row.original.product?.average_cost),
    },
    {
      id: 'value',
      header: 'Value',
      cell: ({ row }) => formatCurrency(row.original.quantity * (row.original.product?.average_cost ?? 0)),
    },
  ]

  return <DataTable data={inventory} columns={columns} />
}

function WarehouseDetailCard({ warehouse, onClose }: { warehouse: Warehouse; onClose: () => void }) {
  const { data: detail, isLoading } = useWarehouseDetail(warehouse.id)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>{warehouse.name}</CardTitle>
            <StatusBadge status={warehouse.archived_at ? 'archived' : warehouse.status} />
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>
        <CardDescription>{warehouse.location}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingSpinner className="min-h-[120px]" />
        ) : detail ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Product Types</p>
                <p className="text-2xl font-semibold mt-1">{detail.total_products}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Total Units</p>
                <p className="text-2xl font-semibold mt-1">{detail.total_units}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">Inventory Value</p>
                <p className="text-2xl font-semibold mt-1">{formatCurrency(detail.inventory_value)}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">Current Inventory</h3>
              {detail.inventory.length ? (
                <InventoryDetailTable inventory={detail.inventory} />
              ) : (
                <p className="text-sm text-muted-foreground">No stock in this warehouse.</p>
              )}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

interface ArchiveBlockInfo {
  message: string
  total_quantity: number
  reserved_quantity: number
  available_quantity: number
}

export default function WarehousesPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null)
  const [viewTarget, setViewTarget] = useState<Warehouse | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [archiveTarget, setArchiveTarget] = useState<Warehouse | null>(null)
  const [restoreTarget, setRestoreTarget] = useState<Warehouse | null>(null)
  const [blockInfo, setBlockInfo] = useState<ArchiveBlockInfo | null>(null)

  const { data, isLoading } = useWarehouses({ search, status: status || undefined, page })
  const { create, update, archive, restore } = useWarehouseMutation()

  const handleArchive = async () => {
    if (!archiveTarget) return
    try {
      await archive.mutateAsync(archiveTarget.id)
    } catch (err) {
      const response = (err as { response?: { status?: number; data?: ArchiveBlockInfo } })?.response
      if (response?.status === 409 && response.data) {
        setBlockInfo({
          message: response.data.message,
          total_quantity: response.data.total_quantity,
          reserved_quantity: response.data.reserved_quantity,
          available_quantity: response.data.available_quantity,
        })
      }
    }
  }

  const columns: ColumnDef<Warehouse, unknown>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'location', header: 'Location' },
    {
      accessorKey: 'manager_name',
      header: 'Manager',
      cell: ({ row }) => row.original.manager_name ?? '—',
    },
    {
      accessorKey: 'total_stock',
      header: 'Stock',
      cell: ({ row }) => row.original.total_stock ?? 0,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.archived_at ? 'archived' : row.original.status} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: { original: Warehouse } }) => {
        const w = row.original
        const isArchived = !!w.archived_at
        return (
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" title="View" onClick={() => setViewTarget(w)}>
              <Eye className="size-3" />
            </Button>
            {isArchived ? (
              <RoleGuard roles={['admin']}>
                <Button variant="ghost" size="sm" title="Restore" onClick={() => setRestoreTarget(w)}>
                  <ArchiveRestore className="size-3" />
                </Button>
              </RoleGuard>
            ) : (
              <>
                <RoleGuard roles={['admin', 'manager']}>
                  <Button variant="ghost" size="sm" title="Edit" onClick={() => setEditingWarehouse(w)}>
                    <Edit2 className="size-3" />
                  </Button>
                </RoleGuard>
                <RoleGuard roles={['admin']}>
                  <Button variant="ghost" size="sm" title="Archive" className="text-destructive" onClick={() => setArchiveTarget(w)}>
                    <Archive className="size-3" />
                  </Button>
                </RoleGuard>
              </>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Warehouses"
        description="Manage warehouse locations and stock"
        action={
          <RoleGuard roles={['admin', 'manager']}>
            <Button onClick={() => setShowCreate(true)}>
              <Plus className="size-4 mr-2" />
              Add Warehouse
            </Button>
          </RoleGuard>
        }
      />

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3">
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setPage(1) }}
          placeholder="Search by name or location..."
          className="w-64"
        />
        <Select value={status} onValueChange={(v) => { setStatus(v ?? ''); setPage(1) }} items={WAREHOUSE_STATUS_ITEMS}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {showCreate && (
        <Card>
          <CardHeader><CardTitle>New Warehouse</CardTitle></CardHeader>
          <CardContent>
            <WarehouseForm
              onSubmit={async (d) => { await create.mutateAsync(d); setShowCreate(false) }}
              onCancel={() => setShowCreate(false)}
              loading={create.isPending}
            />
          </CardContent>
        </Card>
      )}

      {editingWarehouse && (
        <Card>
          <CardHeader><CardTitle>Edit Warehouse</CardTitle></CardHeader>
          <CardContent>
            <WarehouseForm
              isEdit
              defaultValues={{
                name: editingWarehouse.name,
                location: editingWarehouse.location,
                description: editingWarehouse.description ?? '',
                manager_name: editingWarehouse.manager_name ?? '',
                phone: editingWarehouse.phone ?? '',
                status: editingWarehouse.status,
              }}
              onSubmit={async (d) => { await update.mutateAsync({ id: editingWarehouse.id, data: d }); setEditingWarehouse(null) }}
              onCancel={() => setEditingWarehouse(null)}
              loading={update.isPending}
            />
          </CardContent>
        </Card>
      )}

      {viewTarget && <WarehouseDetailCard warehouse={viewTarget} onClose={() => setViewTarget(null)} />}

      {isLoading ? (
        <LoadingSpinner className="min-h-[200px]" />
      ) : !data?.data?.length ? (
        <EmptyState
          icon={WarehouseIcon}
          title="No warehouses found"
          action={{ label: 'Add Warehouse', onClick: () => setShowCreate(true) }}
        />
      ) : (
        <>
          <DataTable data={data.data} columns={columns} />
          {data.meta && (
            <TablePagination
              currentPage={data.meta.current_page}
              lastPage={data.meta.last_page}
              total={data.meta.total}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <ConfirmDialog
        open={!!archiveTarget}
        onClose={() => setArchiveTarget(null)}
        onConfirm={handleArchive}
        title="Archive Warehouse"
        description={`Archive "${archiveTarget?.name}"? It must be empty and cannot be the last active warehouse. Historical records are kept and it can be restored later.`}
        confirmLabel="Archive"
      />

      <ConfirmDialog
        open={!!blockInfo}
        onClose={() => setBlockInfo(null)}
        onConfirm={() => setBlockInfo(null)}
        title="Cannot Archive Warehouse"
        description={blockInfo
          ? `${blockInfo.message} Total stock: ${blockInfo.total_quantity}, reserved: ${blockInfo.reserved_quantity}, available: ${blockInfo.available_quantity}. Transfer the stock out before archiving.`
          : undefined}
        confirmLabel="OK"
        variant="default"
      />

      <ConfirmDialog
        open={!!restoreTarget}
        onClose={() => setRestoreTarget(null)}
        onConfirm={async () => { if (restoreTarget) await restore.mutateAsync(restoreTarget.id) }}
        title="Restore Warehouse"
        description={`Restore "${restoreTarget?.name}"? It will become selectable again for orders and transfers.`}
        confirmLabel="Restore"
        variant="default"
      />
    </div>
  )
}