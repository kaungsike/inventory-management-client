import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, P, Strong, Table, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('inventory-ledger')!

export default function InventoryLedgerPage() {
  return (
    <DocPage meta={meta}>
      <P>
        The <Strong>inventory ledger</Strong> (the "transactions" table) is a permanent, append-only record of every
        stock movement in the system. It is the source of truth for history and for the financial reports.
      </P>

      <H2>Every movement is a row</H2>
      <P>Each ledger entry records:</P>
      <Table
        head={['Field', 'Meaning']}
        rows={[
          ['type', 'purchase, sale, transfer, adjustment, return, return_in, damage, expired.'],
          ['quantity', 'Positive for stock in, negative for stock out.'],
          ['unit_cost', 'The cost used for this movement (WAC snapshot, PO cost, etc.).'],
          ['unit_price', 'The selling price at the time (snapshots).'],
          ['warehouse_id', 'The warehouse the movement happened in.'],
          ['reference_number', 'The related order number (PO number, SO number, TRF reference, etc.).'],
          ['product_name / product_sku', 'Snapshots of the product identity at the time of the movement.'],
          ['created_at', 'When the movement happened.'],
        ]}
      />

      <H2>Append-only</H2>
      <P>
        There are no update or delete endpoints for ledger entries. Once a movement is recorded it stays forever, which
        is what makes the audit trail trustworthy and the reports reconcilable.
      </P>

      <H2>Who writes to the ledger</H2>
      <UL>
        <LI><Strong>Purchase receiving</Strong> writes a <Strong>purchase</Strong> entry and recalculates WAC.</LI>
        <LI><Strong>Shipping a sales order</Strong> writes a <Strong>sale</Strong> entry with a WAC cost snapshot.</LI>
        <LI><Strong>Transfers</Strong> write two <Strong>transfer</Strong> entries sharing one reference.</LI>
        <LI><Strong>Adjustments</Strong> write an <Strong>adjustment</Strong> entry at the current average cost.</LI>
        <LI><Strong>Write-offs</Strong> write <Strong>damage</Strong> or <Strong>expired</Strong> entries.</LI>
        <LI><Strong>Completed returns</Strong> write <Strong>return_in</Strong> entries carrying the original sale's price
          and cost.</LI>
      </UL>

      <H2>Why this matters</H2>
      <P>
        Because reports read the ledger rather than current stock levels, the numbers stay correct even after returns,
        adjustments, and write-offs. The sale that happened in January still counts for January — a later return simply
        adds a separate reversal row.
      </P>

      <DocsCallout variant="note" title="Related reading">
        The ledger is what makes <Link to="/docs/sales-revenue" className="font-medium text-primary underline underline-offset-4">Sales &amp; Revenue</Link>,
        <Link to="/docs/cogs" className="font-medium text-primary underline underline-offset-4">COGS</Link>, and{' '}
        <Link to="/docs/inventory-valuation" className="font-medium text-primary underline underline-offset-4">Inventory Valuation</Link> accurate.
      </DocsCallout>
    </DocPage>
  )
}