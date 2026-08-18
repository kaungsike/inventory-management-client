import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, OL, P, Strong, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('warehouse-management')!

export default function WarehouseManagementPage() {
  return (
    <DocPage meta={meta}>
      <P>
        <Strong>Warehouse Management</Strong> is admin territory: creating locations, editing their details, and
        archiving or restoring them. Managers can only view their own warehouse.
      </P>

      <H2>Creating a warehouse</H2>
      <OL>
        <li>Open <Strong>Warehouses</Strong>.</li>
        <li>Click <Strong>Create Warehouse</Strong>.</li>
        <li>Enter a unique name and a location.</li>
        <li>Optionally add a description, manager name, and phone number.</li>
        <li>Save. The warehouse is active by default.</li>
      </OL>

      <H2>Editing a warehouse</H2>
      <UL>
        <LI>Update the name, location, description, and contact details.</LI>
        <LI>Assign or change the manager (see <Link to="/docs/manager-assignment" className="font-medium text-primary underline underline-offset-4">Manager Assignment</Link>).</LI>
        <LI>Archived warehouses cannot be edited until they are restored.</LI>
      </UL>

      <H2>Archiving and restoring</H2>
      <P>Archiving hides a warehouse from normal use while keeping its history:</P>
      <UL>
        <LI>Blocked while the warehouse holds any stock.</LI>
        <LI>Blocked if the warehouse is inactive or already archived.</LI>
        <LI>Blocked if it is the last active warehouse.</LI>
        <LI>Restoring re-checks that the name does not clash with another warehouse.</LI>
      </UL>

      <DocsCallout variant="note" title="Archived warehouses are read-only history">
        Old orders and ledger entries keep showing the warehouse, but new stock operations cannot use it. See{' '}
        <Link to="/docs/warehouse-model" className="font-medium text-primary underline underline-offset-4">
          Warehouse Model
        </Link>
        .
      </DocsCallout>
    </DocPage>
  )
}