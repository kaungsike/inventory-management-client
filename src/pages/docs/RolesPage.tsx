import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, OL, P, Strong, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('roles')!

export default function RolesPage() {
  return (
    <DocPage meta={meta}>
      <P>
        The system has exactly two roles: <Strong>admin</Strong> and <Strong>manager</Strong>. The database enforces
        this — a user account can only ever hold one of these two values.
      </P>

      <H2>Admin</H2>
      <P>
        Admins are global. They can see and operate every warehouse, manage user accounts, create and archive
        warehouses, assign managers, and read every report and activity log.
      </P>
      <UL>
        <LI>Manage all user accounts (create, edit, activate, deactivate).</LI>
        <LI>Create, edit, archive, and restore warehouses.</LI>
        <LI>Assign and unassign warehouse managers.</LI>
        <LI>Perform any operational task in any warehouse.</LI>
        <LI>Delete catalog records and orders (with the same safety rules everyone faces).</LI>
        <LI>Full access to reports and activity logs.</LI>
      </UL>

      <H2>Manager</H2>
      <P>
        Managers run exactly one warehouse. Every read and write is scoped to that warehouse, and this is enforced both
        by route-level role checks and by warehouse policies and query scoping.
      </P>
      <UL>
        <LI>View their warehouse's inventory, orders, transactions, and reports.</LI>
        <LI>Create and receive purchase orders for their warehouse.</LI>
        <LI>Create, confirm, and ship sales orders for their warehouse.</LI>
        <LI>Process returns, adjust stock, write off damaged/expired goods, and transfer stock out of their warehouse.</LI>
      </UL>

      <H2>What managers cannot do</H2>
      <UL>
        <LI>Manage users — that is admin-only.</LI>
        <LI>Create, archive, or assign warehouses.</LI>
        <LI>See or operate any warehouse other than their assigned one.</LI>
        <LI>Delete catalog records or orders.</LI>
      </UL>

      <H2>Warehouse scoping</H2>
      <P>
        Scoping is applied in three places so that it cannot be bypassed:
      </P>
      <OL>
        <li><Strong>Role middleware</Strong> checks the role on the route (admin vs admin+manager).</li>
        <li><Strong>Warehouse policies</Strong> authorize single-warehouse actions like viewing or operating a warehouse.</li>
        <li><Strong>Query scoping</Strong> filters list endpoints to the manager's warehouse id — an unassigned manager sees nothing.</li>
      </OL>
      <P>
        Read more in <Link to="/docs/authorization" className="font-medium text-primary underline underline-offset-4">Authorization</Link>.
      </P>

      <DocsCallout variant="note" title="Unassigned managers">
        A manager can be unassigned from their warehouse. They keep the manager role but see no warehouse data, and
        creating purchase or sales orders returns a 403 until they are assigned again. Details in{' '}
        <Link to="/docs/manager-assignment" className="font-medium text-primary underline underline-offset-4">
          Manager Assignment
        </Link>
        .
      </DocsCallout>
    </DocPage>
  )
}