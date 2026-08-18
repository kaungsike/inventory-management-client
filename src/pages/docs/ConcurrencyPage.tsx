import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, P, Strong, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('concurrency')!

export default function ConcurrencyPage() {
  return (
    <DocPage meta={meta}>
      <P>
        Stock is money. If two people ship the same product at the same time, the system must not oversell. It prevents
        this with <Strong>database transactions</Strong> and <Strong>row locking</Strong>.
      </P>

      <H2>Transactions</H2>
      <P>
        Every stock-affecting operation runs inside a database transaction. If any step fails, the whole change is
        rolled back — stock, ledger entries, order status, and audit logs move together or not at all.
      </P>

      <H2>Row locking</H2>
      <P>
        Before reading or changing stock, the operation locks the relevant rows with{' '}
        <Strong>SELECT ... FOR UPDATE</Strong>. A second request for the same product waits until the first finishes,
        then reads the fresh values.
      </P>
      <UL>
        <LI>Shipping locks the order, its items, and each product's inventory.</LI>
        <LI>Receiving locks the PO, its items, and each product.</LI>
        <LI>Transfers and write-offs lock the product and the inventory rows.</LI>
        <LI>PO items are sorted by product id before locking to avoid deadlocks.</LI>
      </UL>

      <H2>Guards on top of locks</H2>
      <UL>
        <LI>Available-quantity checks run <Strong>after</Strong> the lock, so the value is current.</LI>
        <LI>PO items have a database check (received ≤ ordered) as a second line of defense.</LI>
        <LI>The average cost is read inside the same transaction that updates it, so snapshots are consistent.</LI>
      </UL>

      <DocsCallout variant="note" title="Related reading">
        See <Link to="/docs/shipping-orders" className="font-medium text-primary underline underline-offset-4">Shipping Orders</Link> and{' '}
        <Link to="/docs/receiving-stock" className="font-medium text-primary underline underline-offset-4">Receiving Stock</Link> for the
        operations that rely on locking.
      </DocsCallout>
    </DocPage>
  )
}