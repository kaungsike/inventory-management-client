import type * as React from 'react'
import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, P, Strong, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('financial-overview')!

export default function FinancialOverviewPage() {
  return (
    <DocPage meta={meta}>
      <P>
        The <Strong>Financial Overview</Strong> is a single page that ties together purchase spend, current inventory
        value, write-off losses, and sales profit. It answers three questions: what cash went out to buy stock, what
        that stock is worth right now, and whether selling it produced a profit after write-offs.
      </P>

      <H2>The four sections</H2>
      <UL>
        <LI>
          <Strong>Purchase Spend</Strong> — what you actually paid for stock that was received in the period. This is
          cash flow, not an expense.
        </LI>
        <LI>
          <Strong>Current Inventory Value</Strong> — the value of stock on hand right now, at weighted average cost. It
          ignores the selected date range because it is a point-in-time number.
        </LI>
        <LI>
          <Strong>Sales &amp; Cost</Strong> — gross sales, returns, and net sales, alongside net COGS, exactly as in the
          profit report.
        </LI>
        <LI>
          <Strong>Write-off Loss</Strong> — the value of damaged and expired stock, at its cost at write-off time,
          broken down by reason.
        </LI>
      </UL>

      <H2>The key formula</H2>
      <DocsFormula label="Result After Write-offs">Gross Profit − Total Write-off Loss</DocsFormula>
      <P>
        This is deliberately not called net profit. Write-offs are a genuine loss, but purchase spending never appears
        here: buying stock converts cash into inventory, it does not reduce profit.
      </P>

      <H2>A complete example</H2>
      <P>You received 100 apples at $5 each, wrote off 10, and sold 90 at $7 each:</P>
      <DocsFormula label="Purchase Spend">100 × $5 = $500</DocsFormula>
      <DocsFormula label="Inventory Value">90 × $5 = $450</DocsFormula>
      <DocsFormula label="Gross Profit">90 × ($7 − $5) = $180</DocsFormula>
      <DocsFormula label="Write-off Loss">10 × $5 = $50</DocsFormula>
      <DocsFormula label="Result After Write-offs">$180 − $50 = $130</DocsFormula>
      <P>
        Spend $500, the inventory is worth $450, the apples that sold earned $180, and the spoiled ones cost $50 — a
        result after write-offs of $130.
      </P>

      <H2>What it does not do</H2>
      <UL>
        <LI>Purchase spend is shown as cash flow — it is never subtracted as an expense or a loss.</LI>
        <LI>Inventory value is never date-filtered; it always reflects stock on hand now.</LI>
        <LI>Write-offs and returns never alter the weighted average cost of remaining stock.</LI>
      </UL>

      <DocsCallout variant="note" title="Related reading">
        See <Link to="/docs/gross-profit" className="font-medium text-primary underline underline-offset-4">Gross Profit</Link>,{' '}
        <Link to="/docs/inventory-valuation" className="font-medium text-primary underline underline-offset-4">Inventory Valuation</Link>, and{' '}
        <Link to="/docs/write-off-reports" className="font-medium text-primary underline underline-offset-4">Write-off Reports</Link>{' '}
        for the individual calculations that feed this page.
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
