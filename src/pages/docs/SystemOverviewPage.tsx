import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, P, Strong, Table, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('system-overview')!

export default function SystemOverviewPage() {
  return (
    <DocPage meta={meta}>
      <P>
        The system is organized into a few related modules that all work on top of the same inventory ledger. This page
        gives you the lay of the land.
      </P>

      <H2>Catalog</H2>
      <P>
        The catalog is everything you buy and sell: <Strong>products</Strong> (with SKUs, prices, and a preferred
        supplier), <Strong>categories</Strong>, <Strong>suppliers</Strong>, and <Strong>customers</Strong>.
      </P>

      <H2>Operations</H2>
      <UL>
        <LI>
          <Strong>Warehouses</Strong> — where stock lives. Admins create and archive warehouses and assign one manager
          to each.
        </LI>
        <LI>
          <Strong>Inventory</Strong> — one row per product per warehouse, with quantity, reserved quantity, and a
          reorder point.
        </LI>
        <LI>
          <Strong>Purchase Orders</Strong> — orders placed with suppliers, with partial receiving and received /
          remaining totals.
        </LI>
        <LI>
          <Strong>Sales Orders</Strong> — orders from customers that move from draft → confirmed → shipped.
        </LI>
        <LI>
          <Strong>Transfers, Adjustments, Write-offs</Strong> — ways stock moves or changes within a warehouse.
        </LI>
      </UL>

      <H2>Returns</H2>
      <P>
        Customer returns are tied to shipped sales orders. Completing a return restores stock to the warehouse and
        reverses the revenue and COGS of the returned units in the reports.
      </P>

      <H2>Financial reports</H2>
      <P>
        All reports read the historical ledger rather than live inventory. They are restricted to admins and managers:
        sales, profit, inventory valuation, write-offs, and returns.
      </P>

      <H2>Administration</H2>
      <UL>
        <LI><Strong>User Management</Strong> — admins create and manage accounts.</LI>
        <LI><Strong>Activity Logs</Strong> — an append-only audit trail of actions.</LI>
      </UL>

      <H2>How the modules connect</H2>
      <Table
        head={['Event', 'What happens to stock', 'What is recorded']}
        rows={[
          ['Purchase order received', 'Inventory increases', 'purchase ledger entry; WAC recalculated'],
          ['Sales order shipped', 'Inventory decreases', 'sale ledger entry; cost snapshot taken'],
          ['Transfer', 'One warehouse down, another up', 'two transfer ledger entries'],
          ['Adjustment', 'Quantity set to a new value', 'adjustment ledger entry'],
          ['Write-off', 'Inventory decreases', 'damage/expired ledger entry'],
          ['Return completed', 'Inventory increases', 'return_in ledger entry with original sale values'],
        ]}
      />

      <DocsCallout variant="note" title="The ledger is the source of truth">
        There are no update or delete endpoints for the inventory ledger. Once a movement is recorded, it stays — which
        is why reports and history always reconcile.
      </DocsCallout>

      <H2>Roles at a glance</H2>
      <Table
        head={['Area', 'Admin', 'Manager']}
        rows={[
          ['Users', 'Full control', 'None'],
          ['Warehouses', 'Create, edit, archive, assign managers', 'View own warehouse only'],
          ['Catalog', 'Full access', 'Full access'],
          ['Orders', 'All warehouses', 'Own warehouse only'],
          ['Reports', 'All warehouses', 'Own warehouse only'],
        ]}
      />
      <P>
        Read more in <Link to="/docs/roles" className="font-medium text-primary underline underline-offset-4">Roles &amp; Permissions</Link>.
      </P>
    </DocPage>
  )
}