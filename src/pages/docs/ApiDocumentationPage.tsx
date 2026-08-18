import { ApiEndpoint } from '@/components/docs/ApiEndpoint'
import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { DocsCodeBlock } from '@/components/docs/DocsCodeBlock'
import { H2, P, Strong } from '@/components/docs/primitives'
import { API_SECTIONS } from '@/lib/apiDocs'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('api')!

export default function ApiDocumentationPage() {
  return (
    <DocPage meta={meta}>
      <P>
        All endpoints live under <Strong>/api/v1</Strong>. Every route except login requires a bearer token, and all
        routes except login require an active account.
      </P>

      <H2>Base URL</H2>
      <DocsCodeBlock
        filename="base-url"
        code={`http://localhost:8000/api/v1   (local development)
/api/v1                   (production, same origin via reverse proxy)`}
      />

      <H2>Authentication header</H2>
      <DocsCodeBlock
        filename="header"
        code={`Authorization: Bearer <token>`}
      />

      <H2>Response conventions</H2>
      <P>
        Successful single-resource responses return the resource object directly; paginated lists return{' '}
        <Strong>{"{ data, meta, links }"}</Strong>. Errors use standard HTTP status codes with a JSON body containing a
        message.
      </P>
      <DocsCallout variant="note" title="Roles">
        Role labels used below: <Strong>Admin only</Strong> means the route is restricted to administrators.{' '}
        <Strong>Admin or Manager</Strong> means both roles (managers still scoped to their warehouse).{' '}
        <Strong>Any authenticated user</Strong> means any active signed-in user.
      </DocsCallout>

      {API_SECTIONS.map((section) => (
        <section key={section.id} className="mt-12">
          <h2 className="mb-1 text-xl font-semibold tracking-tight text-foreground">{section.title}</h2>
          <p className="mb-2 text-sm leading-6 text-muted-foreground">{section.description}</p>
          {section.endpoints.map((endpoint) => (
            <ApiEndpoint key={`${endpoint.method}-${endpoint.path}`} endpoint={endpoint} />
          ))}
        </section>
      ))}
    </DocPage>
  )
}