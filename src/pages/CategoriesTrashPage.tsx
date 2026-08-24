import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react'
import { useTrashedCategories, useCategoryMutation } from '@/hooks/useCategories'
import { PageHeader } from '@/components/common/PageHeader'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { SearchInput } from '@/components/common/SearchInput'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { TablePagination } from '@/components/common/DataTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card'
import { RoleGuard } from '@/components/auth/RoleGuard'
import type { Category } from '@/lib/types'

export default function CategoriesTrashPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [restoreTarget, setRestoreTarget] = useState<Category | null>(null)

  const { data, isLoading } = useTrashedCategories({ search, page })
  const { restore } = useCategoryMutation()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deleted Categories"
        description="View and restore soft-deleted categories"
        action={
          <Link to="/categories">
            <Button variant="outline">
              <ArrowLeft className="size-4 mr-2" /> Back to Categories
            </Button>
          </Link>
        }
      />

      <SearchInput
        value={search}
        onChange={(v) => { setSearch(v); setPage(1) }}
        placeholder="Search deleted categories..."
        className="max-w-xs"
      />

      {isLoading ? (
        <LoadingSpinner className="min-h-[200px]" />
      ) : !data?.data?.length ? (
        <EmptyState
          icon={Trash2}
          title="No deleted categories"
          description="Soft-deleted categories will appear here"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.data.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.description || 'No description'}</CardDescription>
                  <CardAction>
                    <RoleGuard roles={['admin', 'manager']}>
                      <Button variant="outline" size="sm" onClick={() => setRestoreTarget(category)}>
                        <RotateCcw className="size-3 mr-1" /> Restore
                      </Button>
                    </RoleGuard>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Deleted: {category.deleted_at ? new Date(category.deleted_at).toLocaleDateString() : '—'}
                  </p>
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
        open={!!restoreTarget}
        onClose={() => setRestoreTarget(null)}
        onConfirm={async () => { if (restoreTarget) await restore.mutateAsync(restoreTarget.id) }}
        title="Restore Category"
        description={`Restore "${restoreTarget?.name}"? It will become active again.`}
        confirmLabel="Restore"
        variant="default"
      />
    </div>
  )
}
