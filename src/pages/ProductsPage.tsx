import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit2, Trash2, Package } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { useProducts, useProductMutation } from '@/hooks/useProducts'
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
import { Badge } from '@/components/ui/badge'
import { formatCurrency, calculateStockStatus } from '@/lib/utils'
import type { Product } from '@/lib/types'

function StockStatusBadge({ qty, reorderPoint }: { qty?: number; reorderPoint?: number }) {
  const status = calculateStockStatus(qty ?? 0, reorderPoint ?? 10)
  const map = {
    critical: 'destructive' as const,
    low: 'secondary' as const,
    normal: 'default' as const,
    overstock: 'outline' as const,
  }
  return <Badge variant={map[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
}

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  const { data, isLoading } = useProducts({
    search,
    category_id: categoryId ? Number(categoryId) : undefined,
    status: status || undefined,
    page,
  })
  const { data: categories = [] } = useAllCategories()
  const { remove } = useProductMutation()

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
      id: 'stock_status',
      header: 'Stock',
      cell: ({ row }) => <StockStatusBadge qty={row.original.total_stock} />,
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
          <Link to={`/products/${row.original.id}/edit`}>
            <Button variant="ghost" size="sm"><Edit2 className="size-3" /></Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(row.original)} className="text-destructive">
            <Trash2 className="size-3" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your product catalog"
        action={
          <Link to="/products/new">
            <Button><Plus className="size-4 mr-2" />Add Product</Button>
          </Link>
        }
      />

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3">
        <SearchInput
          value={search}
          onChange={(v) => { setSearch(v); setPage(1) }}
          placeholder="Search by name or SKU..."
          className="w-64"
        />
        <Select value={categoryId} onValueChange={(v) => { setCategoryId(v ?? ''); setPage(1) }}>
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
        <Select value={status} onValueChange={(v) => { setStatus(v ?? ''); setPage(1) }}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="discontinued">Discontinued</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <LoadingSpinner className="min-h-[200px]" />
      ) : !data?.data?.length ? (
        <EmptyState
          icon={Package}
          title="No products found"
          action={{ label: 'Add Product', onClick: () => {} }}
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
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { if (deleteTarget) await remove.mutateAsync(deleteTarget.id) }}
        title="Delete Product"
        description={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  )
}
