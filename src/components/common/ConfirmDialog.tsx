import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from './LoadingSpinner'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
  title: string
  description?: string
  confirmLabel?: string
  variant?: 'destructive' | 'default'
}

export function ConfirmDialog({
  open, onClose, onConfirm, title, description,
  confirmLabel = 'Confirm', variant = 'destructive'
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const handleConfirm = async () => {
    setLoading(true)
    try { await onConfirm() } finally { setLoading(false); onClose() }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-lg font-semibold text-foreground mb-2">{title}</h2>
        {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
