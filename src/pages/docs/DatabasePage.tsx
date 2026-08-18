import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, P, Strong, Table, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('database')!

export default function DatabasePage() {
  return (
    <DocPage meta={meta}>
      <P>
        The system uses <Strong>PostgreSQL</Strong>. The schema is relational, with strong constraints that protect
        business rules at the database level.
      </P>

      <H2>Core tables</H2>
      <Table
        head={['Table', 'Purpose']}
        rows={[
          ['users', 'Accounts with role (admin or manager, enforced by a check constraint).'],
          ['warehouses', 'Locations. One manager per warehouse (unique index on manager id).'],
          ['products', 'Catalog items with SKU, prices, and status. Soft-deletable.'],
          ['categories', 'Product groupings.'],
          ['suppliers / customers', 'The parties you buy from and sell to.'],
          ['inventory', 'One row per product + warehouse with quantity and reorder hints.'],
          ['inventory_transactions', 'The append-only ledger of every stock movement.'],
          ['purchase_orders / purchase_order_items', 'Supplier orders with a check that received ≤ ordered.'],
          ['sales_orders / sales_order_items', 'Customer orders with shipped quantities and cost snapshots.'],
          ['customer_returns / customer_return_items', 'Returns with returnable-quantity enforcement.'],
          ['personal_access_tokens', 'Sanctum bearer tokens.'],
          ['activity_logs', 'The append-only audit trail.'],
        ]}
      />

      <H2>Constraints that enforce rules</H2>
      <UL>
        <LI>A <Strong>check constraint</Strong> limits roles to admin or manager.</LI>
        <LI>A <Strong>unique index</Strong> on warehouses.manager_id enforces one manager per warehouse.</LI>
        <LI>A <Strong>check constraint</Strong> guarantees quantity received ≤ quantity ordered on PO items.</LI>
        <LI>Ledger transactions have no update or delete endpoints — the history is permanent.</LI>
        <LI>Warehouses, products, and several other tables use <Strong>soft deletes</Strong> so history survives.</LI>
      </UL>

      <H2>Relationships at a glance</H2>
      <UL>
        <LI>products → categories, suppliers; products ↔ warehouses through inventory.</LI>
        <LI>purchase_orders → suppliers, warehouses; items → products.</LI>
        <LI>sales_orders → customers, warehouses; items → products.</LI>
        <LI>customer_returns → sales_orders, warehouses; items → products.</LI>
        <LI>inventory_transactions → products, warehouses.</LI>
      </UL>

      <DocsCallout variant="note" title="Related reading">
        See <Link to="/docs/architecture" className="font-medium text-primary underline underline-offset-4">Architecture</Link> for how the
        database fits into the stack.
      </DocsCallout>
    </DocPage>
  )
}