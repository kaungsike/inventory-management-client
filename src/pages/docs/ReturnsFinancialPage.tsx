import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, P, Strong, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('returns-financial')!

export default function ReturnsFinancialPage() {
  return (
    <DocPage meta={meta}>
      <P>
        When a customer returns a product, the sale still happened — but part of it is reversed. The system handles this
        cleanly with separate reversal entries instead of rewriting history.
      </P>

      <H2>The accounting effect</H2>
      <P>Completing a return writes <Strong>return_in</Strong> ledger entries that carry the original sale's values:</P>
      <UL>
        <LI><Strong>Revenue effect:</Strong> the returned units' value is subtracted from gross sales (net sales goes
          down).</LI>
        <LI><Strong>Cost effect:</Strong> the returned units' cost is subtracted from sales COGS (net COGS goes down).</LI>
        <LI><Strong>Profit effect:</Strong> net sales and net COGS both fall, so the gross profit effect matches the
          margin on the original sale.</LI>
      </UL>

      <H2>Worked example</H2>
      <P>You sold 1 unit at $1,100 with a cost snapshot of $1,000:</P>
      <UL>
        <LI>Revenue $1,100 · COGS $1,000 · Gross Profit <Strong>$100</Strong></LI>
        <LI>The customer returns it. The unit comes back to stock.</LI>
        <LI>Reports now show: return value $1,100, returned COGS $1,000.</LI>
        <LI>Net effect on that sale: <Strong>$0 revenue, $0 COGS, $0 profit</Strong> — the return fully reverses it.</LI>
        <LI>The original sale transaction remains unchanged in the ledger.</LI>
      </UL>

      <H2>What never changes</H2>
      <UL>
        <LI>The original <Strong>sale</Strong> ledger entry.</LI>
        <LI>The sales order and its items.</LI>
        <LI>The weighted average cost.</LI>
      </UL>

      <DocsCallout variant="note" title="Related reading">
        See <Link to="/docs/customer-returns" className="font-medium text-primary underline underline-offset-4">Customer Returns</Link> for the
        operational flow, and <Link to="/docs/gross-profit" className="font-medium text-primary underline underline-offset-4">Gross Profit</Link> for
        how the reversal lands in profit.
      </DocsCallout>
    </DocPage>
  )
}