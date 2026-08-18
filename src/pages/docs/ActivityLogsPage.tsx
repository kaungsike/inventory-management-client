import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, P, Strong, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('activity-logs')!

export default function ActivityLogsPage() {
  return (
    <DocPage meta={meta}>
      <P>
        <Strong>Activity Logs</Strong> are the system's audit trail: who did what, when, on which record, and from where.
        Like the inventory ledger, they are append-only.
      </P>

      <H2>What is recorded</H2>
      <UL>
        <LI>The <Strong>user</Strong> who performed the action.</LI>
        <LI>The <Strong>action</Strong> (for example, a status change or a transfer).</LI>
        <LI>The <Strong>model</Strong> and record affected.</LI>
        <LI>The <Strong>old and new values</Strong> of changed fields.</LI>
        <LI>The <Strong>IP address</Strong> and <Strong>user agent</Strong>.</LI>
        <LI>A timestamp.</LI>
      </UL>

      <H2>Who can view it</H2>
      <P>
        Admins and managers can view activity logs. Managers can filter by user (for auditing their warehouse), and the
        logs reflect actions across the system.
      </P>

      <H2>Filters</H2>
      <UL>
        <LI>Filter by user, action, model type, and model id.</LI>
        <LI>Search the description or action text.</LI>
        <LI>Filter by date range.</LI>
        <LI>Open a row to see the full old/new value details.</LI>
      </UL>

      <DocsCallout variant="note" title="Append-only by design">
        There are no endpoints to create or delete activity log entries. Every write endpoint records its own audit
        event inside the same database transaction as the change itself.
      </DocsCallout>
    </DocPage>
  )
}