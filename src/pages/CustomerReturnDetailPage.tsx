import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, XCircle, Pencil, AlertTriangle } from 'lucide-react'
import { useCustomerReturn, useCustomerReturnMutation } from '@/hooks/useCustomerReturns'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { formatCurrency, formatDate } from '@/lib/utils'
import { RoleGuard } from '@/components/auth/RoleGuard'
import { useState } from 'react'

export default function CustomerReturnDetailPage() {
  const { id } = useParams()
  const returnId = id ? Number(id) : null
  const { data: ret, isLoading } = useCustomerReturn(returnId)
  const { complete, cancel } = useCustomerReturnMutation()
  const [showCancel, setShowCancel] = useState(false)

  if (isLoading) return <LoadingSpinner className="min-h-[400px]" />
  if (!ret) return <div className="p-6 text-center text-muted-foreground">Customer return not found</div>

  const canComplete = ret.status === 'draft'
  const canCancel = ret.status === 'draft'
  const isTerminal = ['completed', 'cancelled'].includes(ret.status)

  const completeError = complete.error
  const completeErrorMessage = (completeError as { response?: { data?: { message?: string } } })?.response?.data?.message

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link to="/customer-returns"><Button variant="ghost" size="sm"><ArrowLeft className="size-4 mr-1" />Back</Button></Link>
        <PageHeader title={`Return: ${ret.return_number}`} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Return Information</CardTitle>
            <StatusBadge status={ret.status} />
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div><p className="text-muted-foreground">Customer</p><p className="font-medium">{ret.customer?.name ?? '—'}</p></div>
          <div><p className="text-muted-foreground">Warehouse</p><p className="font-medium">{ret.warehouse?.name ?? '—'}</p></div>
          <div><p className="text-muted-foreground">Sales Order</p>
            <Link to={`/sales-orders/${ret.sales_order_id}`} className="font-mono hover:underline">
              {ret.sales_order?.so_number ?? `#${ret.sales_order_id}`}
            </Link>
          </div>
          <div><p className="text-muted-foreground">Return Date</p><p className="font-medium">{formatDate(ret.return_date)}</p></div>
          <div><p className="text-muted-foreground">Total Amount</p><p className="font-bold">{formatCurrency(ret.total_amount)}</p></div>
          <div><p className="text-muted-foreground">Created By</p><p className="font-medium">{ret.user?.name ?? '—'}</p></div>
          {ret.reason && <div className="col-span-2"><p className="text-muted-foreground">Reason</p><p>{ret.reason}</p></div>}
          {ret.notes && <div className="col-span-2 sm:col-span-4"><p className="text-muted-foreground">Notes</p><p>{ret.notes}</p></div>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Return Items</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-2 font-medium text-muted-foreground">Product</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Quantity</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Unit Price</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Unit Cost</th>
                  <th className="text-right py-2 font-medium text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ret.items?.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2">
                      <p>{item.product_name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{item.product_sku}</p>
                    </td>
                    <td className="text-right py-2">{item.quantity}</td>
                    <td className="text-right py-2">{formatCurrency(item.unit_price)}</td>
                    <td className="text-right py-2">{item.unit_cost !== null ? formatCurrency(item.unit_cost) : '—'}</td>
                    <td className="text-right py-2">{formatCurrency(item.total_amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Separator className="my-3" />
          <div className="flex justify-end">
            <p className="font-bold">Total: {formatCurrency(ret.total_amount)}</p>
          </div>
        </CardContent>
      </Card>

      {completeErrorMessage && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive text-sm flex items-start gap-3">
          <AlertTriangle className="size-5 shrink-0 mt-0.5" />
          <p>{completeErrorMessage}</p>
        </div>
      )}

      <RoleGuard roles={['admin', 'manager']}>
        <Card>
          <CardHeader><CardTitle>Return Status Actions</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2 items-center">
            {isTerminal ? (
              <p className="text-sm text-muted-foreground">
                This return is <span className="font-semibold capitalize">{ret.status}</span> and cannot be modified.
              </p>
            ) : (
              <>
                <Link to={`/customer-returns/${ret.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Pencil className="size-4 mr-1" />Edit Return
                  </Button>
                </Link>
                {canComplete && (
                  <Button variant="default" size="sm" disabled={complete.isPending}
                    onClick={() => complete.mutateAsync(ret.id)}>
                    <CheckCircle className="size-4 mr-1" />{complete.isPending ? 'Completing...' : 'Complete Return'}
                  </Button>
                )}
                {canCancel && (
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive"
                    disabled={cancel.isPending} onClick={() => setShowCancel(true)}>
                    <XCircle className="size-4 mr-1" />Cancel Return
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </RoleGuard>

      <ConfirmDialog open={showCancel} onClose={() => setShowCancel(false)}
        onConfirm={async () => { await cancel.mutateAsync(ret.id); setShowCancel(false) }}
        title="Cancel Customer Return"
        description={`Cancel ${ret.return_number}? No stock is added back for cancelled returns.`}
        confirmLabel="Cancel Return" />
    </div>
  )
}