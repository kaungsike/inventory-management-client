import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, P, Strong, Table, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('sales-orders')!

export default function SalesOrdersPage() {
  return (
    <DocPage meta={meta}>
      <P>
        A <Strong>sales order (SO)</Strong> is an order from a customer. It lists the products, quantities, and selling
        prices, and moves through a strict lifecycle before any stock changes.
      </P>

      <H2>Lifecycle</H2>
      <Table
        head={['Status', 'Meaning']}
        rows={[
          ['draft', 'Created but not confirmed. Only drafts can be edited or deleted.'],
          ['confirmed', 'Validated and ready to ship. Stock is not yet reduced.'],
          ['shipped', 'Stock removed and cost snapshotted. The sale is final.'],
          ['cancelled', 'Stopped. Only draft or confirmed orders can be cancelled.'],
        ]}
      />

      <H2>Creating an order</H2>
      <UL>
        <LI>Pick a customer and a warehouse.</LI>
        <LI>Add line items — product and quantity (the selling price can be set per line).</LI>
        <LI>Save to create the draft.</LI>
      </UL>

      <H2>Confirming</H2>
      <P>
        Confirming validates that the customer is active, the warehouse is active, the order has at least one item, and
        all products are active. Confirmed orders can no longer be edited.
      </P>

      <H2>Rules</H2>
      <UL>
        <LI>Only <Strong>draft</Strong> orders can be edited or deleted.</LI>
        <LI>Only <Strong>draft</Strong> orders can be confirmed.</LI>
        <LI>Only <Strong>draft</Strong> or <Strong>confirmed</Strong> orders can be cancelled.</LI>
        <LI>Only <Strong>confirmed</Strong> orders can be shipped.</LI>
      </UL>

      <DocsCallout variant="note" title="Stock only changes at ship time">
        Creating and confirming a sales order never touches stock. The reduction happens when the order is shipped —
        see <Link to="/docs/shipping-orders" className="font-medium text-primary underline underline-offset-4">
          Shipping Orders
        </Link>.
      </DocsCallout>
    </DocPage>
  )
}