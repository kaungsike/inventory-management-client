import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { DocsCodeBlock } from '@/components/docs/DocsCodeBlock'
import { ExampleBox, H2, LI, P, Strong, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('wac')!

export default function WACPage() {
  return (
    <DocPage meta={meta}>
      <P>
        <Strong>Weighted Average Cost (WAC)</Strong> is how the system tracks the cost of a product over time. Instead
        of tracking each batch separately, every product has a single average cost that is recalculated when new stock
        is purchased. This average is used for inventory valuation and for the cost of goods sold.
      </P>

      <H2>The formula</H2>
      <P>When goods are received, the new average is computed like this:</P>
      <DocsCodeBlock
        filename="weighted-average-cost"
        code={`new_average =
  (old_quantity * old_average + received_quantity * unit_cost)
  / (old_quantity + received_quantity)`}
      />
      <P>
        The calculation uses exact decimal arithmetic and rounds to two decimal places (half-up), so no floating-point
        errors leak into the financial values.
      </P>

      <H2>Example</H2>
      <P>You start with 20 units at a cost of $1,000 each:</P>
      <ExampleBox>
        <p className="text-sm text-muted-foreground">
          On hand: <Strong>20</Strong> units · Average cost: <Strong>$1,000.00</Strong>
        </p>
      </ExampleBox>
      <P>You then buy 5 more units at $1,050 each:</P>
      <DocsCodeBlock
        filename="wac-recalculation"
        code={`new_average = (20 * 1,000 + 5 * 1,050) / (20 + 5)
            = (20,000 + 5,250) / 25
            = 25,250 / 25
            = 1,010.00`}
      />
      <ExampleBox>
        <p className="text-sm text-muted-foreground">
          On hand: <Strong>25</Strong> units · Average cost: <Strong>$1,010.00</Strong>
        </p>
      </ExampleBox>
      <P>Now you sell 1 unit for $1,100. The cost snapshot is the current WAC:</P>
      <UL>
        <LI>Revenue = 1 × $1,100 = <Strong>$1,100.00</Strong></LI>
        <LI>Cost (COGS) = 1 × $1,010 = <Strong>$1,010.00</Strong></LI>
        <LI>Gross Profit = $1,100 − $1,010 = <Strong>$90.00</Strong></LI>
        <LI>Remaining inventory = 24 units × $1,010 = <Strong>$24,240.00</Strong></LI>
      </UL>

      <H2>What changes WAC — and what does not</H2>
      <UL>
        <LI><Strong>Purchase receipts change WAC.</Strong> Only incoming purchases recalculate the average.</LI>
        <LI><Strong>Transfers do not</Strong> — they carry the current average between warehouses.</LI>
        <LI><Strong>Adjustments do not</Strong> — they record at the current average.</LI>
        <LI><Strong>Write-offs do not</Strong> — the loss is recorded at the current average.</LI>
        <LI><Strong>Sales do not</Strong> — the average is only snapshotted for COGS.</LI>
        <LI><Strong>Returns do not</Strong> — they restore stock at the original sale values.</LI>
      </UL>

      <DocsCallout variant="note" title="One average per product">
        The average cost is a single value per product across all warehouses. It is used whenever a movement needs a
        cost: valuation, COGS, write-off value, and so on.
      </DocsCallout>

      <H2>Related reading</H2>
      <UL>
        <LI>
          <Link to="/docs/cogs" className="font-medium text-primary underline underline-offset-4">COGS</Link> — how the
          average becomes the cost of what you sell.
        </LI>
        <LI>
          <Link to="/docs/inventory-valuation" className="font-medium text-primary underline underline-offset-4">
            Inventory Valuation
          </Link>{' '}
          — how the average values your stock.
        </LI>
      </UL>
    </DocPage>
  )
}