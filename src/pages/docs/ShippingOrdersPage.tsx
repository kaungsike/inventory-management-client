import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { DocsCodeBlock } from '@/components/docs/DocsCodeBlock'
import { H2, LI, OL, P, Strong, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('shipping-orders')!

export default function ShippingOrdersPage() {
  return (
    <DocPage meta={meta}>
      <P>
        <Strong>Shipping</Strong> is the moment a confirmed sales order actually removes stock from the warehouse and
        turns into revenue. It is the most guarded operation in the system.
      </P>

      <H2>How shipping works</H2>
      <OL>
        <li>Open a <Strong>confirmed</Strong> sales order.</li>
        <li>Click <Strong>Ship</Strong>.</li>
        <li>The system checks every line has enough available stock.</li>
        <li>Stock is reduced, a <Strong>sale</Strong> ledger entry is written, and the order becomes
          <Strong>shipped</Strong>.</li>
      </OL>

      <H2>Stock validation</H2>
      <P>
        For each line, the system compares the quantity ordered against the product's available quantity in the
        warehouse. If stock is short, the shipment is rejected with a message like:
      </P>
      <DocsCodeBlock
        filename="insufficient-stock"
        code={`Insufficient stock for {product}. Available: {available}, requested: {quantity_ordered}.`}
      />
      <P>
        Shipping is transactional and locks the inventory rows, so two people cannot oversell the same stock at the same
        time.
      </P>

      <H2>The cost snapshot</H2>
      <P>
        The most important detail: when an order ships, the system reads the product's <Strong>weighted average cost</Strong>{' '}
        at that exact moment and stores it on the ledger entry and the order line. That snapshot is the cost used for
        COGS and profit forever after — even if the average changes later.
      </P>

      <H2>Rules</H2>
      <UL>
        <LI>Only <Strong>confirmed</Strong> orders can be shipped.</LI>
        <LI>Shipping an already-shipped order is rejected.</LI>
        <LI>Insufficient stock blocks the shipment.</LI>
        <LI>After shipping, the order cannot be edited or cancelled.</LI>
      </UL>

      <DocsCallout variant="note" title="Related reading">
        See <Link to="/docs/sales-orders" className="font-medium text-primary underline underline-offset-4">Sales Orders</Link> for the full
        lifecycle and <Link to="/docs/wac" className="font-medium text-primary underline underline-offset-4">WAC &amp; Valuation</Link> for the
        cost snapshot.
      </DocsCallout>
    </DocPage>
  )
}