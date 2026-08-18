import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, P, Strong, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('architecture')!

export default function ArchitecturePage() {
  return (
    <DocPage meta={meta}>
      <P>
        The system is a classic <Strong>single-page application + REST API</Strong> split: a Laravel backend serves JSON
        under <Strong>/api/v1</Strong>, and a React frontend talks to it with bearer tokens.
      </P>

      <H2>Layers</H2>
      <UL>
        <LI>
          <Strong>Frontend (React + TypeScript + Vite)</Strong> — routing with React Router, server state with TanStack
          Query, client state with Zustand, and a Tailwind CSS design system of shadcn-style components.
        </LI>
        <LI>
          <Strong>Backend (Laravel)</Strong> — REST controllers, FormRequest validation, JSON resources, role middleware,
          warehouse policies, and dedicated services for the tricky business logic.
        </LI>
        <LI>
          <Strong>Database (PostgreSQL)</Strong> — a relational schema with check constraints, unique manager assignment,
          and an append-only transaction ledger.
        </LI>
      </UL>

      <H2>Key backend services</H2>
      <UL>
        <LI>
          <Strong>InventoryValuationService</Strong> — the Weighted Average Cost calculation, used on purchase receipts.
        </LI>
        <LI>
          <Strong>FinancialReportService</Strong> — sales, profit, valuation, write-off, and returns reports from the
          ledger.
        </LI>
        <LI>
          <Strong>CustomerReturnService</Strong> — returnable-quantity checks and the reversal entries on completion.
        </LI>
        <LI>
          <Strong>StockWriteOffService</Strong> — damage and expired write-offs.
        </LI>
        <LI>
          <Strong>ReferenceNumberService</Strong> — order and reference numbering.
        </LI>
        <LI>
          <Strong>AuditLogService</Strong> — activity log entries written inside the same transaction as each change.
        </LI>
      </UL>

      <H2>How data flows</H2>
      <P>
        The frontend calls a query/mutation, the controller validates the request, runs the business logic inside a
        database transaction with row locking, writes the ledger and audit entries, and returns a JSON resource. The
        frontend stores nothing authoritative — every number in the UI comes from the API.
      </P>

      <H2>Concurrency safety</H2>
      <P>
        Stock-affecting operations lock the relevant rows before reading or writing, so simultaneous requests cannot
        oversell or double-apply stock. See{' '}
        <Link to="/docs/concurrency" className="font-medium text-primary underline underline-offset-4">Concurrency</Link>.
      </P>

      <DocsCallout variant="note" title="Related reading">
        See <Link to="/docs/database" className="font-medium text-primary underline underline-offset-4">Database</Link> for the schema and{' '}
        <Link to="/docs/api" className="font-medium text-primary underline underline-offset-4">API Reference</Link> for the endpoints.
      </DocsCallout>
    </DocPage>
  )
}