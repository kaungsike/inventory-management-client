export interface DocHeading {
  id: string
  text: string
  level: 2 | 3
}

export interface DocPageMeta {
  slug: string
  title: string
  description: string
  group: string
  keywords: string[]
}

export interface DocGroup {
  label: string
  items: DocPageMeta[]
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export const docPath = (slug: string) => (slug ? `/docs/${slug}` : '/docs')
export const guidePath = (slug: string) => (slug ? `/guide/${slug}` : '/guide')

export const DOC_GROUPS: DocGroup[] = [
  {
    label: 'Getting Started',
    items: [
      {
        slug: '',
        title: 'Introduction',
        description:
          'What the Inventory Management System is, the problems it solves, and the parts that make it up.',
        group: 'Getting Started',
        keywords: ['welcome', 'about', 'overview', 'getting started', 'inventory', 'system', 'landing'],
      },
      {
        slug: 'quick-start',
        title: 'Quick Start',
        description:
          'Sign in and run your first purchase, sale, and return in a few minutes.',
        group: 'Getting Started',
        keywords: ['setup', 'login', 'first steps', 'tutorial', 'sign in', 'get started'],
      },
      {
        slug: 'system-overview',
        title: 'System Overview',
        description:
          'A high-level tour of products, warehouses, purchasing, sales, returns, and financial reports.',
        group: 'Getting Started',
        keywords: ['overview', 'modules', 'features', 'flow', 'lifecycle', 'how it works'],
      },
    ],
  },
  {
    label: 'Core Concepts',
    items: [
      {
        slug: 'roles',
        title: 'Roles & Permissions',
        description:
          'The admin and manager roles, what each can do, and how access is scoped to a warehouse.',
        group: 'Core Concepts',
        keywords: ['roles', 'permissions', 'admin', 'manager', 'authorization', 'access', 'scoped'],
      },
      {
        slug: 'warehouse-model',
        title: 'Warehouse Model',
        description:
          'Multiple warehouses, the one-manager-per-warehouse rule, archiving, and warehouse-scoped access.',
        group: 'Core Concepts',
        keywords: ['warehouse', 'multi warehouse', 'manager assignment', 'archive', 'restore', 'scoped'],
      },
      {
        slug: 'products-inventory',
        title: 'Product & Inventory',
        description:
          'Products, SKUs, categories, suppliers, and how stock is tracked per warehouse.',
        group: 'Core Concepts',
        keywords: ['product', 'sku', 'category', 'supplier', 'inventory', 'stock', 'quantity', 'reorder'],
      },
      {
        slug: 'inventory-ledger',
        title: 'Inventory Ledger',
        description:
          'The append-only transaction ledger that records every stock movement with a full audit trail.',
        group: 'Core Concepts',
        keywords: ['ledger', 'transactions', 'audit trail', 'movement', 'history', 'append only'],
      },
      {
        slug: 'wac',
        title: 'WAC & Valuation',
        description:
          'Weighted Average Cost — the formula the system uses, and which operations change it.',
        group: 'Core Concepts',
        keywords: ['wac', 'weighted average cost', 'valuation', 'cost', 'cogs', 'average cost'],
      },
    ],
  },
  {
    label: 'Operations',
    items: [
      {
        slug: 'purchase-orders',
        title: 'Purchase Orders',
        description:
          'Create purchase orders, add line items, track statuses, and understand partial receiving totals.',
        group: 'Operations',
        keywords: ['purchase order', 'po', 'supplier', 'procurement', 'order', 'received', 'remaining'],
      },
      {
        slug: 'receiving-stock',
        title: 'Receiving Stock',
        description:
          'Receive goods against a purchase order, update inventory and WAC, and track receipt progress.',
        group: 'Operations',
        keywords: ['receive', 'receiving', 'goods receipt', 'quantity received', 'over receive', 'stock in'],
      },
      {
        slug: 'sales-orders',
        title: 'Sales Orders',
        description:
          'Create sales orders against customers, add line items, and track status from draft to shipped.',
        group: 'Operations',
        keywords: ['sales order', 'so', 'customer', 'selling', 'confirm', 'order'],
      },
      {
        slug: 'shipping-orders',
        title: 'Shipping Orders',
        description:
          'Ship confirmed orders, validate stock levels, and snapshot cost for profit calculations.',
        group: 'Operations',
        keywords: ['ship', 'shipping', 'dispatch', 'stock validation', 'cost snapshot', 'confirm'],
      },
      {
        slug: 'customer-returns',
        title: 'Customer Returns',
        description:
          'Process returns against shipped orders, respect returnable quantities, and restore stock.',
        group: 'Operations',
        keywords: ['return', 'customer return', 'restock', 'returnable', 'refund', 'shipped'],
      },
      {
        slug: 'stock-adjustments',
        title: 'Stock Adjustments',
        description:
          'Manually correct stock levels when a count reveals a difference, with a full audit trail.',
        group: 'Operations',
        keywords: ['adjustment', 'adjust stock', 'stocktake', 'correction', 'manual'],
      },
      {
        slug: 'damage-expired',
        title: 'Damage & Expired Stock',
        description:
          'Write off damaged or expired goods and understand the financial impact of the loss.',
        group: 'Operations',
        keywords: ['damage', 'expired', 'write off', 'write-off', 'loss', 'spoilage'],
      },
      {
        slug: 'inventory-transfers',
        title: 'Inventory Transfers',
        description:
          'Move stock between warehouses without changing the weighted average cost.',
        group: 'Operations',
        keywords: ['transfer', 'warehouse transfer', 'move stock', 'relocate', 'two ledger entries'],
      },
    ],
  },
  {
    label: 'Financial',
    items: [
      {
        slug: 'sales-revenue',
        title: 'Sales & Revenue',
        description:
          'How gross and net sales are measured from the historical transaction ledger.',
        group: 'Financial',
        keywords: ['sales', 'revenue', 'gross sales', 'net sales', 'income', 'units sold'],
      },
      {
        slug: 'cogs',
        title: 'Cost of Goods Sold',
        description:
          'How the cost of what you sell is calculated from WAC cost snapshots.',
        group: 'Financial',
        keywords: ['cogs', 'cost of goods sold', 'cost', 'cost snapshot', 'wac'],
      },
      {
        slug: 'gross-profit',
        title: 'Gross Profit',
        description:
          'Revenue minus COGS, and how gross margin is expressed as a percentage.',
        group: 'Financial',
        keywords: ['gross profit', 'profit', 'margin', 'profitability', 'net'],
      },
      {
        slug: 'inventory-valuation',
        title: 'Inventory Valuation',
        description:
          'The current value of on-hand stock, computed from quantities multiplied by WAC.',
        group: 'Financial',
        keywords: ['inventory valuation', 'valuation', 'worth', 'on hand', 'value'],
      },
      {
        slug: 'returns-financial',
        title: 'Returns & Financial Impact',
        description:
          'How completed returns reverse revenue and COGS in the financial reports.',
        group: 'Financial',
        keywords: ['return', 'returns', 'reversal', 'revenue', 'cogs', 'refund'],
      },
      {
        slug: 'write-off-reports',
        title: 'Write-off Reports',
        description:
          'Report the value of damaged and expired stock written off, at its cost at write-off time.',
        group: 'Financial',
        keywords: ['write off', 'write-off report', 'damage', 'expired', 'loss value'],
      },
    ],
  },
  {
    label: 'Administration',
    items: [
      {
        slug: 'user-management',
        title: 'User Management',
        description:
          'Admins create, edit, activate, and deactivate user accounts across the system.',
        group: 'Administration',
        keywords: ['users', 'user management', 'accounts', 'deactivate', 'create user', 'admin'],
      },
      {
        slug: 'warehouse-management',
        title: 'Warehouse Management',
        description:
          'Create and edit warehouses, set locations, and archive or restore them.',
        group: 'Administration',
        keywords: ['warehouse', 'create', 'edit', 'archive', 'restore', 'location'],
      },
      {
        slug: 'manager-assignment',
        title: 'Manager Assignment',
        description:
          'Assign one manager to one warehouse — and how unassigning a manager works.',
        group: 'Administration',
        keywords: ['manager', 'assign', 'unassign', 'assignment', 'warehouse manager'],
      },
      {
        slug: 'activity-logs',
        title: 'Activity Logs',
        description:
          'The append-only audit trail showing who did what, when, and from where.',
        group: 'Administration',
        keywords: ['activity', 'audit', 'logs', 'history', 'who did what', 'changes'],
      },
    ],
  },
  {
    label: 'Technical',
    items: [
      {
        slug: 'architecture',
        title: 'Architecture',
        description:
          'How the Laravel API backend and the React frontend are structured and communicate.',
        group: 'Technical',
        keywords: ['architecture', 'frontend', 'backend', 'api', 'laravel', 'react', 'rest'],
      },
      {
        slug: 'database',
        title: 'Database',
        description:
          'The PostgreSQL schema, core tables, and how the main entities relate to each other.',
        group: 'Technical',
        keywords: ['database', 'postgresql', 'schema', 'tables', 'relationships', 'model'],
      },
      {
        slug: 'api',
        title: 'API Reference',
        description:
          'Every API endpoint with its method, roles, parameters, request body, and responses.',
        group: 'Technical',
        keywords: ['api', 'endpoint', 'rest', 'reference', 'routes', 'request', 'response', 'methods'],
      },
      {
        slug: 'authentication',
        title: 'Authentication',
        description:
          'How login, logout, and Sanctum bearer tokens secure the API.',
        group: 'Technical',
        keywords: ['authentication', 'login', 'logout', 'token', 'sanctum', 'bearer'],
      },
      {
        slug: 'authorization',
        title: 'Authorization',
        description:
          'Role middleware, warehouse policies, and the scoping rules that restrict data access.',
        group: 'Technical',
        keywords: ['authorization', 'role', 'policy', 'scoping', 'permissions', 'middleware'],
      },
      {
        slug: 'concurrency',
        title: 'Concurrency',
        description:
          'Row locking and database transactions that keep stock accurate under simultaneous use.',
        group: 'Technical',
        keywords: ['concurrency', 'locking', 'transaction', 'atomic', 'race', 'deadlock'],
      },
      {
        slug: 'security',
        title: 'Security',
        description:
          'Rate limiting, request validation, soft deletes, and data integrity protections.',
        group: 'Technical',
        keywords: ['security', 'rate limit', 'validation', 'integrity', 'password', 'https'],
      },
      {
        slug: 'business-rules',
        title: 'Business Rules',
        description:
          'The exact rules the system enforces — verified against the running code.',
        group: 'Technical',
        keywords: ['business rules', 'rules', 'stock negative', 'over receive', 'policy', 'constraints'],
      },
      {
        slug: 'glossary',
        title: 'Glossary',
        description:
          'Plain-language definitions of every term used in the Inventory Management System.',
        group: 'Technical',
        keywords: ['glossary', 'terms', 'definitions', 'wac', 'cogs', 'sku', 'ledger'],
      },
    ],
  },
]

export const DOC_PAGES: DocPageMeta[] = DOC_GROUPS.flatMap((group) => group.items)

export function getDocPage(slug: string): DocPageMeta | undefined {
  return DOC_PAGES.find((p) => p.slug === slug)
}

export function getDocNeighbors(slug: string): { prev?: DocPageMeta; next?: DocPageMeta } {
  const index = DOC_PAGES.findIndex((p) => p.slug === slug)
  if (index === -1) return {}
  return {
    prev: index > 0 ? DOC_PAGES[index - 1] : undefined,
    next: index < DOC_PAGES.length - 1 ? DOC_PAGES[index + 1] : undefined,
  }
}

export function firstPageOfGroup(groupLabel: string): DocPageMeta | undefined {
  const group = DOC_GROUPS.find((g) => g.label === groupLabel)
  return group?.items[0]
}

export function filterPages(pages: DocPageMeta[], query: string): DocPageMeta[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const tokens = q.split(/\s+/).filter(Boolean)
  return pages.filter((p) => {
    const haystack = [p.title, p.group, p.description, ...p.keywords].join(' ').toLowerCase()
    return tokens.every((token) => haystack.includes(token))
  })
}

export const GUIDE_PAGES: DocPageMeta[] = [
  {
    slug: '',
    title: 'User Guide',
    description:
      'How to use the system day to day — from logging in to reading the reports.',
    group: 'Guides',
    keywords: ['guide', 'how to', 'login', 'dashboard', 'using'],
  },
  {
    slug: 'admin',
    title: 'Admin Guide',
    description:
      'Everything an administrator can do to set up and run the whole system.',
    group: 'Guides',
    keywords: ['admin', 'users', 'warehouses', 'assign managers', 'products', 'suppliers', 'customers'],
  },
  {
    slug: 'manager',
    title: 'Manager Guide',
    description:
      'Day-to-day warehouse operations for a manager assigned to one warehouse.',
    group: 'Guides',
    keywords: ['manager', 'warehouse', 'inventory', 'purchase', 'sales', 'returns', 'transfer', 'reports'],
  },
]

export function getGuideNeighbors(slug: string): { prev?: DocPageMeta; next?: DocPageMeta } {
  const index = GUIDE_PAGES.findIndex((p) => p.slug === slug)
  if (index === -1) return {}
  return {
    prev: index > 0 ? GUIDE_PAGES[index - 1] : undefined,
    next: index < GUIDE_PAGES.length - 1 ? GUIDE_PAGES[index + 1] : undefined,
  }
}