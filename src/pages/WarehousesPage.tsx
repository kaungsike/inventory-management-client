import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit2, Archive, ArchiveRestore, Eye, Warehouse as WarehouseIcon } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { useWarehouses, useWarehouseMutation, useActiveManagers } from '@/hooks/useWarehouses'
import { useAuth } from '@/hooks/useAuth'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { RoleGuard } from '@/components/auth/RoleGuard'
import { STATUS_LABELS } from '@/lib/labels'
import type { Warehouse } from '@/lib/types'

const WAREHOUSE_STATUS_ITEMS = {
  active: 'Active',
  inactive: 'Inactive',
  archived: 'Archived',
}

interface WarehouseFormData {
  name: string
  location: string
  description: string
  status: 'active' | 'inactive'
  manager_id: string
}

function WarehouseForm({ defaultValues, onSubmit, onCancel, loading, isEdit, canAssignManager, managers }: {
  defaultValues?: Partial<WarehouseFormData>
  onSubmit: (d: WarehouseFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
  isEdit?: boolean
  canAssignManager?: boolean
  managers?: { id: number; name: string }[]
}) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<WarehouseFormData>({
    defaultValues: {
      name: '', location: '', description: '',
      status: 'active', manager_id: '',
      ...defaultValues,
    },
  })
  const status = watch('status')
  const managerId = watch('manager_id')
  const managerItems = Object.fromEntries((managers ?? []).map((m) => [String(m.id), m.name]))

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
      {canAssignManager && (
        <div>
          <Label>Assigned Manager</Label>
          <Select value={managerId} onValueChange={(v) => setValue('manager_id', v ?? '')} items={managerItems}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Unassigned" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Unassigned</SelectItem>
              {(managers ?? []).map((m) => (
                <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
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

interface ArchiveBlockInfo {
  message: string
  total_quantity: number
  reserved_quantity: number
  available_quantity: number
}

export default function WarehousesPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [archiveTarget, setArchiveTarget] = useState<Warehouse | null>(null)
  const [restoreTarget, setRestoreTarget] = useState<Warehouse | null>(null)
  const [blockInfo, setBlockInfo] = useState<ArchiveBlockInfo | null>(null)

  const { isAdmin } = useAuth()
  const managers = useActiveManagers(isAdmin)

  const { data, isLoading } = useWarehouses({ search, status: status || undefined, page })
  const { create, update, archive, restore } = useWarehouseMutation()

  const buildPayload = (d: WarehouseFormData) => {
    const payload: Record<string, unknown> = {
      name: d.name,
      location: d.location,
      description: d.description,
      status: d.status,
    }
    if (isAdmin) payload.manager_id = d.manager_id ? Number(d.manager_id) : null
    return payload
  }

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
      accessorKey: 'manager',
      header: 'Manager',
      cell: ({ row }) => row.original.manager?.name ?? 'Unassigned',
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
            <Button variant="ghost" size="sm" title="View" onClick={() => navigate(`/warehouses/${w.id}`)}>
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
                <RoleGuard roles={['admin']}>
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
        description="Manage warehouse locations, assigned managers and stock"
        action={
          <RoleGuard roles={['admin']}>
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
              canAssignManager={isAdmin}
              managers={managers}
              onSubmit={async (d) => { await create.mutateAsync(buildPayload(d)); setShowCreate(false) }}
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
              canAssignManager={isAdmin}
              managers={managers}
              defaultValues={{
                name: editingWarehouse.name,
                location: editingWarehouse.location,
                description: editingWarehouse.description ?? '',
                status: editingWarehouse.status,
                manager_id: editingWarehouse.manager_id ? String(editingWarehouse.manager_id) : '',
              }}
              onSubmit={async (d) => { await update.mutateAsync({ id: editingWarehouse.id, data: buildPayload(d) }); setEditingWarehouse(null) }}
              onCancel={() => setEditingWarehouse(null)}
              loading={update.isPending}
            />
          </CardContent>
        </Card>
      )}

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