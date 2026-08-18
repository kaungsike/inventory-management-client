import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, ChevronDownIcon, HelpCircleIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface FaqItem {
  question: string
  answer: string[]
}

const FAQS: FaqItem[] = [
  {
    question: 'Why can a manager only manage one warehouse?',
    answer: [
      'The system enforces "one manager, one warehouse" at the database level with a unique index on the warehouse manager column. This keeps ownership clear: each warehouse has exactly one accountable manager, and every manager knows exactly which warehouse they operate.',
      'Admins are the exception — they are global and can operate every warehouse.',
    ],
  },
  {
    question: 'Can a manager be unassigned?',
    answer: [
      'Yes. An administrator can unassign a manager, and the manager will no longer have a warehouse.',
      'When unassigned, the manager keeps the manager role but sees no warehouse data (their lists return empty), and they cannot create purchase orders or sales orders until they are assigned again. The manager role itself is never downgraded.',
    ],
  },
  {
    question: 'Can a manager access another warehouse?',
    answer: [
      'No. Managers are scoped to their assigned warehouse for reading and operating inventory, orders, transactions, and reports. The only deliberate exception is a stock transfer: a manager can transfer stock into any active warehouse, but the source must always be their own warehouse.',
    ],
  },
  {
    question: 'Does a transfer change WAC?',
    answer: [
      'No. A transfer simply moves units between warehouses at the current average cost. Two ledger entries are written (one out, one in) at the same cost, and the weighted average cost is never recalculated for transfers.',
    ],
  },
  {
    question: 'Does a write-off change WAC?',
    answer: [
      'No. Writing off damaged or expired stock records the loss at the current average cost, but the weighted average cost itself is not recalculated. Write-offs appear in the write-off report as a value = units × cost at the time of the write-off.',
    ],
  },
  {
    question: 'What happens when a PO is partially received?',
    answer: [
      'When you receive only part of a purchase order, the system keeps track of three numbers:',
      '• Ordered amount — quantity ordered × cost for every line.',
      '• Received amount — quantity actually received × cost.',
      '• Remaining amount — (quantity ordered − quantity received) × cost.',
      'The PO status becomes "partial" until every line is fully received, and over-receiving is blocked. Only the received stock actually enters inventory.',
    ],
  },
  {
    question: 'Why is PO Total Ordered different from Total Received?',
    answer: [
      'Because you have not received everything yet. For example, order 50 × $0.50 of Product A and 50 × $1.20 of Product B. Total ordered is 50×$0.50 + 50×$1.20 = $85.00.',
      'If you receive 50 of A and 40 of B, the received amount is 50×$0.50 + 40×$1.20 = $73.00, and the remaining amount is 10×$1.20 = $12.00. The original PO total of $85.00 is preserved.',
    ],
  },
  {
    question: 'How is profit calculated?',
    answer: [
      'Gross profit = net revenue − net COGS. Revenue comes from the sale price snapshotted at ship time, and COGS comes from the weighted average cost snapshotted at the same moment.',
      'Both are read from the historical inventory ledger, and both are reduced by completed returns so the profit number reflects what actually stayed sold.',
    ],
  },
  {
    question: 'What happens when a customer returns a product?',
    answer: [
      'The returned units are restored to the warehouse stock, and "return in" ledger entries are written using the original sale price and cost.',
      'In the reports, revenue and COGS are reversed, which lowers net sales and gross profit accordingly. The original sale transaction itself is never rewritten — the reversal exists as separate ledger entries. WAC is not recalculated.',
    ],
  },
  {
    question: 'Can archived products be used for new stock operations?',
    answer: [
      'No. Archived (soft-deleted) products cannot be adjusted, written off, or used in manual damage/expired transactions, and they must not appear on active sales orders. Their history remains visible in the ledger and reports, but they cannot participate in new stock movements.',
    ],
  },
]

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div key={item.question} className="overflow-hidden rounded-xl border border-border bg-card">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-medium text-foreground sm:text-base">{item.question}</span>
              <ChevronDownIcon
                className={cn('size-4 shrink-0 text-muted-foreground transition-transform', isOpen && 'rotate-180')}
              />
            </button>
            {isOpen && (
              <div className="space-y-3 border-t border-border px-5 py-4">
                {item.answer.map((paragraph, i) => (
                  <p key={i} className="text-sm leading-6 whitespace-pre-line text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function FAQPage() {
  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <Badge variant="secondary" className="mb-6 px-3 py-1">
            FAQ
          </Badge>
          <h1 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Frequently asked questions
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Answers about warehouses, managers, WAC, purchase orders, returns, and profit — verified against how the
            system actually behaves.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <FaqAccordion items={FAQS} />

        <div className="mt-12 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <HelpCircleIcon className="size-6" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Still have questions?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            The documentation covers every part of the system, from concepts to the full API reference.
          </p>
          <Button className="mt-6 gap-1.5" render={<Link to="/docs" />}>
            Browse the documentation
            <ArrowRightIcon />
          </Button>
        </div>
      </section>
    </div>
  )
}