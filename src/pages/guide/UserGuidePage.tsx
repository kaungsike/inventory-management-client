import { Link } from 'react-router-dom'
import { ShieldCheckIcon, UserRoundIcon } from 'lucide-react'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, OL, P, Strong, UL } from '@/components/docs/primitives'
import { GUIDE_PAGES, guidePath, getGuideNeighbors } from '@/lib/docs'

const meta = GUIDE_PAGES[0]

export default function UserGuidePage() {
  return (
    <DocPage meta={meta} pathFn={guidePath} getNeighbors={getGuideNeighbors}>
      <P>
        This guide shows you how to use the Inventory Management System day to day. It is different from the technical
        documentation — this is about <Strong>how to do things</Strong>, not how things work behind the scenes.
      </P>

      <H2>Logging In</H2>
      <P>
        Go to <Strong>/login</Strong> and enter the email and password provided by your administrator. Passwords are at
        least 8 characters long. If your account has been deactivated, the system will tell you and you will not be able
        to sign in.
      </P>
      <OL>
        <li>Open the login page.</li>
        <li>Enter your email address.</li>
        <li>Enter your password.</li>
        <li>Click <Strong>Sign In</Strong>. You will land on the dashboard.</li>
      </OL>
      <DocsCallout variant="tip" title="Where your role takes you">
        Admins land on a dashboard that covers the whole company. Managers land on the same dashboard, but every number
        is scoped to their assigned warehouse.
      </DocsCallout>

      <H2>Dashboard Overview</H2>
      <P>
        The dashboard is your command center. It shows key figures for today and this month, recent transactions, low
        stock alerts, and the last 30 days of sales.
      </P>
      <UL>
        <LI>
          <Strong>KPI cards</Strong> — low stock count, total products, warehouses, and total inventory value.
        </LI>
        <LI>
          <Strong>Financial summary</Strong> — today and month sales, COGS, gross profit, write-offs, and returns value.
        </LI>
        <LI>
          <Strong>Sales chart</Strong> — the last 30 days of sales at a glance.
        </LI>
        <LI>
          <Strong>Recent transactions</Strong> — the latest movements from the inventory ledger.
        </LI>
        <LI>
          <Strong>Top products</Strong> — your highest-value products by inventory value.
        </LI>
      </UL>

      <H2>The guides</H2>
      <P>Pick the guide that matches your role.</P>
      <div className="my-4 grid gap-3 sm:grid-cols-2">
        <Link
          to="/guide/admin"
          className="group flex items-start gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted"
        >
          <ShieldCheckIcon className="mt-0.5 size-5 shrink-0 text-destructive" />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-foreground">Admin Guide</span>
            <span className="mt-0.5 block text-sm leading-6 text-muted-foreground">
              Users, warehouses, managers, and the catalog.
            </span>
          </span>
        </Link>
        <Link
          to="/guide/manager"
          className="group flex items-start gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted"
        >
          <UserRoundIcon className="mt-0.5 size-5 shrink-0 text-primary" />
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-foreground">Manager Guide</span>
            <span className="mt-0.5 block text-sm leading-6 text-muted-foreground">
              Stock, purchase orders, sales, returns, and reports.
            </span>
          </span>
        </Link>
      </div>

      <DocsCallout variant="note" title="New to the system?">
        Start with the <Link to="/docs/quick-start" className="font-medium text-foreground underline underline-offset-4">Quick Start</Link> guide for
        a full walkthrough from purchase to report. Then come back here for the role-specific steps.
      </DocsCallout>
    </DocPage>
  )
}