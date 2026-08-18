import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, OL, P, Strong, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('stock-adjustments')!

export default function StockAdjustmentsPage() {
  return (
    <DocPage meta={meta}>
      <P>
        A <Strong>stock adjustment</Strong> is a manual correction of a warehouse's on-hand quantity — for example,
        after a physical count finds a difference. Adjustments record a reason and appear in the ledger.
      </P>

      <H2>How to adjust</H2>
      <OL>
        <li>Open the inventory row for the product in the warehouse.</li>
        <li>Click <Strong>Adjust Stock</Strong>.</li>
        <li>Enter the new quantity (minimum 0) and a reason.</li>
        <li>Save. The quantity is set and an <Strong>adjustment</Strong> ledger entry is written.</li>
      </OL>

      <H2>What adjustments record</H2>
      <P>
        The adjustment entry uses the product's current average cost as its unit cost. If the quantity is reduced, the
        value difference is simply the removed units' cost — the weighted average cost itself is <Strong>not</Strong>{' '}
        recalculated.
      </P>

      <H2>Rules</H2>
      <UL>
        <LI>The new quantity cannot be negative.</LI>
        <LI>A reason is required — adjustments are auditable.</LI>
        <LI>Adjusting stock for an <Strong>archived warehouse</Strong> or <Strong>archived product</Strong> is rejected.</LI>
        <LI>Managers can only adjust their assigned warehouse.</LI>
      </UL>

      <DocsCallout variant="warning" title="Use the right tool">
        For damaged or expired goods, use a <Strong>write-off</Strong> instead of an adjustment — it records the loss
        with the correct type and appears in the write-off report. See{' '}
        <Link to="/docs/damage-expired" className="font-medium text-primary underline underline-offset-4">
          Damage &amp; Expired Stock
        </Link>
        .
      </DocsCallout>
    </DocPage>
  )
}