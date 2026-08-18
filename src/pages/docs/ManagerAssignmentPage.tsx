import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, OL, P, Strong, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('manager-assignment')!

export default function ManagerAssignmentPage() {
  return (
    <DocPage meta={meta}>
      <P>
        Assigning a manager to a warehouse is how you give a manager a place to operate. The rule is simple and strict:{' '}
        <Strong>one manager, one warehouse</Strong>.
      </P>

      <H2>How assignment works</H2>
      <OL>
        <li>Open the warehouse.</li>
        <li>Choose a manager from the list — only <Strong>active</Strong> managers appear.</li>
        <li>Save. The manager now sees and operates that warehouse.</li>
      </OL>
      <P>
        The one-to-one rule is enforced by a <Strong>unique database index</Strong> on the warehouse's manager column,
        and the API rejects assigning a manager who is already assigned to another warehouse.
      </P>

      <H2>Unassigning a manager</H2>
      <P>To unassign, simply clear the manager on the warehouse. What happens next:</P>
      <UL>
        <LI>The manager keeps the <Strong>manager</Strong> role.</LI>
        <LI>They see no warehouse data — their lists return empty.</LI>
        <LI>Creating purchase orders or sales orders returns a 403 ("You are not assigned to a warehouse.").</LI>
        <LI>Once assigned again, everything returns to normal.</LI>
      </UL>

      <H2>Notes</H2>
      <UL>
        <LI>A warehouse can have <Strong>no manager</Strong> — admins operate it directly.</LI>
        <LI>Deleting a manager user clears their assignment automatically.</LI>
        <LI>Unassigning never deletes the manager's account or changes their role.</LI>
      </UL>

      <DocsCallout variant="note" title="Related reading">
        See <Link to="/docs/roles" className="font-medium text-primary underline underline-offset-4">Roles &amp; Permissions</Link> and{' '}
        <Link to="/docs/warehouse-model" className="font-medium text-primary underline underline-offset-4">Warehouse Model</Link>.
      </DocsCallout>
    </DocPage>
  )
}