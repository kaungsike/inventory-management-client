import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Edit2, Trash2, Users } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { useSuppliers, useSupplierMutation } from '@/hooks/useSuppliers'
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
import type { Supplier } from '@/lib/types'

interface SupplierFormData {
  name: string
  email: string
  phone: string
  address: string
  company: string
  contact_person: string
  status: 'active' | 'inactive'
}

function SupplierForm({ defaultValues, onSubmit, onCancel, loading, isEdit }: {
  defaultValues?: Partial<SupplierFormData>
  onSubmit: (d: SupplierFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
  isEdit?: boolean
}) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SupplierFormData>({
    defaultValues: {
      name: '', email: '', phone: '', address: '',
      company: '', contact_person: '', status: 'active',
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
        <Label>Email *</Label>
        <Input
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
          })}
          className="mt-1"
        />
        {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <Label>Phone *</Label>
        <Input {...register('phone', { required: 'Phone is required' })} className="mt-1" />
        {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
      </div>
      <div>
        <Label>Company</Label>
        <Input {...register('company')} className="mt-1" />
      </div>
      <div>
        <Label>Contact Person</Label>
        <Input {...register('contact_person')} className="mt-1" />
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
        <Label>Address</Label>
        <Textarea {...register('address')} className="mt-1" rows={2} />
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

export default function SuppliersPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null)

  const { data, isLoading } = useSuppliers({ search, page })
  const { create, update, remove } = useSupplierMutation()

  const columns: ColumnDef<Supplier, unknown>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'phone', header: 'Phone' },
    {
      accessorKey: 'company',
      header: 'Company',
      cell: ({ row }) => row.original.company || '—',
    },
    {
      accessorKey: 'contact_person',
      header: 'Contact',
      cell: ({ row }) => row.original.contact_person || '—',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => setEditingSupplier(row.original)}>
            <Edit2 className="size-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteTarget(row.original)}
            className="text-destructive"
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        description="Manage your suppliers"
        action={
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="size-4 mr-2" />
            Add Supplier
          </Button>
        }
      />

      {showCreate && (
        <Card>
          <CardHeader><CardTitle>New Supplier</CardTitle></CardHeader>
          <CardContent>
            <SupplierForm
              onSubmit={async (d) => { await create.mutateAsync(d); setShowCreate(false) }}
              onCancel={() => setShowCreate(false)}
              loading={create.isPending}
            />
          </CardContent>
        </Card>
      )}

      {editingSupplier && (
        <Card>
          <CardHeader><CardTitle>Edit Supplier</CardTitle></CardHeader>
          <CardContent>
            <SupplierForm
              isEdit
              defaultValues={{
                name: editingSupplier.name,
                email: editingSupplier.email,
                phone: editingSupplier.phone,
                address: editingSupplier.address ?? '',
                company: editingSupplier.company ?? '',
                contact_person: editingSupplier.contact_person ?? '',
                status: editingSupplier.status,
              }}
              onSubmit={async (d) => { await update.mutateAsync({ id: editingSupplier.id, data: d }); setEditingSupplier(null) }}
              onCancel={() => setEditingSupplier(null)}
              loading={update.isPending}
            />
          </CardContent>
        </Card>
      )}

      <SearchInput
        value={search}
        onChange={(v) => { setSearch(v); setPage(1) }}
        placeholder="Search suppliers..."
        className="max-w-xs"
      />

      {isLoading ? (
        <LoadingSpinner className="min-h-[200px]" />
      ) : !data?.data?.length ? (
        <EmptyState
          icon={Users}
          title="No suppliers found"
          action={{ label: 'Add Supplier', onClick: () => setShowCreate(true) }}
        />
      ) : (
        <>
          <DataTable data={data.data} columns={columns} loading={isLoading} />
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
        title="Delete Supplier"
        description={`Delete "${deleteTarget?.name}"?`}
        confirmLabel="Delete"
      />
    </div>
  )
}
