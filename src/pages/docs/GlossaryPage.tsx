import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, P } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('glossary')!

interface Term {
  term: string
  definition: string
}

const TERMS: Term[] = [
  { term: 'WAC (Weighted Average Cost)', definition: 'A single blended cost per product. When you buy stock at a different price, the average is recalculated. Used to value inventory and calculate the cost of what you sell.' },
  { term: 'COGS (Cost of Goods Sold)', definition: 'What it cost you to sell the goods you sold. Calculated from the WAC snapshot taken when each sale was shipped.' },
  { term: 'SKU (Stock Keeping Unit)', definition: 'A unique code that identifies a product in the system, like a barcode or internal part number.' },
  { term: 'PO (Purchase Order)', definition: 'An order you place with a supplier to buy stock. It lists what you ordered, how much you paid, and how much you have received.' },
  { term: 'SO (Sales Order)', definition: 'An order a customer places with you. It moves from draft to confirmed to shipped, and only changes stock when shipped.' },
  { term: 'Inventory', definition: 'The stock you currently hold, tracked per product and per warehouse.' },
  { term: 'Available Quantity', definition: 'How much stock you can actually sell or use: quantity minus reserved quantity, never below zero.' },
  { term: 'Reserved Quantity', definition: 'Stock that is set aside (reserved) for a future purpose. The system tracks it as a column, and available quantity subtracts it.' },
  { term: 'Ledger', definition: 'The append-only list of every stock movement (the "transactions" table). Once recorded, a movement is never edited or deleted.' },
  { term: 'Write-off', definition: 'Removing damaged or expired stock from inventory and recording the loss.' },
  { term: 'Return', definition: 'Goods a customer sends back. Completing a return restores stock and reverses the revenue and COGS of the returned units.' },
  { term: 'Gross Sales', definition: 'The total value of everything you shipped, before any returns are subtracted.' },
  { term: 'Net Sales', definition: 'Gross sales minus the value of completed returns — the revenue you actually keep.' },
  { term: 'Gross Profit', definition: 'Net sales minus net COGS. The money you make from selling, before other expenses.' },
  { term: 'Margin', definition: 'Gross profit expressed as a percentage of net sales.' },
  { term: 'Stock Transfer', definition: 'Moving stock from one warehouse to another. Two ledger entries are written and cost does not change.' },
  { term: 'Snapshot', definition: 'A value captured at a specific moment and stored, so future changes do not rewrite history. Sales snapshot the WAC cost at ship time.' },
  { term: 'Soft Delete', definition: 'Marking a record as deleted without physically removing it. Used for products, warehouses, and orders so history survives.' },
]

export default function GlossaryPage() {
  return (
    <DocPage meta={meta}>
      <P>
        Plain-language definitions of every term used in the system. Each one links to a page that explains it in more
        detail.
      </P>

      <H2>Terms</H2>
      <dl className="grid gap-3 sm:grid-cols-2">
        {TERMS.map((item) => (
          <div key={item.term} className="rounded-xl border border-border bg-card p-4">
            <dt className="text-sm font-semibold text-foreground">{item.term}</dt>
            <dd className="mt-1.5 text-sm leading-6 text-muted-foreground">{item.definition}</dd>
          </div>
        ))}
      </dl>

      <DocsCallout variant="note" title="Go deeper">
        Start with <Link to="/docs/wac" className="font-medium text-primary underline underline-offset-4">WAC &amp; Valuation</Link> and{' '}
        <Link to="/docs/inventory-ledger" className="font-medium text-primary underline underline-offset-4">Inventory Ledger</Link> — the two
        ideas everything else builds on.
      </DocsCallout>
    </DocPage>
  )
}