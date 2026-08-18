import { useState } from 'react'
import { FileClock, Eye, Search, X } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { useActivityLogs } from '@/hooks/useActivityLogs'
import { useUsers } from '@/hooks/useUsers'
import { useAuth } from '@/hooks/useAuth'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable, TablePagination } from '@/components/common/DataTable'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { formatDateTime } from '@/lib/utils'
import type { ActivityLog } from '@/lib/types'

const ACTION_OPTIONS = [
  'product.created', 'product.updated', 'product.archived',
  'category.created', 'category.updated', 'category.deleted',
  'supplier.created', 'supplier.updated', 'supplier.deleted',
  'warehouse.created', 'warehouse.updated', 'warehouse.deleted',
  'customer.created', 'customer.updated', 'customer.archived',
  'inventory.adjusted', 'inventory.transferred',
  'purchase_order.created', 'purchase_order.updated', 'purchase_order.deleted',
  'purchase_order.sent', 'purchase_order.received', 'purchase_order.cancelled',
  'sales_order.created', 'sales_order.updated', 'sales_order.deleted',
  'sales_order.confirmed', 'sales_order.shipped', 'sales_order.cancelled',
  'user.created', 'user.updated', 'user.deleted', 'user.role_changed', 'user.activated', 'user.deactivated',
]

const MODEL_TYPE_OPTIONS = ['Product', 'Category', 'Supplier', 'Warehouse', 'Customer', 'Inventory', 'PurchaseOrder', 'SalesOrder', 'User']

function actionVariant(action: string): 'default' | 'destructive' | 'secondary' {
  if (/deleted|archived|cancelled|deactivated/.test(action)) return 'destructive'
  if (/created|activated|received|shipped|confirmed|sent/.test(action)) return 'default'
  return 'secondary'
}

function prettyPrint(value: Record<string, unknown> | null): string {
  if (!value || Object.keys(value).length === 0) return '—'
  return JSON.stringify(value, null, 2)
}

export default function ActivityLogPage() {
  const [search, setSearch] = useState('')
  const [action, setAction] = useState('')
  const [modelType, setModelType] = useState('')
  const [userId, setUserId] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<ActivityLog | null>(null)

  const { isAdmin } = useAuth()
  const { data, isLoading } = useActivityLogs({
    search: search || undefined,
    action: action || undefined,
    model_type: modelType || undefined,
    user_id: userId ? Number(userId) : undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    page,
  })
  // The user filter dropdown is admin-only; the `/users` endpoint is admin-only
  // too, so managers must never trigger this request.
  const { data: usersData } = useUsers({ per_page: 100, enabled: isAdmin })

  const hasFilters = Boolean(search || action || modelType || userId || dateFrom || dateTo)

  const resetFilters = () => {
    setSearch(''); setAction(''); setModelType(''); setUserId(''); setDateFrom(''); setDateTo(''); setPage(1)
  }

  const columns: ColumnDef<ActivityLog, unknown>[] = [
    { accessorKey: 'created_at', header: 'When', cell: ({ row }) => formatDateTime(row.original.created_at) },
    {
      accessorKey: 'user',
      header: 'User',
      cell: ({ row }) => row.original.user ? row.original.user.name : <span className="text-muted-foreground">Deleted user</span>,
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: ({ row }) => <Badge variant={actionVariant(row.original.action)} className="font-mono text-xs">{row.original.action}</Badge>,
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => <span className="text-xs text-muted-foreground max-w-xs truncate block">{row.original.description ?? '—'}</span>,
    },
    {
      accessorKey: 'model_type',
      header: 'Record',
      cell: ({ row }) => (
        <span className="text-xs">
          {row.original.model_type}
          {row.original.model_id !== null && <span className="text-muted-foreground font-mono"> #{row.original.model_id}</span>}
        </span>
      ),
    },
    {
      accessorKey: 'details',
      header: '',
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => setSelected(row.original)}>
          <Eye className="size-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Log"
        description="Who did what, when, and to which record"
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search description or action..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="pl-8 w-64"
          />
        </div>

        <select
          className="h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
          value={action}
          onChange={(e) => { setAction(e.target.value); setPage(1) }}
        >
          <option value="">All Actions</option>
          {ACTION_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>

        <select
          className="h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
          value={modelType}
          onChange={(e) => { setModelType(e.target.value); setPage(1) }}
        >
          <option value="">All Record Types</option>
          {MODEL_TYPE_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>

        {isAdmin && (
          <select
            className="h-9 rounded-md border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            value={userId}
            onChange={(e) => { setUserId(e.target.value); setPage(1) }}
          >
            <option value="">All Users</option>
            {(usersData?.data ?? []).map((u) => <option key={u.id} value={String(u.id)}>{u.name}</option>)}
          </select>
        )}

        <div className="flex items-center gap-2">
          <Input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1) }} className="w-36 h-9" />
          <span className="text-muted-foreground text-sm">to</span>
          <Input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1) }} className="w-36 h-9" />
        </div>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X className="size-4 mr-1" />Clear
          </Button>
        )}
      </div>

      {isLoading ? <LoadingSpinner className="min-h-[200px]" /> :
        !data?.data?.length ? <EmptyState icon={FileClock} title="No audit records found" /> : (
          <>
            <DataTable data={data.data} columns={columns} />
            {data.meta && <TablePagination currentPage={data.meta.current_page} lastPage={data.meta.last_page} total={data.meta.total} onPageChange={setPage} />}
          </>
        )}

      <Sheet open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null) }}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selected?.action}</SheetTitle>
            <SheetDescription>{selected?.description ?? 'No description'}</SheetDescription>
          </SheetHeader>

          {selected && (
            <div className="px-4 pb-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">User</p>
                  <p>{selected.user?.name ?? 'Deleted user'}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">When</p>
                  <p>{formatDateTime(selected.created_at)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">Record</p>
                  <p>{selected.model_type}{selected.model_id !== null ? ` #${selected.model_id}` : ''}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">IP Address</p>
                  <p className="font-mono text-xs">{selected.ip_address ?? '—'}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Old Values</p>
                <pre className="bg-muted/50 rounded-lg p-3 text-xs overflow-x-auto">{prettyPrint(selected.old_values)}</pre>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase mb-1">New Values</p>
                <pre className="bg-muted/50 rounded-lg p-3 text-xs overflow-x-auto">{prettyPrint(selected.new_values)}</pre>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}