import type * as React from 'react'
import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, P, Strong } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('gross-profit')!

export default function GrossProfitPage() {
  return (
    <DocPage meta={meta}>
      <P>
        <Strong>Gross profit</Strong> is the money you make from selling before other expenses. It is simply revenue
        minus the cost of the goods sold.
      </P>

      <H2>The formula</H2>
      <DocsFormula label="Gross Profit">Net Sales − Net COGS</DocsFormula>
      <DocsFormula label="Gross Margin">( Gross Profit ÷ Net Sales ) × 100</DocsFormula>
      <P>
        Margin is only computed when Net Sales is greater than zero. Both sales and COGS are net of completed returns,
        so profit reflects what actually stayed sold.
      </P>

      <H2>A complete example</H2>
      <P>You sold 1 unit for $1,100 and its cost snapshot was $1,010:</P>
      <DocsFormula label="Revenue">1 × $1,100 = $1,100</DocsFormula>
      <DocsFormula label="COGS">1 × $1,010 = $1,010</DocsFormula>
      <DocsFormula label="Gross Profit">$1,100 − $1,010 = $90</DocsFormula>
      <DocsFormula label="Gross Margin">($90 ÷ $1,100) × 100 ≈ 8.18%</DocsFormula>

      <H2>Where you see it</H2>
      <P>
        The <Strong>Profit Report</Strong> shows gross profit and margin with daily and monthly breakdowns. The{' '}
        <Strong>Sales Report</Strong> shows revenue, COGS, and gross profit per individual sale.
      </P>

      <DocsCallout variant="note" title="Related reading">
        See <Link to="/docs/sales-revenue" className="font-medium text-primary underline underline-offset-4">Sales &amp; Revenue</Link> and{' '}
        <Link to="/docs/cogs" className="font-medium text-primary underline underline-offset-4">COGS</Link> for the two inputs, and{' '}
        <Link to="/docs/returns-financial" className="font-medium text-primary underline underline-offset-4">Returns &amp; Financial Impact</Link>{' '}
        for how returns affect both.
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