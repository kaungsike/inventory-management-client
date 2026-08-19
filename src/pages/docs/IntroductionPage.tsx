import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, P, Strong, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('')!

export default function IntroductionPage() {
  return (
    <DocPage meta={meta}>
      <P>
        The <Strong>Inventory Management System</Strong> is a full-stack application for businesses that hold physical
        stock in one or more warehouses. It manages the entire lifecycle of a product: buying it from a supplier,
        receiving it into stock, selling and shipping it to a customer, handling returns, moving it between warehouses,
        and reporting on the money involved.
      </P>

      <H2>What it manages</H2>
      <UL>
        <LI><Strong>Products</Strong> — the catalog of items with SKUs, categories, suppliers, and prices.</LI>
        <LI><Strong>Warehouses</Strong> — the physical locations where stock is held.</LI>
        <LI><Strong>Purchasing</Strong> — purchase orders and receiving goods, in full or in part.</LI>
        <LI><Strong>Sales</Strong> — sales orders, confirmation, and shipping with stock validation.</LI>
        <LI><Strong>Inventory</Strong> — per-warehouse stock levels, transfers, adjustments, and write-offs.</LI>
        <LI><Strong>Returns</Strong> — customer returns that restore stock and reverse revenue.</LI>
        <LI><Strong>Stock movements</Strong> — every change recorded in an append-only transaction ledger.</LI>
        <LI><Strong>Financial reports</Strong> — sales, COGS, gross profit, inventory valuation, returns, write-offs, and a financial overview.</LI>
      </UL>

      <H2>Why the design matters</H2>
      <P>
        Three ideas shape the whole system. First, <Strong>everything is a ledger entry</Strong> — purchases, sales,
        transfers, adjustments, returns, and write-offs all create records that are never edited or deleted, so the
        numbers can always be traced back to a real event. Second, <Strong>stock cannot go negative</Strong> — every
        action that removes stock checks availability first and locks rows to prevent races. Third, <Strong>cost is
        tracked with Weighted Average Cost (WAC)</Strong>, so inventory value and the cost of goods sold stay accurate
        over time.
      </P>

      <H2>Two roles</H2>
      <P>
        The system has exactly two roles. <Strong>Admins</Strong> run everything — users, warehouses, and every
        warehouse's operations. <Strong>Managers</Strong> operate exactly one warehouse and see only that warehouse's
        data.
      </P>

      <H2>Where to go next</H2>
      <UL>
        <LI>
          <Link className="font-medium text-primary underline-offset-4 hover:underline" to="/docs/quick-start">
            Quick Start
          </Link>{' '}
          — run your first purchase, sale, and report.
        </LI>
        <LI>
          <Link className="font-medium text-primary underline-offset-4 hover:underline" to="/docs/system-overview">
            System Overview
          </Link>{' '}
          — a tour of every module.
        </LI>
        <LI>
          <Link className="font-medium text-primary underline-offset-4 hover:underline" to="/docs/wac">
            WAC & Valuation
          </Link>{' '}
          — how cost is calculated.
        </LI>
        <LI>
          <Link className="font-medium text-primary underline-offset-4 hover:underline" to="/guide">
            User Guide
          </Link>{' '}
          — step-by-step instructions for using the system.
        </LI>
      </UL>

      <DocsCallout variant="tip" title="Reading this documentation">
        Every page matches how the running system actually behaves — formulas, rules, and endpoints were verified
        against the source code.
      </DocsCallout>
    </DocPage>
  )
}