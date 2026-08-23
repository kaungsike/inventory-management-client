import { useState } from 'react'
import { Boxes, Download, Warehouse as WarehouseIcon } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { useInventoryValuation } from '@/hooks/useReports'
import { useAllWarehouses } from '@/hooks/useWarehouses'
import { useAllCategories } from '@/hooks/useCategories'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable } from '@/components/common/DataTable'
import { StatsCard } from '@/components/common/StatsCard'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { ProductCombobox } from '@/components/forms/ProductCombobox'
import { formatCurrency } from '@/lib/utils'
import { downloadCsv, csvNumber } from '@/lib/csv'
import { toLabelItems } from '@/lib/labels'
import type { InventoryValuationRow } from '@/lib/types'

export default function InventoryValuationPage() {
  const [warehouseId, setWarehouseId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [productId, setProductId] = useState('')

  const { data, isLoading } = useInventoryValuation({
    warehouse_id: warehouseId ? Number(warehouseId) : undefined,
    category_id: categoryId ? Number(categoryId) : undefined,
    product_id: productId ? Number(productId) : undefined,
  })
  const { data: warehouses = [] } = useAllWarehouses()
  const { data: categories = [] } = useAllCategories()

  const summary = data?.summary
  const byWarehouse = data?.by_warehouse ?? []
  const rows = data?.data ?? []

  const exportCSV = () => {
    const headers = ['Product', 'SKU', 'Warehouse', 'Quantity', 'Average Cost', 'Inventory Value']
    const dataRows = rows.map((row) => [
      row.product_name ?? '',
      row.product_sku,
      row.warehouse_name ?? '',
      csvNumber(row.quantity),
      csvNumber(row.average_cost),
      csvNumber(row.inventory_value),
    ])
    downloadCsv('inventory-valuation.csv', headers, dataRows)
  }

  const columns: ColumnDef<InventoryValuationRow, unknown>[] = [
    { accessorKey: 'product', header: 'Product', cell: ({ row }) => (
      <div>
        <p className="font-medium text-sm">{row.original.product_name}</p>
        <p className="text-xs text-muted-foreground font-mono">{row.original.product_sku}</p>
      </div>
    )},
    { accessorKey: 'warehouse_name', header: 'Warehouse', cell: ({ row }) => row.original.warehouse_name ?? '—' },
    { accessorKey: 'quantity', header: 'Qty' },
    { accessorKey: 'average_cost', header: 'WAC', cell: ({ row }) => formatCurrency(row.original.average_cost) },
    { accessorKey: 'inventory_value', header: 'Value', cell: ({ row }) => <span className="font-medium">{formatCurrency(row.original.inventory_value)}</span> },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory Valuation"
        description="Current on-hand stock valued at the weighted average cost (quantity × WAC)"
        action={
          <Button variant="outline" onClick={exportCSV} disabled={!rows.length}>
            <Download className="size-4 mr-2" />Export CSV
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={warehouseId} onValueChange={(v) => setWarehouseId(v ?? '')} items={toLabelItems(warehouses, (w) => w.name)}>
          <SelectTrigger className="w-44 h-8"><SelectValue placeholder="All Warehouses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Warehouses</SelectItem>
            {warehouses.map((w) => <SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? '')} items={toLabelItems(categories, (c) => c.name)}>
          <SelectTrigger className="w-44 h-8"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="w-56">
          <ProductCombobox value={productId} onChange={(v) => setProductId(v)} placeholder="All Products" />
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatsCard icon={Boxes} label="Total Units" value={summary.total_units} />
          <StatsCard icon={WarehouseIcon} label="Total Inventory Value" value={formatCurrency(summary.total_value)} />
        </div>
      )}

      {/* By Warehouse */}
      {byWarehouse.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {byWarehouse.map((w) => (
            <Card key={w.warehouse_id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><WarehouseIcon className="size-4 text-muted-foreground" />{w.warehouse_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(w.total_value)}</p>
                <p className="text-xs text-muted-foreground mt-1">{w.total_units} units</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isLoading ? <LoadingSpinner className="min-h-[300px]" /> : !rows.length ? (
        <EmptyState icon={Boxes} title="No inventory to value" description="Try clearing the filters" />
      ) : (
        <DataTable data={rows} columns={columns} />
      )}
    </div>
  )
}