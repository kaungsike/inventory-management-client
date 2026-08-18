import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, OL, P, Strong, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('customer-returns')!

export default function CustomerReturnsPage() {
  return (
    <DocPage meta={meta}>
      <P>
        A <Strong>customer return</Strong> lets you accept goods back from a customer after a sale. Returns are only
        possible against <Strong>shipped</Strong> sales orders, and the quantities are strictly limited.
      </P>

      <H2>Creating a return</H2>
      <OL>
        <li>Open <Strong>Customer Returns</Strong> and click <Strong>Create</Strong>.</li>
        <li>Pick a <Strong>shipped</Strong> sales order and the warehouse receiving the goods.</li>
        <li>Enter the quantity for each line being returned.</li>
        <li>Save the <Strong>draft</Strong> return.</li>
      </OL>

      <H2>Returnable quantity</H2>
      <P>
        For every line, the returnable quantity is computed as{' '}
        <Strong>quantity shipped − quantity already returned</Strong> (from completed returns). You cannot enter more
        than this — the system rejects it with the remaining returnable quantity.
      </P>

      <H2>Completing a return</H2>
      <P>Completing a draft return does three things:</P>
      <UL>
        <LI>Restores the returned units to the warehouse's stock.</LI>
        <LI>Writes <Strong>return_in</Strong> ledger entries using the original sale's price and cost.</LI>
        <LI>Lets the reports reverse the returned revenue and COGS.</LI>
      </UL>

      <H2>Rules</H2>
      <UL>
        <LI>Only <Strong>shipped</Strong> orders can have returned items.</LI>
        <LI>Only <Strong>draft</Strong> returns can be completed or cancelled.</LI>
        <LI>Cancelled returns never touch stock.</LI>
        <LI>The warehouse must be active and not archived.</LI>
      </UL>

      <DocsCallout variant="note" title="The original sale never changes">
        Returns add reversal rows — they never rewrite the original sale. See{' '}
        <Link to="/docs/returns-financial" className="font-medium text-primary underline underline-offset-4">
          Returns &amp; Financial Impact
        </Link>{' '}
        for the money side.
      </DocsCallout>
    </DocPage>
  )
}