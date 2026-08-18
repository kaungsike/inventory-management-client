import type * as React from 'react'
import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, P, Strong, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('sales-revenue')!

export default function SalesRevenuePage() {
  return (
    <DocPage meta={meta}>
      <P>
        Revenue is measured from the <Strong>inventory ledger</Strong>, not from typed-in order totals. This keeps every
        report reconcilable with the real history of sales.
      </P>

      <H2>Gross sales</H2>
      <P>
        <Strong>Gross sales</Strong> is the sum of every <Strong>sale</Strong> ledger entry, using the selling price
        that was snapshotted at ship time:
      </P>
      <DocsFormula label="Gross Sales">Σ ( |quantity| × unit_price ) for type = sale</DocsFormula>

      <H2>Returns reduce revenue</H2>
      <P>
        Completed returns write <Strong>return_in</Strong> entries. Their value is subtracted from gross sales:
      </P>
      <DocsFormula label="Return Value">Σ ( |quantity| × unit_price ) for type = return_in</DocsFormula>
      <DocsFormula label="Net Sales">Gross Sales − Return Value</DocsFormula>

      <H2>Why the ledger and not orders</H2>
      <UL>
        <LI>A sale only counts when it is actually <Strong>shipped</Strong> — drafts and confirmed orders contribute
          nothing.</LI>
        <LI>Prices are the historical snapshots, so later price changes on the product do not rewrite history.</LI>
        <LI>Returns add reversal rows instead of editing the original sale, so the timing of each event stays true.</LI>
      </UL>

      <DocsCallout variant="note" title="Related reading">
        See <Link to="/docs/cogs" className="font-medium text-primary underline underline-offset-4">COGS</Link> for the cost side and{' '}
        <Link to="/docs/gross-profit" className="font-medium text-primary underline underline-offset-4">Gross Profit</Link> for how the two
        combine.
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