import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Edit2, Trash2, Warehouse as WarehouseIcon } from 'lucide-react'
import { useWarehouses, useWarehouseMutation } from '@/hooks/useWarehouses'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { TablePagination } from '@/components/common/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import type { Warehouse } from '@/lib/types'

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
        <Select value={status} onValueChange={(v) => setValue('status', v as 'active' | 'inactive')}>
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

export default function WarehousesPage() {
  const [page, setPage] = useState(1)
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Warehouse | null>(null)

  const { data, isLoading } = useWarehouses({ page })
  const { create, update, remove } = useWarehouseMutation()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Warehouses"
        description="Manage warehouse locations"
        action={
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="size-4 mr-2" />
            Add Warehouse
          </Button>
        }
      />

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.data.map((warehouse) => (
              <Card key={warehouse.id}>
                <CardHeader>
                  <CardTitle>{warehouse.name}</CardTitle>
                  <CardDescription>{warehouse.location}</CardDescription>
                  <CardAction>
                    <StatusBadge status={warehouse.status} />
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm text-muted-foreground mb-4">
                    {warehouse.manager_name && <p>Manager: {warehouse.manager_name}</p>}
                    {warehouse.phone && <p>Phone: {warehouse.phone}</p>}
                    <p>{warehouse.inventory_count ?? 0} product types</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingWarehouse(warehouse)}>
                      <Edit2 className="size-3 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteTarget(warehouse)}
                      className="text-destructive"
                    >
                      <Trash2 className="size-3 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { if (deleteTarget) await remove.mutateAsync(deleteTarget.id) }}
        title="Delete Warehouse"
        description={`Delete "${deleteTarget?.name}"?`}
        confirmLabel="Delete"
      />
    </div>
  )
}
