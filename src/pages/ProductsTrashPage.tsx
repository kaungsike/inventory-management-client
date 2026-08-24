import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { useTrashedProducts, useProductMutation } from '@/hooks/useProducts'
import { useAllCategories } from '@/hooks/useCategories'
import { PageHeader } from '@/components/common/PageHeader'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { SearchInput } from '@/components/common/SearchInput'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { DataTable, TablePagination } from '@/components/common/DataTable'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { RoleGuard } from '@/components/auth/RoleGuard'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/lib/types'

export default function ProductsTrashPage() {
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [page, setPage] = useState(1)
  const [restoreTarget, setRestoreTarget] = useState<Product | null>(null)

  const { data, isLoading } = useTrashedProducts({
    search,
    category_id: categoryId ? Number(categoryId) : undefined,
    page,
  })
  const { data: categories = [] } = useAllCategories()
  const { restore } = useProductMutation()

  const columns: ColumnDef<Product, unknown>[] = [
    {
      accessorKey: 'sku',
      header: 'SKU',
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.sku}</span>,
    },
    { accessorKey: 'name', header: 'Name' },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => row.original.category?.name ?? '—',
    },
    {
      accessorKey: 'supplier',
      header: 'Supplier',
      cell: ({ row }) => row.original.supplier?.name ?? '—',
    },
    {
      accessorKey: 'unit_price',
      header: 'Unit Price',
      cell: ({ row }) => formatCurrency(row.original.unit_price),
    },
    {
      accessorKey: 'deleted_at',
      header: 'Deleted At',
      cell: ({ row }) => row.original.deleted_at ? new Date(row.original.deleted_at).toLocaleDateString() : '—',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: { original: Product } }) => (
        <RoleGuard roles={['admin', 'manager']}>
          <Button variant="ghost" size="sm" onClick={() => setRestoreTarget(row.original)}>
            <RotateCcw className="size-3 mr-1" /> Restore
          </Button>
        </RoleGuard>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deleted Products"
        description="View and restore soft-deleted products"
        action={
          <Link to="/products">
            <Button variant="outline">
              <ArrowLeft className="size-4 mr-2" /> Back to Products
            </Button>
          </Link>
        }
      />

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3">
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setPage(1) }}
          placeholder="Search deleted products..."
          className="w-64"
        />
        <Select value={categoryId} onValueChange={(v) => { setCategoryId(v ?? ''); setPage(1) }} items={Object.fromEntries(categories.map((c) => [String(c.id), c.name]))}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <LoadingSpinner className="min-h-[200px]" />
      ) : !data?.data?.length ? (
        <EmptyState
          icon={Trash2}
          title="No deleted products"
          description="Soft-deleted products will appear here"
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
        open={!!restoreTarget}
        onClose={() => setRestoreTarget(null)}
        onConfirm={async () => { if (restoreTarget) await restore.mutateAsync(restoreTarget.id) }}
        title="Restore Product"
        description={`Restore "${restoreTarget?.name}"? It will become active again and available for new transactions.`}
        confirmLabel="Restore"
        variant="default"
      />
    </div>
  )
}
