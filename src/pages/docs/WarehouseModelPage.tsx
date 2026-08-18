import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, OL, P, Strong, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('warehouse-model')!

export default function WarehouseModelPage() {
  return (
    <DocPage meta={meta}>
      <P>
        A <Strong>warehouse</Strong> is a physical location where stock is held. The system supports many warehouses at
        once, and almost every operation in the app is tied to a warehouse.
      </P>

      <H2>One manager per warehouse</H2>
      <P>
        Each warehouse can have exactly one manager, and each manager can run exactly one warehouse. This is enforced by
        a unique database index on the warehouse's manager column, so the rule cannot be bypassed through the API.
      </P>
      <UL>
        <LI>Assigning a manager already assigned elsewhere is rejected.</LI>
        <LI>A warehouse can have no manager at all.</LI>
        <LI>Deleting a manager user clears the assignment automatically.</LI>
      </UL>

      <H2>Unassigned warehouses and managers</H2>
      <P>
        A warehouse without a manager is simply run by admins. A manager without a warehouse keeps the manager role but
        is effectively read-only: they see no warehouse data, and creating purchase or sales orders returns an error
        until an admin assigns them.
      </P>

      <H2>Archive and restore</H2>
      <P>Archiving a warehouse soft-deletes it. The rules are strict:</P>
      <OL>
        <li>A warehouse cannot be archived while it holds any stock.</li>
        <li>It cannot be archived if it is inactive or already archived.</li>
        <li>It cannot be archived if it is the last active warehouse.</li>
        <li>Restoring checks that the name does not clash with another warehouse.</li>
      </OL>

      <H2>What an archived warehouse cannot do</H2>
      <UL>
        <LI>Receive purchase orders — "goods cannot be received into an archived warehouse."</LI>
        <LI>Be used for adjustments, transfers, or write-offs.</LI>
        <LI>Be used for new sales orders or manual transactions.</LI>
        <LI>Complete returns that need to restock it.</LI>
      </UL>
      <P>
        History is preserved: old orders and ledger entries still show the warehouse, and its inventory remains
        viewable.
      </P>

      <H2>Manager visibility</H2>
      <P>
        Managers see only their assigned warehouse in every list — inventory, transactions, purchase orders, sales
        orders, returns, and reports. The one deliberate exception is transfers: a manager can transfer stock into any
        active warehouse, but the source must always be their own.
      </P>

      <DocsCallout variant="note" title="Related reading">
        See <Link to="/docs/manager-assignment" className="font-medium text-primary underline underline-offset-4">Manager Assignment</Link> for how
        assignments work, and <Link to="/docs/authorization" className="font-medium text-primary underline underline-offset-4">Authorization</Link> for
        how scoping is enforced.
      </DocsCallout>
    </DocPage>
  )
}