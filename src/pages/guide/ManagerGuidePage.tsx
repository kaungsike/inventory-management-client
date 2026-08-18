import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, OL, P, Strong } from '@/components/docs/primitives'
import { GUIDE_PAGES, guidePath, getGuideNeighbors } from '@/lib/docs'

const meta = GUIDE_PAGES.find((p) => p.slug === 'manager')!

export default function ManagerGuidePage() {
  return (
    <DocPage meta={meta} pathFn={guidePath} getNeighbors={getGuideNeighbors}>
      <P>
        This guide covers the day-to-day work of a warehouse manager. Everything you see is scoped to your assigned
        warehouse — you buy, receive, sell, ship, and adjust stock for that warehouse only.
      </P>

      <H2>Your Warehouse</H2>
      <P>
        You are assigned to exactly one warehouse. Open <Strong>Warehouses</Strong> to see it, or check the inventory
        under <Strong>Inventory</Strong> to see what is on hand. If your warehouse is missing, ask an administrator to
        assign you.
      </P>

      <H2>Managing Inventory</H2>
      <P>
        The <Strong>Inventory</Strong> page shows every product and its stock level in your warehouse. Each row shows the
        on-hand quantity and the product's reorder point. Items at or below the reorder point appear in
        <Strong> Low Stock Alerts</Strong>.
      </P>

      <H2>Creating Purchase Orders</H2>
      <OL>
        <li>Open <Strong>Purchase Orders</Strong> and click <Strong>Create</Strong>.</li>
        <li>Pick a supplier and your warehouse.</li>
        <li>Add line items — choose a product, the quantity ordered, and the unit cost.</li>
        <li>Save the order. It starts in <Strong>draft</Strong> status.</li>
        <li>Send it by changing the status to <Strong>sent</Strong>.</li>
      </OL>

      <H2>Receiving Stock</H2>
      <OL>
        <li>Open the purchase order and click <Strong>Receive</Strong>.</li>
        <li>Enter the quantity received for each line. You can receive part of an order.</li>
        <li>Save. Received stock enters your inventory and the order becomes <Strong>partial</Strong> or
          <Strong>received</Strong>.</li>
      </OL>
      <DocsCallout variant="note" title="Partial receiving">
        You cannot receive more than the remaining quantity on a line, and you cannot receive onto a cancelled or
        already-received order. The received and remaining amounts update automatically.
      </DocsCallout>

      <H2>Creating Sales Orders</H2>
      <OL>
        <li>Open <Strong>Sales Orders</Strong> and click <Strong>Create</Strong>.</li>
        <li>Pick a customer and your warehouse.</li>
        <li>Add line items — choose a product and the quantity.</li>
        <li>Save the order, then <Strong>confirm</Strong> it.</li>
      </OL>
      <P>
        Confirming checks that the customer, warehouse, and all products are active, and that the order has items.
      </P>

      <H2>Shipping Orders</H2>
      <OL>
        <li>Open a <Strong>confirmed</Strong> sales order.</li>
        <li>Click <Strong>Ship</Strong>.</li>
        <li>The system validates stock. If there is not enough, the shipment is blocked with a clear message.</li>
      </OL>
      <P>
        When an order ships, stock decreases and the cost used for COGS is snapshotted from the weighted average cost at
        that moment.
      </P>

      <H2>Processing Returns</H2>
      <OL>
        <li>Open <Strong>Customer Returns</Strong> and click <Strong>Create</Strong>.</li>
        <li>Pick a <Strong>shipped</Strong> sales order and your warehouse.</li>
        <li>Enter the quantities being returned — you cannot return more than what was shipped (less any already
          returned).</li>
        <li>Save the draft, then <Strong>complete</Strong> it to restore the stock.</li>
      </OL>
      <DocsCallout variant="tip" title="Money effect">
        Completing a return reverses the revenue and COGS of the returned units in the reports. The original sale record
        stays unchanged.
      </DocsCallout>

      <H2>Adjusting Stock</H2>
      <P>
        When a physical count differs from the system, open the inventory row and <Strong>adjust</Strong> the quantity.
        You must give a reason. An adjustment ledger entry is recorded at the current average cost.
      </P>

      <H2>Writing Off Stock</H2>
      <P>
        For damaged or expired goods, use the <Strong>Write-off</Strong> action on the inventory row. Choose
        <Strong> damage</Strong> or <Strong>expired</Strong>, enter the quantity, and explain why. The units are removed
        from stock and the loss appears in the write-off report. This does not change WAC.
      </P>

      <H2>Transferring Stock</H2>
      <OL>
        <li>Open <Strong>Transfer Stock</Strong>.</li>
        <li>Choose the product, your warehouse as the source, and any active warehouse as the destination.</li>
        <li>Enter the quantity and any notes, then transfer.</li>
      </OL>
      <P>
        The source quantity decreases, the destination increases, and two ledger entries are written. Cost is carried at
        the current average — WAC does not change.
      </P>

      <H2>Viewing Reports</H2>
      <P>
        All reports under <Strong>Reports</Strong> are available to you and are limited to your warehouse: sales, profit,
        inventory valuation, write-offs, and returns. Use the date presets to focus on today, this week, this month, or
        the last 30 days.
      </P>
    </DocPage>
  )
}