import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, P, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('business-rules')!

export default function BusinessRulesPage() {
  return (
    <DocPage meta={meta}>
      <P>
        These are the exact rules the system enforces, verified against the backend code. They are grouped by area for
        quick reference.
      </P>

      <H2>Warehouse rules</H2>
      <UL>
        <LI>One manager per warehouse — enforced by a unique database index.</LI>
        <LI>A manager may be unassigned; they keep the role but see no warehouse data.</LI>
        <LI>Only admins control assignments.</LI>
        <LI>An archived warehouse cannot be used for new operations (receiving, adjusting, transferring, writing off,
          selling, or restocking returns).</LI>
        <LI>A warehouse cannot be archived while it holds stock, if inactive, or if it is the last active warehouse.</LI>
      </UL>

      <H2>Inventory rules</H2>
      <UL>
        <LI>Stock can never go negative — every stock-reducing action checks available quantity.</LI>
        <LI>Inventory is tracked per product + warehouse.</LI>
        <LI>Transactions are append-only — no edits or deletes.</LI>
      </UL>

      <H2>Purchase order rules</H2>
      <UL>
        <LI>You cannot over-receive — received can never exceed ordered (app check + DB check).</LI>
        <LI>You cannot receive onto a cancelled or already-received PO.</LI>
        <LI>Partial receiving is allowed and tracked per line.</LI>
        <LI>Only received stock enters inventory; ordering alone changes nothing.</LI>
      </UL>

      <H2>Sales order rules</H2>
      <UL>
        <LI>You cannot ship more stock than is available.</LI>
        <LI>Shipment snapshots the WAC cost for COGS.</LI>
        <LI>Only draft orders are editable; only draft orders can be confirmed.</LI>
        <LI>Only confirmed orders can be shipped; already-shipped orders are locked.</LI>
      </UL>

      <H2>Return rules</H2>
      <UL>
        <LI>You cannot return more than the shipped quantity (less already returned).</LI>
        <LI>Only completed returns affect stock and reports.</LI>
        <LI>The historical sale snapshot remains unchanged.</LI>
      </UL>

      <H2>WAC rules</H2>
      <UL>
        <LI>Purchase receipts can change WAC.</LI>
        <LI>Transfers do not.</LI>
        <LI>Adjustments do not.</LI>
        <LI>Write-offs do not.</LI>
        <LI>Sales use a WAC snapshot taken at ship time.</LI>
        <LI>Returns preserve the original sale snapshot.</LI>
      </UL>

      <DocsCallout variant="warning" title="Why these matter">
        Together these rules guarantee three things: no negative stock, no lost history, and accurate money. If a rule
        looks surprising, its page under <Link to="/docs" className="font-medium text-primary underline underline-offset-4">Documentation</Link>{' '}
        explains the reasoning.
      </DocsCallout>
    </DocPage>
  )
}