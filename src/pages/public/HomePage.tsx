import { Link } from 'react-router-dom'
import {
  ArrowLeftRightIcon,
  ArrowRightIcon,
  BarChart3Icon,
  BoxesIcon,
  CalculatorIcon,
  CheckCircle2Icon,
  PackageCheckIcon,
  ShieldCheckIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  TruckIcon,
  Undo2Icon,
  UserRoundIcon,
  WarehouseIcon,
} from 'lucide-react'

import { SectionHeading } from '@/components/public/SectionHeading'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'

const FEATURES = [
  {
    icon: BoxesIcon,
    title: 'Inventory Management',
    text: 'Track stock per warehouse with quantities, reorder points, and low-stock alerts.',
  },
  {
    icon: WarehouseIcon,
    title: 'Warehouse Management',
    text: 'Run multiple warehouses, assign managers, and archive warehouses you no longer use.',
  },
  {
    icon: ShoppingCartIcon,
    title: 'Purchase Orders',
    text: 'Order from suppliers and receive goods in full or in part with clear financial totals.',
  },
  {
    icon: ShoppingBagIcon,
    title: 'Sales Orders',
    text: 'Create, confirm, and ship customer orders with stock validation at every step.',
  },
  {
    icon: Undo2Icon,
    title: 'Customer Returns',
    text: 'Process returns against shipped orders, restore stock, and reverse the financial impact.',
  },
  {
    icon: ArrowLeftRightIcon,
    title: 'Stock Transfers',
    text: 'Move inventory between warehouses with two ledger entries and no cost change.',
  },
  {
    icon: BarChart3Icon,
    title: 'Financial Reports',
    text: 'Sales, profit, inventory valuation, returns, and write-off reports from the ledger.',
  },
  {
    icon: CalculatorIcon,
    title: 'WAC Valuation',
    text: 'Weighted Average Cost keeps inventory value and COGS accurate over time.',
  },
]

const HOW_IT_WORKS = [
  { label: 'Purchase', text: 'Order stock from suppliers', icon: ShoppingCartIcon },
  { label: 'Inventory', text: 'Receive and store goods', icon: BoxesIcon },
  { label: 'Sales', text: 'Confirm and ship orders', icon: ShoppingBagIcon },
  { label: 'Returns', text: 'Handle customer returns', icon: Undo2Icon },
  { label: 'Reports', text: 'Review sales and profit', icon: BarChart3Icon },
]

const LIFECYCLE = [
  {
    icon: PackageCheckIcon,
    title: 'Receive goods',
    text: 'Goods arrive from a supplier against a purchase order. Stock increases and WAC updates.',
  },
  {
    icon: BoxesIcon,
    title: 'Store per warehouse',
    text: 'Every unit lives in a warehouse inventory row. Managers operate only their assigned warehouse.',
  },
  {
    icon: TruckIcon,
    title: 'Ship orders',
    text: 'Confirmed sales orders ship when stock is available. The cost is snapshotted at ship time.',
  },
  {
    icon: Undo2Icon,
    title: 'Process returns',
    text: 'Returned goods come back to stock with the original sale values preserved.',
  },
  {
    icon: BarChart3Icon,
    title: 'Report on everything',
    text: 'Sales, COGS, gross profit, inventory valuation, and write-offs come straight from the ledger.',
  },
]

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
          <Badge variant="secondary" className="mb-6 px-3 py-1">
            Full-stack inventory management
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Inventory Management Made Simple
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Manage products, warehouses, purchasing, sales, inventory, returns, stock movements, and financial reports —
            all in one system built with Laravel, PostgreSQL, React, and TypeScript.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="gap-1.5" render={<Link to={isAuthenticated ? '/dashboard' : '/login'} />}>
              Get Started
              <ArrowRightIcon />
            </Button>
            <Button size="lg" variant="outline" render={<Link to="/docs" />}>
              Documentation
            </Button>
            {isAuthenticated ? (
              <Button size="lg" variant="secondary" render={<Link to="/dashboard" />}>
                Dashboard
              </Button>
            ) : (
              <Button size="lg" variant="secondary" render={<Link to="/login" />}>
                Login
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Feature overview */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to run inventory"
          description="From purchasing to reporting, the system covers the full lifecycle of physical stock."
          center
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="gap-3 p-5">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="size-5" />
              </div>
              <CardTitle className="text-base">{feature.title}</CardTitle>
              <p className="text-sm leading-6 text-muted-foreground">{feature.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How it works"
            title="A clear flow from purchase to report"
            description="Stock moves through a simple, auditable pipeline. Every step writes to the inventory ledger."
            center
          />
          <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-center">
            {HOW_IT_WORKS.map((step, index) => (
              <div key={step.label} className="flex flex-1 items-center gap-4 lg:flex-col lg:gap-3">
                <div className="flex flex-1 flex-col items-start gap-3 rounded-xl border border-border bg-background p-5 lg:items-center lg:text-center">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <step.icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      <span className="mr-1.5 text-muted-foreground">{index + 1}.</span>
                      {step.label}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{step.text}</p>
                  </div>
                </div>
                {index < HOW_IT_WORKS.length - 1 && (
                  <ArrowRightIcon className="hidden size-5 shrink-0 text-muted-foreground lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role overview */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Roles"
          title="Two roles, clear separation"
          description="Administrators run the whole system. Managers run exactly one warehouse."
          center
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="gap-4 p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <ShieldCheckIcon className="size-5" />
              </div>
              <div>
                <CardTitle className="text-base">Admin</CardTitle>
                <p className="text-xs text-muted-foreground">Global access</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" /> Manage users and assign managers</li>
              <li className="flex gap-2"><CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" /> Create and archive warehouses</li>
              <li className="flex gap-2"><CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" /> See and operate every warehouse</li>
              <li className="flex gap-2"><CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" /> Full access to reports and activity logs</li>
            </ul>
          </Card>

          <Card className="gap-4 p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UserRoundIcon className="size-5" />
              </div>
              <div>
                <CardTitle className="text-base">Manager</CardTitle>
                <p className="text-xs text-muted-foreground">Scoped to one warehouse</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" /> Assigned to exactly one warehouse</li>
              <li className="flex gap-2"><CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" /> Purchase, receive, sell, and ship for their warehouse</li>
              <li className="flex gap-2"><CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" /> Adjust, write off, and transfer stock</li>
              <li className="flex gap-2"><CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" /> Reports limited to their warehouse</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Inventory lifecycle */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Lifecycle"
            title="The journey of a product"
            description="Every unit follows the same auditable path through the system."
            center
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {LIFECYCLE.map((step, index) => (
              <Card key={step.title} className="gap-3 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <step.icon className="size-4.5" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">{index + 1}/5</span>
                </div>
                <CardTitle className="text-sm">{step.title}</CardTitle>
                <p className="text-xs leading-5 text-muted-foreground">{step.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-muted/30 p-10 text-center sm:p-16">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Explore the Documentation
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-muted-foreground">
            Learn about WAC, purchasing, receiving, sales, returns, business rules, and the full API reference.
          </p>
          <Button size="lg" className="mt-8 gap-1.5" render={<Link to="/docs" />}>
            Documentation
            <ArrowRightIcon />
          </Button>
        </div>
      </section>
    </div>
  )
}