import type * as React from 'react'
import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, P, Strong, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('inventory-valuation')!

export default function InventoryValuationPage() {
  return (
    <DocPage meta={meta}>
      <P>
        <Strong>Inventory valuation</Strong> answers the question "what is my current stock worth?" It multiplies each
        product's on-hand quantity by its weighted average cost.
      </P>

      <H2>The formula</H2>
      <DocsFormula label="Total Value">Σ ( quantity × average_cost )</DocsFormula>
      <P>
        The report reads the <Strong>inventory</Strong> table joined to <Strong>products</Strong>. It excludes archived
        (soft-deleted) products and rows with zero quantity, and groups the total by warehouse.
      </P>

      <H2>Example</H2>
      <UL>
        <LI>Warehouse A holds 24 units of a product with average cost $1,010 → value $24,240.</LI>
        <LI>Warehouse B holds 10 units of the same product → value $10,100.</LI>
        <LI>Total inventory value for that product = $34,340.</LI>
      </UL>

      <H2>Why WAC keeps it accurate</H2>
      <P>
        Because every purchase updates the average cost, the valuation reflects what you actually paid — blended across
        batches — rather than the original purchase price of any single batch.
      </P>

      <DocsCallout variant="note" title="Related reading">
        See <Link to="/docs/wac" className="font-medium text-primary underline underline-offset-4">WAC &amp; Valuation</Link> for how the
        average cost is maintained, and{' '}
        <Link to="/docs/financial-overview" className="font-medium text-primary underline underline-offset-4">Financial Overview</Link>{' '}
        for how this value sits alongside purchase spend and profit.
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