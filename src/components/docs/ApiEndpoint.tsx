import { ShieldCheckIcon, UserRoundIcon, MapPinIcon } from 'lucide-react'

import { DocsCodeBlock } from './DocsCodeBlock'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ApiEndpoint } from '@/lib/apiDocs'

function methodBadge(method: ApiEndpoint['method']) {
  switch (method) {
    case 'GET':
      return { variant: 'secondary' as const, label: 'GET' }
    case 'POST':
      return { variant: 'default' as const, label: 'POST' }
    case 'PUT':
    case 'PATCH':
      return { variant: 'outline' as const, label: method }
    case 'DELETE':
      return { variant: 'destructive' as const, label: 'DELETE' }
  }
}

function FieldTable({ fields }: { fields: NonNullable<ApiEndpoint['body']> }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[480px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left">
            <th className="px-3 py-2 font-medium text-foreground">Field</th>
            <th className="px-3 py-2 font-medium text-foreground">Type</th>
            <th className="px-3 py-2 font-medium text-foreground">Required</th>
            <th className="px-3 py-2 font-medium text-foreground">Description</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field) => (
            <tr key={field.name} className="border-b border-border last:border-0">
              <td className="px-3 py-2 font-mono text-xs text-foreground">{field.name}</td>
              <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{field.type}</td>
              <td className="px-3 py-2 text-muted-foreground">{field.required ? 'Yes' : 'No'}</td>
              <td className="px-3 py-2 text-muted-foreground">{field.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ApiEndpoint({ endpoint }: { endpoint: ApiEndpoint }) {
  const badge = methodBadge(endpoint.method)

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center gap-3 border-b border-border bg-muted/30 px-4 py-3">
        <Badge variant={badge.variant} className="w-14 justify-center font-mono text-xs">
          {badge.label}
        </Badge>
        <code className="font-mono text-sm font-medium text-foreground">{endpoint.path}</code>
        <span className="ml-auto text-sm text-muted-foreground">{endpoint.title}</span>
      </div>

      <div className="space-y-4 p-4 text-sm">
        <div>
          <p className="mb-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">Purpose</p>
          <p className="leading-6 text-foreground">{endpoint.description}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-start gap-2 rounded-lg border border-border p-3">
            <ShieldCheckIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Authentication</p>
              <p className="mt-0.5 text-muted-foreground">{endpoint.auth}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 rounded-lg border border-border p-3">
            <UserRoundIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Allowed roles</p>
              <p className="mt-0.5 text-muted-foreground">{endpoint.roles}</p>
            </div>
          </div>
          {endpoint.managerScope ? (
            <div className="flex items-start gap-2 rounded-lg border border-border p-3">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Manager scope</p>
                <p className="mt-0.5 text-muted-foreground">{endpoint.managerScope}</p>
              </div>
            </div>
          ) : (
            <div />
          )}
        </div>

        {endpoint.params && (
          <div>
            <p className="mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">Query parameters</p>
            <ul className="space-y-1">
              {endpoint.params.map((param) => (
                <li key={param} className="font-mono text-xs text-muted-foreground">
                  {param}
                </li>
              ))}
            </ul>
          </div>
        )}

        {endpoint.body && (
          <div>
            <p className="mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">Request body</p>
            <FieldTable fields={endpoint.body} />
          </div>
        )}

        {endpoint.response && (
          <div>
            <p className="mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">Response</p>
            <DocsCodeBlock code={endpoint.response} filename="response.json" className="my-0" />
          </div>
        )}

        {endpoint.errors && (
          <div>
            <p className="mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">Possible errors</p>
            <ul className={cn('space-y-1')}>
              {endpoint.errors.map((error) => (
                <li key={error} className="font-mono text-xs text-muted-foreground">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}