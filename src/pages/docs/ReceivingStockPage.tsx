import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, OL, P, Strong, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('receiving-stock')!

export default function ReceivingStockPage() {
  return (
    <DocPage meta={meta}>
      <P>
        <Strong>Receiving</Strong> is how stock actually enters the system. When goods arrive from a supplier, you
        record them against the purchase order, and the system updates inventory and cost.
      </P>

      <H2>How receiving works</H2>
      <OL>
        <li>Open the purchase order and click <Strong>Receive</Strong>.</li>
        <li>Choose a receiving warehouse (the PO's warehouse is used by default).</li>
        <li>Enter the quantity received for each line.</li>
        <li>Save. Stock is added and the ledger is updated.</li>
      </OL>

      <H2>What happens behind the scenes</H2>
      <UL>
        <LI>The receiving warehouse must be active and not archived.</LI>
        <LI>Each line's <Strong>quantity received</Strong> is incremented.</LI>
        <LI>The product's weighted average cost is recalculated with the received cost.</LI>
        <LI>A <Strong>purchase</Strong> ledger entry is written with the PO number as its reference.</LI>
        <LI>If every line is fully received the PO becomes <Strong>received</Strong>; otherwise it becomes
          <Strong>partial</Strong>.</LI>
      </UL>

      <H2>Partial receiving</H2>
      <P>
        You can receive part of an order now and the rest later. The system tracks receipt progress per line and blocks
        over-receiving in two places: in the application logic and with a database check constraint that guarantees{' '}
        <Strong>quantity received is never greater than quantity ordered</Strong>.
      </P>

      <DocsCallout variant="warning" title="Cannot receive onto cancelled POs">
        Receiving onto a cancelled or already-received purchase order is rejected. If the order is cancelled, its goods
        can no longer be received through it.
      </DocsCallout>

      <H2>Financial totals</H2>
      <P>
        After a partial receive, the order shows three values: the <Strong>ordered amount</Strong> (unchanged), the{' '}
        <Strong>received amount</Strong>, and the <Strong>remaining amount</Strong>. Only the received amount represents
        stock actually in your warehouse.
      </P>

      <DocsCallout variant="note" title="Related reading">
        See <Link to="/docs/purchase-orders" className="font-medium text-primary underline underline-offset-4">Purchase Orders</Link> for the
        full worked example, and <Link to="/docs/wac" className="font-medium text-primary underline underline-offset-4">WAC &amp; Valuation</Link> for
        how receiving changes cost.
      </DocsCallout>
    </DocPage>
  )
}