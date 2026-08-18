import { Link } from 'react-router-dom'
import { PackageIcon } from 'lucide-react'

const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Features', to: '/features' },
      { label: 'About', to: '/about' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { label: 'Documentation', to: '/docs' },
      { label: 'User Guide', to: '/guide' },
      { label: 'FAQ', to: '/faq' },
    ],
  },
  {
    title: 'Access',
    links: [
      { label: 'Login', to: '/login' },
      { label: 'Dashboard', to: '/dashboard' },
    ],
  },
]

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <PackageIcon className="size-4" />
              </div>
              <span className="text-sm font-semibold tracking-tight text-foreground">Inventory MS</span>
            </div>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              A modern inventory management system for products, warehouses, purchasing, sales, returns, and financial
              reporting.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">{column.title}</p>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Inventory MS. Built with Laravel, PostgreSQL, React, and TypeScript.
        </div>
      </div>
    </footer>
  )
}