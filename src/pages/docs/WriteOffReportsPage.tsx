import type * as React from 'react'
import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, P, Strong, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('write-off-reports')!

export default function WriteOffReportsPage() {
  return (
    <DocPage meta={meta}>
      <P>
        The <Strong>Write-off Report</Strong> shows the financial loss from damaged and expired stock. Like every other
        report, it reads the inventory ledger.
      </P>

      <H2>What it reports</H2>
      <DocsFormula label="Total Value">Σ ( |quantity| × unit_cost ) for type = damage or expired</DocsFormula>
      <P>
        Each write-off entry stored its <Strong>unit_cost</Strong> as the weighted average cost at the time of the
        write-off, so the reported value is the historical loss — accurate even if WAC changed later.
      </P>
      <UL>
        <LI><Strong>Total value</Strong> — all write-offs combined.</LI>
        <LI><Strong>Damage quantity and value</Strong> — the damage breakdown.</LI>
        <LI><Strong>Expired quantity and value</Strong> — the expired breakdown.</LI>
        <LI>Per-row detail with the product, warehouse, reason, and value.</LI>
      </UL>

      <H2>What it does not include</H2>
      <UL>
        <LI>Write-offs never touch sales revenue or gross profit.</LI>
        <LI>Write-offs do not change WAC.</LI>
      </UL>

      <DocsCallout variant="note" title="Related reading">
        See <Link to="/docs/damage-expired" className="font-medium text-primary underline underline-offset-4">
          Damage &amp; Expired Stock
        </Link>{' '}
        for how write-offs are recorded, and{' '}
        <Link to="/docs/financial-overview" className="font-medium text-primary underline underline-offset-4">Financial Overview</Link>{' '}
        for how the loss is applied to the result after write-offs.
      </DocsCallout>
    </DocPage>
  )
}

function DocsFormula({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="my-3 rounded-xl border border-border bg-muted/40 p-4">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 font-mono text-sm text-foreground">{children}</p>
    </div>
  )
}