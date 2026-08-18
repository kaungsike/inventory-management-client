import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, OL, P, Strong, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('user-management')!

export default function UserManagementPage() {
  return (
    <DocPage meta={meta}>
      <P>
        <Strong>User Management</Strong> is where administrators create and manage accounts. It is restricted to admins —
        managers cannot create or edit users.
      </P>

      <H2>Creating users</H2>
      <OL>
        <li>Open <Strong>User Management</Strong>.</li>
        <li>Click <Strong>Create User</Strong>.</li>
        <li>Enter name, email, and a password (min 8 characters, confirmed).</li>
        <li>Choose a role: <Strong>admin</Strong> or <Strong>manager</Strong>.</li>
        <li>Save. The account is active by default.</li>
      </OL>

      <H2>Editing and deactivating</H2>
      <UL>
        <LI>You can change any field, including the role and active status.</LI>
        <LI>Deactivating an account blocks that user from signing in immediately.</LI>
        <LI>You cannot delete or deactivate your own account — the system rejects it.</LI>
        <LI>Emails must be unique.</LI>
      </UL>

      <H2>Roles</H2>
      <P>
        The system has exactly two roles: <Strong>admin</Strong> and <Strong>manager</Strong>. Requests to create or
        update a user with any other role value are rejected by validation.
      </P>

      <DocsCallout variant="note" title="Related reading">
        See <Link to="/docs/roles" className="font-medium text-primary underline underline-offset-4">Roles &amp; Permissions</Link> for what each
        role can do, and <Link to="/docs/manager-assignment" className="font-medium text-primary underline underline-offset-4">
          Manager Assignment
        </Link>{' '}
        for linking managers to warehouses.
      </DocsCallout>
    </DocPage>
  )
}