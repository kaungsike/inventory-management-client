import { Link } from 'react-router-dom'
import {
  ArrowRightIcon,
  BoxesIcon,
  CalculatorIcon,
  CheckCircle2Icon,
  FileTextIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  Undo2Icon,
  WarehouseIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface FeatureSection {
  id: string
  icon: typeof BoxesIcon
  title: string
  subtitle: string
  points: string[]
}

const SECTIONS: FeatureSection[] = [
  {
    id: 'inventory',
    icon: BoxesIcon,
    title: 'Inventory',
    subtitle: 'Know exactly what you have, and where.',
    points: [
      'Stock quantities tracked per product and per warehouse',
      'Available quantity computed as quantity minus reserved',
      'Reorder points and low-stock alerts',
      'A manual adjustment tool for stock counts with a reason',
      'Write-offs for damaged and expired goods',
      'Stock can never go negative',
    ],
  },
  {
    id: 'warehouse',
    icon: WarehouseIcon,
    title: 'Warehouse',
    subtitle: 'Run multiple locations with clear ownership.',
    points: [
      'Any number of active warehouses',
      'One manager assigned to exactly one warehouse',
      'Managers can be unassigned',
      'Archive and restore warehouses',
      'Archived warehouses cannot be used for new operations',
      'Warehouse-specific stock visibility for managers',
    ],
  },
  {
    id: 'purchasing',
    icon: ShoppingCartIcon,
    title: 'Purchasing',
    subtitle: 'Buy stock from suppliers with full control.',
    points: [
      'Supplier records with contact details',
      'Purchase orders with multiple line items',
      'Partial receiving — receive part of an order now, the rest later',
      'Receipt progress tracked per line item',
      'Received and remaining financial values computed automatically',
      'Over-receiving is prevented at the database level',
    ],
  },
  {
    id: 'sales',
    icon: ShoppingBagIcon,
    title: 'Sales',
    subtitle: 'Sell and ship with confidence.',
    points: [
      'Customer records with sales history protection',
      'Sales orders with multiple line items',
      'A draft → confirmed → shipped workflow',
      'Stock validated at ship time — never oversell',
      'The WAC cost is snapshotted when an order ships',
      'Cancellation only for draft or confirmed orders',
    ],
  },
  {
    id: 'returns',
    icon: Undo2Icon,
    title: 'Returns',
    subtitle: 'Handle returns without losing the paper trail.',
    points: [
      'Returns only against shipped sales orders',
      'Returnable quantity computed from what was shipped',
      'Cannot return more than was shipped',
      'Completing a return restores stock to the warehouse',
      'The original sale record is never rewritten',
      'Revenue and COGS are reversed in reports',
    ],
  },
  {
    id: 'financial',
    icon: CalculatorIcon,
    title: 'Financial',
    subtitle: 'Reports that tie back to real transactions.',
    points: [
      'Sales report with revenue, COGS, and profit per sale',
      'Profit report with daily and monthly breakdowns',
      'Gross profit computed as net revenue minus net COGS',
      'Inventory valuation using Weighted Average Cost',
      'Returns report covering units, value, and COGS',
      'Write-off report for damage and expired stock',
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <Badge variant="secondary" className="mb-6 px-3 py-1">
            Features
          </Badge>
          <h1 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built for the full stock lifecycle
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Every feature works on top of the same append-only inventory ledger, so purchasing, sales, returns, and
            reports always agree with each other.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {SECTIONS.map((section, index) => (
            <section key={section.id} id={section.id} className="grid gap-8 lg:grid-cols-2 lg:items-start">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <section.icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">{section.title}</h2>
                  </div>
                </div>
                <p className="mt-3 text-base leading-7 text-muted-foreground">{section.subtitle}</p>
              </div>

              <ul className="space-y-2.5">
                {section.points.map((point) => (
                  <li key={point} className="flex gap-3 rounded-xl border border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
                    <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    {point}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl border border-border bg-muted/30 p-10 text-center">
          <FileTextIcon className="size-8 text-primary" />
          <h2 className="text-xl font-bold tracking-tight text-foreground">Dive deeper</h2>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            The documentation explains how each feature works behind the scenes, including the exact business rules.
          </p>
          <Button className="gap-1.5" size="lg" render={<Link to="/docs" />}>
            Open the documentation
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}