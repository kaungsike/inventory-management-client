import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { ExampleBox, H2, LI, OL, P, Strong, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('inventory-transfers')!

export default function TransfersPage() {
  return (
    <DocPage meta={meta}>
      <P>
        A <Strong>transfer</Strong> moves stock from one warehouse to another — for example, restocking a busy location
        from a central one. Transfers are two-sided operations and never change cost.
      </P>

      <H2>How to transfer</H2>
      <OL>
        <li>Open <Strong>Transfer Stock</Strong>.</li>
        <li>Choose the product, the source warehouse, and the destination warehouse.</li>
        <li>Enter the quantity and any notes.</li>
        <li>Save. The source decreases, the destination increases.</li>
      </OL>

      <H2>Example</H2>
      <P>Warehouse A has 20 Apples. You transfer 5 to Warehouse B:</P>
      <ExampleBox>
        <p className="text-sm text-muted-foreground">Warehouse A: 20 → <Strong>15</Strong></p>
        <p className="text-sm text-muted-foreground">Warehouse B: previous quantity + 5 → <Strong>previous + 5</Strong></p>
        <p className="text-sm text-muted-foreground">
          Two ledger entries are written: one out of A (−5) and one into B (+5), sharing a single transfer reference.
        </p>
        <p className="text-sm text-foreground">
          WAC is <Strong>unchanged</Strong> — both entries carry the current average cost.
        </p>
      </ExampleBox>

      <H2>Rules</H2>
      <UL>
        <LI>The source and destination must be different, active, and not archived.</LI>
        <LI>The source must have enough available stock.</LI>
        <LI>Managers can only transfer <Strong>out of</Strong> their assigned warehouse; the destination can be any
          active warehouse.</LI>
        <LI>Both entries use the current average cost, so WAC is never recalculated.</LI>
      </UL>

      <DocsCallout variant="note" title="Related reading">
        Transfers write ledger entries — see{' '}
        <Link to="/docs/inventory-ledger" className="font-medium text-primary underline underline-offset-4">
          Inventory Ledger
        </Link>{' '}
        for the full picture.
      </DocsCallout>
    </DocPage>
  )
}