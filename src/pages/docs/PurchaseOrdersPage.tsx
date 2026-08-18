import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { ExampleBox, H2, LI, P, Strong, Table, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('purchase-orders')!

export default function PurchaseOrdersPage() {
  return (
    <DocPage meta={meta}>
      <P>
        A <Strong>purchase order (PO)</Strong> is an order you place with a supplier. It lists the products you want,
        the quantity ordered, and the unit cost of each. POs are created by admins and managers and are scoped to a
        warehouse.
      </P>

      <H2>Line items and totals</H2>
      <UL>
        <LI>Each line references a product, a quantity ordered, and a unit cost.</LI>
        <LI><Strong>Total ordered</Strong> is the sum of quantity ordered × unit cost, stored when the PO is created.</LI>
        <LI><Strong>Received amount</Strong> is the sum of quantity received × unit cost.</LI>
        <LI><Strong>Remaining amount</Strong> is the sum of (quantity ordered − quantity received) × unit cost.</LI>
        <LI>Ordered = received + remaining, always.</LI>
      </UL>

      <H2>PO statuses</H2>
      <Table
        head={['Status', 'Meaning']}
        rows={[
          ['draft', 'Created but not yet sent. Can be edited.'],
          ['sent', 'Sent to the supplier. Ready to receive.'],
          ['partial', 'At least one line has been partially received.'],
          ['received', 'Every line fully received.'],
          ['cancelled', 'No longer valid. Cannot receive onto a cancelled PO.'],
        ]}
      />
      <P>Statuses move in a strict order: draft → sent → partial → received, with cancel allowed from draft, sent, or
        partial.</P>

      <H2>Partial receiving example</H2>
      <P>This is the exact example used across the system:</P>
      <ExampleBox>
        <p className="text-sm text-muted-foreground">Order 50 units of Product A at $0.50 and 50 units of Product B at $1.20.</p>
        <p className="text-sm text-foreground">
          Total ordered = 50×$0.50 + 50×$1.20 = $25 + $60 = <Strong>$85.00</Strong>
        </p>
        <p className="text-sm text-muted-foreground">Receive 50 of A and 40 of B.</p>
        <p className="text-sm text-foreground">
          Received = 50×$0.50 + 40×$1.20 = $25 + $48 = <Strong>$73.00</Strong>
        </p>
        <p className="text-sm text-foreground">
          Remaining = 10×$1.20 = <Strong>$12.00</Strong>
        </p>
        <p className="text-sm text-muted-foreground">
          The original PO total of <Strong>$85.00</Strong> is preserved. The PO becomes <Strong>partial</Strong> until
          the last 10 units of B are received.
        </p>
      </ExampleBox>
      <P>
        Received and remaining values are computed by the server from the line items — the frontend never guesses them.
      </P>

      <H2>Rules</H2>
      <UL>
        <LI>You cannot receive more than the remaining quantity on a line.</LI>
        <LI>You cannot receive onto a <Strong>cancelled</Strong> or already-<Strong>received</Strong> PO.</LI>
        <LI>Only received stock enters inventory — ordering alone never changes stock.</LI>
        <LI>A manager creating a PO must be assigned to a warehouse.</LI>
      </UL>

      <DocsCallout variant="note" title="Why total ordered can differ from received">
        Because you may receive an order in parts, the received amount can be less than the ordered amount. The
        difference is the remaining amount — see the example above. See also{' '}
        <Link to="/docs/receiving-stock" className="font-medium text-primary underline underline-offset-4">
          Receiving Stock
        </Link>
        .
      </DocsCallout>
    </DocPage>
  )
}