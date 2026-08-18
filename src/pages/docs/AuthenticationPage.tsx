import { Link } from 'react-router-dom'

import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { DocsCodeBlock } from '@/components/docs/DocsCodeBlock'
import { H2, LI, OL, P, Strong, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('authentication')!

export default function AuthenticationPage() {
  return (
    <DocPage meta={meta}>
      <P>
        Authentication uses <Strong>Laravel Sanctum</Strong> with bearer tokens. Sign in once, get a token, and send it
        with every request.
      </P>

      <H2>Signing in</H2>
      <OL>
        <li>POST <Strong>/api/v1/auth/login</Strong> with your email and password.</li>
        <li>The API returns a token and your user profile.</li>
        <li>Send the token on every subsequent request as{' '}
          <Strong>Authorization: Bearer &lt;token&gt;</Strong>.</li>
      </OL>
      <DocsCodeBlock
        filename="login"
        code={`POST /api/v1/auth/login
Content-Type: application/json

{ "email": "you@company.com", "password": "your-password" }

→ 200 { "success": true, "data": { "token": "...", "user": { ... } } }`}
      />

      <H2>Signing out</H2>
      <P>
        POST <Strong>/api/v1/auth/logout</Strong> revokes the current token. The client should then forget the token
        locally.
      </P>

      <H2>Session checks</H2>
      <UL>
        <LI><Strong>GET /api/v1/auth/me</Strong> returns the current user profile.</LI>
        <LI>A missing or invalid token returns <Strong>401</Strong>.</LI>
        <LI>A <Strong>deactivated</Strong> account is rejected even with a valid token (403).</LI>
      </UL>

      <H2>Security details</H2>
      <UL>
        <LI>Login is rate-limited (5 attempts per minute) to slow brute force.</LI>
        <LI>Passwords must be at least 8 characters.</LI>
        <LI>There is no public registration — accounts are created by admins.</LI>
        <LI>Tokens are never stored in the frontend's code; they live in the browser's local storage via the auth
          store.</LI>
      </UL>

      <DocsCallout variant="note" title="Related reading">
        See <Link to="/docs/authorization" className="font-medium text-primary underline underline-offset-4">Authorization</Link> for what
        happens after you are authenticated, and{' '}
        <Link to="/docs/security" className="font-medium text-primary underline underline-offset-4">Security</Link> for the wider picture.
      </DocsCallout>
    </DocPage>
  )
}