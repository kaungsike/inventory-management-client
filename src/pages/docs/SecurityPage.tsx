import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, P, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('security')!

export default function SecurityPage() {
  return (
    <DocPage meta={meta}>
      <P>
        Security is handled at multiple levels: authentication, authorization, input validation, rate limiting, and
        database constraints that protect data integrity.
      </P>

      <H2>Authentication and sessions</H2>
      <UL>
        <LI>Sanctum bearer tokens protect every route except login.</LI>
        <LI>Logging out revokes the token server-side.</LI>
        <LI>Deactivated accounts cannot authenticate.</LI>
        <LI>Login is rate-limited to 5 attempts per minute per IP.</LI>
        <LI>The API as a whole is rate-limited (60 requests per minute per user).</LI>
      </UL>

      <H2>Authorization</H2>
      <UL>
        <LI>Role middleware restricts admin-only and admin+manager operations.</LI>
        <LI>Warehouse policies scope managers to their assigned warehouse.</LI>
        <LI>Report endpoints return 403 to roles without access.</LI>
      </UL>

      <H2>Input validation</H2>
      <UL>
        <LI>Every write endpoint validates its input with a FormRequest.</LI>
        <LI>Enums are restricted (role in admin/manager, statuses, transaction types).</LI>
        <LI>Route ids must be numeric — malformed ids return a clean 404, not a 500.</LI>
        <LI>Page sizes are clamped (1–100) to prevent abuse.</LI>
      </UL>

      <H2>Data integrity</H2>
      <UL>
        <LI>Check constraints prevent illegal roles and over-receiving.</LI>
        <LI>Stock can never go negative, enforced in code with locked reads.</LI>
        <LI>Ledger entries and activity logs are append-only — no edit or delete endpoints.</LI>
        <LI>Soft deletes keep history while hiding records from new operations.</LI>
        <LI>Passwords are stored hashed.</LI>
      </UL>

      <DocsCallout variant="note" title="Related reading">
        See <Link to="/docs/authentication" className="font-medium text-primary underline underline-offset-4">Authentication</Link>,{' '}
        <Link to="/docs/authorization" className="font-medium text-primary underline underline-offset-4">Authorization</Link>, and{' '}
        <Link to="/docs/concurrency" className="font-medium text-primary underline underline-offset-4">Concurrency</Link>.
      </DocsCallout>
    </DocPage>
  )
}