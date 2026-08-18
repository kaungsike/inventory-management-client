import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, OL, P, Strong } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('quick-start')!

export default function QuickStartPage() {
  return (
    <DocPage meta={meta}>
      <P>
        This walkthrough takes you from sign-in to your first report in a few minutes. It assumes you already have an
        account and an assigned warehouse (ask your administrator otherwise).
      </P>

      <H2>1. Sign in</H2>
      <OL>
        <li>Open the login page.</li>
        <li>Enter the email and password your administrator gave you.</li>
        <li>Click <Strong>Sign In</Strong>. You will land on the dashboard.</li>
      </OL>
      <P>
        The dashboard shows today's and this month's financials, low stock, recent transactions, and your top products.
        If you are a manager, every number is scoped to your warehouse.
      </P>

      <H2>2. Make sure the catalog is ready</H2>
      <P>
        Products need a category and (optionally) a supplier. If they are missing:
      </P>
      <OL>
        <li>Create a category under <Strong>Categories</Strong>.</li>
        <li>Create a supplier under <Strong>Suppliers</Strong>.</li>
        <li>Create the product under <Strong>Products</Strong> with a SKU, unit price, and cost price.</li>
      </OL>

      <H2>3. Buy stock — purchase order</H2>
      <OL>
        <li>Open <Strong>Purchase Orders</Strong> and click <Strong>Create</Strong>.</li>
        <li>Pick the supplier and your warehouse.</li>
        <li>Add a line for your product with the quantity ordered and unit cost.</li>
        <li>Save the order (status <Strong>draft</Strong>), then set its status to <Strong>sent</Strong>.</li>
      </OL>

      <H2>4. Receive the goods</H2>
      <OL>
        <li>Open the purchase order and click <Strong>Receive</Strong>.</li>
        <li>Enter the quantity received. Receiving part of an order is fine.</li>
        <li>Save. Stock enters your warehouse, the weighted average cost updates, and the order becomes
          <Strong> partial</Strong> or <Strong>received</Strong>.</li>
      </OL>

      <H2>5. Sell — sales order</H2>
      <OL>
        <li>Open <Strong>Sales Orders</Strong> and click <Strong>Create</Strong>.</li>
        <li>Pick a customer and your warehouse.</li>
        <li>Add a line for your product with the quantity and selling price.</li>
        <li>Save, then <Strong>confirm</Strong> the order.</li>
        <li>Click <Strong>Ship</Strong> once you have handed the goods over. Stock decreases and the cost is
          snapshotted.</li>
      </OL>

      <H2>6. Check the reports</H2>
      <OL>
        <li>Open <Strong>Sales Report</Strong> to see the revenue from your sale.</li>
        <li>Open <Strong>Profit Report</Strong> to see the gross profit (revenue minus cost).</li>
        <li>Open <Strong>Inventory Valuation</Strong> to see what your remaining stock is worth.</li>
      </OL>

      <DocsCallout variant="tip" title="Worked example">
        Order 50 units of Product A at $0.50 and 50 units of Product B at $1.20, then receive all of A and 40 of B. The
        ordered total is $85.00, the received amount is $73.00, and the remaining amount is $12.00. The original $85.00
        total is preserved. See{' '}
        <Link to="/docs/purchase-orders" className="font-medium text-primary underline underline-offset-4">
          Purchase Orders
        </Link>{' '}
        for the full walkthrough.
      </DocsCallout>
    </DocPage>
  )
}