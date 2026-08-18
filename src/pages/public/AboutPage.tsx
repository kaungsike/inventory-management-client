import { Link } from 'react-router-dom'
import {
  ArrowRightIcon,
  BoxesIcon,
  DatabaseIcon,
  LayersIcon,
  MonitorSmartphoneIcon,
  PackageIcon,
  ServerIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
} from 'lucide-react'

import { SectionHeading } from '@/components/public/SectionHeading'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const PROBLEMS = [
  'No single source of truth for how much stock you have, and where.',
  'Manual spreadsheets that go out of date the moment a sale happens.',
  'No audit trail for stock movements, adjustments, or write-offs.',
  'Hard-to-answer questions about profit, inventory value, and product cost.',
  'No way to control who can operate which warehouse.',
]

const CAPABILITIES = [
  'Multi-warehouse inventory with per-product, per-warehouse stock levels',
  'Purchase orders with partial receiving and received / remaining totals',
  'Sales orders with confirmation, shipping, and stock validation',
  'Customer returns that restore stock and reverse revenue and COGS',
  'Weighted Average Cost (WAC) for accurate valuation and COGS',
  'Append-only inventory ledger for a complete, trustworthy history',
  'Financial reports: sales, profit, inventory valuation, returns, write-offs',
  'Role-based access with one manager per warehouse',
]

const TECH = [
  {
    category: 'Backend',
    items: 'Laravel + PostgreSQL + Sanctum',
    icon: ServerIcon,
    text: 'A REST API built on Laravel, using Sanctum for bearer-token authentication and PostgreSQL for data.',
  },
  {
    category: 'Frontend',
    items: 'React + TypeScript + Vite + Tailwind',
    icon: MonitorSmartphoneIcon,
    text: 'A modern single-page application with a component design system, TanStack Query, and Zustand.',
  },
  {
    category: 'Database',
    items: 'PostgreSQL',
    icon: DatabaseIcon,
    text: 'A relational schema with check constraints, unique manager assignment, and append-only ledgers.',
  },
]

export default function AboutPage() {
  return (
    <div>
      {/* Intro */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-6 px-3 py-1">
              About the project
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              A complete inventory management system
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Inventory MS manages the full lifecycle of physical stock for a multi-warehouse business — purchasing,
              receiving, selling, returning, transferring, and reporting — with an auditable transaction ledger
              underneath everything.
            </p>
          </div>
        </div>
      </section>

      {/* What & why */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="gap-4 p-6">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PackageIcon className="size-5" />
            </div>
            <CardTitle className="text-lg">What the system is</CardTitle>
            <p className="text-sm leading-6 text-muted-foreground">
              A full-stack web application where administrators and warehouse managers create purchase orders, receive
              stock, build and ship sales orders, process returns, transfer goods between warehouses, and read financial
              reports. Every operation writes to an append-only inventory ledger, so the numbers always reconcile back
              to a real history.
            </p>
          </Card>
          <Card className="gap-4 p-6">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <TrendingUpIcon className="size-5" />
            </div>
            <CardTitle className="text-lg">Why it exists</CardTitle>
            <p className="text-sm leading-6 text-muted-foreground">
              Running inventory by hand is error-prone and slow. This project exists to give a small business a single
              place to track what it owns, what it owes suppliers, what it has promised customers, and whether it is
              actually making money — without guessing.
            </p>
          </Card>
        </div>

        {/* Problems solved */}
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Problems solved"
              title="What it fixes"
              description="The day-to-day problems the system removes."
            />
            <ul className="space-y-3">
              {PROBLEMS.map((problem) => (
                <li key={problem} className="flex gap-3 rounded-xl border border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
                  <ShieldCheckIcon className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  {problem}
                </li>
              ))}
            </ul>
          </div>

          {/* Architecture */}
          <div>
            <SectionHeading
              eyebrow="Architecture"
              title="How it is built"
              description="A REST API plus a single-page client, connected by JSON."
            />
            <div className="space-y-3">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <LayersIcon className="size-4 text-primary" />
                  Backend API — Laravel
                </div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  REST endpoints under /api/v1, Sanctum authentication, role middleware, warehouse policies, and
                  services for WAC, receiving, shipping, returns, and financial reporting.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <MonitorSmartphoneIcon className="size-4 text-primary" />
                  Frontend — React
                </div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  A Vite + TypeScript single-page application with React Router, TanStack Query for data, Zustand for
                  auth state, and Tailwind CSS for a consistent design system.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <BoxesIcon className="size-4 text-primary" />
                  Every movement is a ledger entry
                </div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Purchases, sales, transfers, adjustments, returns, and write-offs all create inventory transaction
                  records. Reports read this ledger — never live spreadsheet guesses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Technology"
            title="The stack"
            description="Modern, well-supported technologies for both sides of the application."
            center
          />
          <div className="grid gap-4 md:grid-cols-3">
            {TECH.map((tech) => (
              <Card key={tech.category} className="gap-4 p-6">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <tech.icon className="size-5" />
                </div>
                <CardHeader className="gap-1 px-0 py-0">
                  <CardTitle className="text-base">{tech.category}</CardTitle>
                  <CardDescription>{tech.items}</CardDescription>
                </CardHeader>
                <p className="text-sm leading-6 text-muted-foreground">{tech.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key capabilities */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Key capabilities"
          title="What you can do"
          description="The core capabilities the system provides out of the box."
          center
        />
        <CardContent className="px-0">
          <ul className="grid gap-3 sm:grid-cols-2">
            {CAPABILITIES.map((capability) => (
              <li key={capability} className="flex gap-3 rounded-xl border border-border bg-card p-4 text-sm leading-6 text-muted-foreground">
                <ShieldCheckIcon className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                {capability}
              </li>
            ))}
          </ul>
        </CardContent>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" size="lg" render={<Link to="/features" />}>
            See all features
          </Button>
          <Button size="lg" className="gap-1.5" render={<Link to="/docs" />}>
            Read the documentation
            <ArrowRightIcon />
          </Button>
        </div>
      </section>
    </div>
  )
}