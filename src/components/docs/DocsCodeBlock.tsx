import { useState } from 'react'
import { CheckIcon, CopyIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DocsCodeBlockProps {
  code: string
  filename?: string
  className?: string
}

export function DocsCodeBlock({ code, filename, className }: DocsCodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable; ignore
    }
  }

  return (
    <div className={cn('my-4 overflow-hidden rounded-xl border border-border bg-muted/40', className)}>
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/60 px-4 py-2">
        <span className="font-mono text-xs text-muted-foreground">{filename ?? 'code'}</span>
        <Button variant="ghost" size="sm" onClick={copy} className="gap-1 text-xs">
          {copied ? <CheckIcon className="size-3.5 text-emerald-600 dark:text-emerald-400" /> : <CopyIcon className="size-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="block font-mono text-[0.8rem] leading-6 whitespace-pre text-foreground">{code}</code>
      </pre>
    </div>
  )
}