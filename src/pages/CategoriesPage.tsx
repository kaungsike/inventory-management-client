import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Edit2, Trash2, Tag } from 'lucide-react'
import { useCategories, useCategoryMutation } from '@/hooks/useCategories'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { SearchInput } from '@/components/common/SearchInput'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { TablePagination } from '@/components/common/DataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import type { Category } from '@/lib/types'

interface CategoryFormData {
  name: string
  description: string
  status: 'active' | 'inactive'
}

interface CategoryFormProps {
  defaultValues?: Partial<CategoryFormData>
  onSubmit: (data: CategoryFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

function CategoryForm({ defaultValues, onSubmit, onCancel, loading }: CategoryFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CategoryFormData>({
    defaultValues: { name: '', description: '', status: 'active', ...defaultValues },
  })
  const status = watch('status')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="cat-name">Name *</Label>
        <Input
          id="cat-name"
          {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
          className="mt-1"
        />
        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="cat-desc">Description</Label>
        <Textarea id="cat-desc" {...register('description')} className="mt-1" rows={3} />
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
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  )
}

export default function CategoriesPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const { data, isLoading } = useCategories({ search, page })
  const { create, update, remove } = useCategoryMutation()

  const handleCreate = async (formData: CategoryFormData) => {
    await create.mutateAsync(formData)
    setShowCreateForm(false)
  }

  const handleUpdate = async (formData: CategoryFormData) => {
    if (!editingCategory) return
    await update.mutateAsync({ id: editingCategory.id, data: formData })
    setEditingCategory(null)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await remove.mutateAsync(deleteTarget.id)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Manage product categories"
        action={
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="size-4 mr-2" />
            Add Category
          </Button>
        }
      />

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryForm
              onSubmit={handleCreate}
              onCancel={() => setShowCreateForm(false)}
              loading={create.isPending}
            />
          </CardContent>
        </Card>
      )}

      {/* Toolbar */}
      <SearchInput
        value={search}
        onChange={(v) => { setSearch(v); setPage(1) }}
        placeholder="Search categories..."
        className="max-w-xs"
      />

      {/* Edit Form */}
      {editingCategory && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryForm
              defaultValues={{
                name: editingCategory.name,
                description: editingCategory.description ?? '',
                status: editingCategory.status,
              }}
              onSubmit={handleUpdate}
              onCancel={() => setEditingCategory(null)}
              loading={update.isPending}
            />
          </CardContent>
        </Card>
      )}

      {/* Grid */}
      {isLoading ? (
        <LoadingSpinner className="min-h-[200px]" />
      ) : !data?.data?.length ? (
        <EmptyState
          icon={Tag}
          title="No categories found"
          description="Create your first category"
          action={{ label: 'Add Category', onClick: () => setShowCreateForm(true) }}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.data.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.description || 'No description'}</CardDescription>
                  <CardAction className="flex items-center gap-1">
                    <StatusBadge status={category.status} />
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-3">
                    {category.products_count ?? 0} products
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingCategory(category)}>
                      <Edit2 className="size-3 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteTarget(category)}
                      className="text-destructive hover:text-destructive"
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
        onConfirm={handleDelete}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  )
}
