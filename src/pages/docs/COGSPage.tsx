import type * as React from 'react'
import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, P, Strong, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('cogs')!

export default function COGSPage() {
  return (
    <DocPage meta={meta}>
      <P>
        <Strong>Cost of Goods Sold (COGS)</Strong> is what it cost you to sell the goods you sold. The system computes
        it from the cost snapshot taken at ship time — which is the product's weighted average cost at that moment.
      </P>

      <H2>The formula</H2>
      <DocsFormula label="Sales COGS">Σ ( |quantity| × unit_cost ) for type = sale</DocsFormula>
      <P>
        The <Strong>unit_cost</Strong> on a sale entry is the WAC snapshot. Because it is stored on the ledger row, it
        never changes even if the average cost is later recalculated by a new purchase.
      </P>

      <H2>Returns lower COGS</H2>
      <DocsFormula label="Returned COGS">Σ ( |quantity| × unit_cost ) for type = return_in</DocsFormula>
      <DocsFormula label="Net COGS">Sales COGS − Returned COGS</DocsFormula>

      <H2>Why the snapshot matters</H2>
      <UL>
        <LI>If you buy 20 units at $1,000 then 5 more at $1,050, the average becomes $1,010.</LI>
        <LI>A sale right after ships with a COGS of $1,010 per unit — that exact number is stored on the sale.</LI>
        <LI>Later purchases change the average, but past sales keep their original snapshot.</LI>
      </UL>

      <DocsCallout variant="note" title="Related reading">
        See <Link to="/docs/wac" className="font-medium text-primary underline underline-offset-4">WAC &amp; Valuation</Link> for the formula and{' '}
        <Link to="/docs/gross-profit" className="font-medium text-primary underline underline-offset-4">Gross Profit</Link> for how COGS feeds
        profit.
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