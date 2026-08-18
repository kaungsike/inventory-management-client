import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, P, Strong, Table, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('authorization')!

export default function AuthorizationPage() {
  return (
    <DocPage meta={meta}>
      <P>
        Once a request is authenticated, <Strong>authorization</Strong> decides what the user may do. It is enforced in
        layers so that a restriction can never be skipped.
      </P>

      <H2>The three layers</H2>
      <UL>
        <LI>
          <Strong>Role middleware</Strong> — route-level checks for admin-only vs admin+manager operations. For example,
          user management is wrapped in an admin-only group, while reports require admin or manager.
        </LI>
        <LI>
          <Strong>Warehouse policies</Strong> — fine-grained checks on a single warehouse, such as viewing or operating
          it. Managers pass only for their assigned warehouse.
        </LI>
        <LI>
          <Strong>Query scoping</Strong> — list endpoints inject the manager's warehouse id into the query. An unassigned
          manager gets an empty result rather than an error.
        </LI>
      </UL>

      <H2>What roles can do</H2>
      <Table
        head={['Operation', 'Admin', 'Manager']}
        rows={[
          ['Manage users', 'Yes', 'No'],
          ['Create / archive warehouses, assign managers', 'Yes', 'No'],
          ['Delete catalog records and orders', 'Yes', 'No'],
          ['Create and edit products, suppliers, customers', 'Yes', 'Yes'],
          ['Create / confirm / ship / receive orders', 'Yes', 'Yes (own warehouse)'],
          ['View reports and activity logs', 'Yes', 'Yes (own warehouse)'],
          ['Read every warehouse', 'Yes', 'Own warehouse only'],
        ]}
      />

      <H2>Special notes</H2>
      <UL>
        <LI>Transfer destinations may be any active warehouse, but the source is always the manager's own warehouse.</LI>
        <LI>Shipping and receiving are open to any authenticated user in the routes, but managers are still scoped by
          warehouse policies.</LI>
        <LI>Route-level role values are the only two: admin and manager.</LI>
      </UL>

      <DocsCallout variant="note" title="Related reading">
        See <Link to="/docs/roles" className="font-medium text-primary underline underline-offset-4">Roles &amp; Permissions</Link> and{' '}
        <Link to="/docs/warehouse-model" className="font-medium text-primary underline underline-offset-4">Warehouse Model</Link>.
      </DocsCallout>
    </DocPage>
  )
}