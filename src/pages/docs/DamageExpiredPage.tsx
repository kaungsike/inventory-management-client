import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, OL, P, Strong, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('damage-expired')!

export default function DamageExpiredPage() {
  return (
    <DocPage meta={meta}>
      <P>
        When stock is <Strong>damaged</Strong> or <Strong>expired</Strong> it cannot be sold. Instead of a vague manual
        adjustment, the system records a <Strong>write-off</Strong> with a type and a reason.
      </P>

      <H2>Writing off stock</H2>
      <OL>
        <li>Open the inventory row for the product in the warehouse.</li>
        <li>Click <Strong>Write Off</Strong>.</li>
        <li>Choose <Strong>damage</Strong> or <Strong>expired</Strong>.</li>
        <li>Enter the quantity and a reason (max 500 characters).</li>
        <li>Save. The units are removed and a <Strong>damage</Strong> or <Strong>expired</Strong> ledger entry is
          written.</li>
      </OL>

      <H2>Financial impact</H2>
      <P>
        The write-off entry records the units' value at the <Strong>current average cost</Strong> at the time of the
        write-off. That value appears in the <Strong>Write-off Report</Strong> as quantity and value, split by type.
      </P>
      <UL>
        <LI>Write-off value = units written off × average cost at the time.</LI>
        <LI>WAC is <Strong>not</Strong> recalculated by a write-off.</LI>
        <LI>Write-offs do not affect sales revenue, COGS, or gross profit.</LI>
      </UL>

      <H2>Rules</H2>
      <UL>
        <LI>You cannot write off more than the available quantity.</LI>
        <LI>The type must be <Strong>damage</Strong> or <Strong>expired</Strong>.</LI>
        <LI>Archived warehouses and archived products cannot be written off.</LI>
        <LI>Managers can only write off their assigned warehouse.</LI>
      </UL>

      <DocsCallout variant="note" title="Related reading">
        See <Link to="/docs/write-off-reports" className="font-medium text-primary underline underline-offset-4">
          Write-off Reports
        </Link>{' '}
        for how these losses are reported.
      </DocsCallout>
    </DocPage>
  )
}