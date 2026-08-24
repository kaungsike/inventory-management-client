import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Edit2, Trash2, UserRound, Trash } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ColumnDef } from '@tanstack/react-table'
import { useCustomers, useCustomerMutation } from '@/hooks/useCustomers'
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
import { useAuth } from '@/hooks/useAuth'
import { STATUS_LABELS } from '@/lib/labels'
import type { Customer } from '@/lib/types'

interface CustomerFormData {
  name: string
  email: string
  phone: string
  address: string
  status: 'active' | 'inactive'
}

function CustomerForm({ defaultValues, onSubmit, onCancel, loading, isEdit }: {
  defaultValues?: Partial<CustomerFormData>
  onSubmit: (d: CustomerFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
  isEdit?: boolean
}) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CustomerFormData>({
    defaultValues: {
      name: '', email: '', phone: '', address: '', status: 'active',
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
        <Label>Email</Label>
        <Input
          type="email"
          {...register('email', {
            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
          })}
          className="mt-1"
        />
        {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
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

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null)

  const { isAdmin, isManager } = useAuth()
  const showActionsColumn = isAdmin || isManager

  const { data, isLoading } = useCustomers({ search, page })
  const { create, update, remove } = useCustomerMutation()

  const columns: ColumnDef<Customer, unknown>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email', cell: ({ row }) => row.original.email || '—' },
    { accessorKey: 'phone', header: 'Phone', cell: ({ row }) => row.original.phone || '—' },
    { accessorKey: 'address', header: 'Address', cell: ({ row }) => row.original.address || '—' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    ...(showActionsColumn
      ? [
          {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }: { row: { original: Customer } }) => (
              <div className="flex gap-1">
                <RoleGuard roles={['admin', 'manager']}>
                  <Button variant="ghost" size="sm" onClick={() => setEditingCustomer(row.original)}>
                    <Edit2 className="size-3" />
                  </Button>
                </RoleGuard>
                <RoleGuard roles={['admin']}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteTarget(row.original)}
                    className="text-destructive"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </RoleGuard>
              </div>
            ),
          } as ColumnDef<Customer, unknown>,
        ]
      : []),
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage your customers"
        action={
          <div className="flex gap-2">
            <RoleGuard roles={['admin', 'manager']}>
              <Link to="/customers/trash">
                <Button variant="outline">
                  <Trash className="size-4 mr-2" />Deleted
                </Button>
              </Link>
            </RoleGuard>
            <RoleGuard roles={['admin', 'manager']}>
              <Button onClick={() => setShowCreate(true)}>
                <Plus className="size-4 mr-2" />
                Add Customer
              </Button>
            </RoleGuard>
          </div>
        }
      />

      {showCreate && (
        <Card>
          <CardHeader><CardTitle>New Customer</CardTitle></CardHeader>
          <CardContent>
            <CustomerForm
              onSubmit={async (d) => { await create.mutateAsync(d); setShowCreate(false) }}
              onCancel={() => setShowCreate(false)}
              loading={create.isPending}
            />
          </CardContent>
        </Card>
      )}

      {editingCustomer && (
        <Card>
          <CardHeader><CardTitle>Edit Customer</CardTitle></CardHeader>
          <CardContent>
            <CustomerForm
              isEdit
              defaultValues={{
                name: editingCustomer.name,
                email: editingCustomer.email ?? '',
                phone: editingCustomer.phone ?? '',
                address: editingCustomer.address ?? '',
                status: editingCustomer.status,
              }}
              onSubmit={async (d) => { await update.mutateAsync({ id: editingCustomer.id, data: d }); setEditingCustomer(null) }}
              onCancel={() => setEditingCustomer(null)}
              loading={update.isPending}
            />
          </CardContent>
        </Card>
      )}

      <SearchInput
        value={search}
        onChange={(v) => { setSearch(v); setPage(1) }}
        placeholder="Search customers..."
        className="max-w-xs"
      />

      {isLoading ? (
        <LoadingSpinner className="min-h-[200px]" />
      ) : !data?.data?.length ? (
        <EmptyState
          icon={UserRound}
          title="No customers found"
          action={{ label: 'Add Customer', onClick: () => setShowCreate(true) }}
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
        title="Delete Customer"
        description={`This item will be moved to Deleted Items. Historical records will be preserved and the item can be restored later.`}
        confirmLabel="Delete"
      />
    </div>
  )
}
