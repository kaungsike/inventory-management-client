import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react'

import { DocsLayout } from '@/components/docs/DocsLayout'
import { GuideLayout } from '@/components/docs/GuideLayout'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PublicLayout } from '@/components/public/PublicLayout'

const HomePage = lazy(() => import('@/pages/public/HomePage'))
const AboutPage = lazy(() => import('@/pages/public/AboutPage'))
const FeaturesPage = lazy(() => import('@/pages/public/FeaturesPage'))
const FAQPage = lazy(() => import('@/pages/public/FAQPage'))

const UserGuidePage = lazy(() => import('@/pages/guide/UserGuidePage'))
const AdminGuidePage = lazy(() => import('@/pages/guide/AdminGuidePage'))
const ManagerGuidePage = lazy(() => import('@/pages/guide/ManagerGuidePage'))

const IntroductionPage = lazy(() => import('@/pages/docs/IntroductionPage'))
const QuickStartPage = lazy(() => import('@/pages/docs/QuickStartPage'))
const SystemOverviewPage = lazy(() => import('@/pages/docs/SystemOverviewPage'))
const RolesPage = lazy(() => import('@/pages/docs/RolesPage'))
const WarehouseModelPage = lazy(() => import('@/pages/docs/WarehouseModelPage'))
const ProductInventoryPage = lazy(() => import('@/pages/docs/ProductInventoryPage'))
const InventoryLedgerPage = lazy(() => import('@/pages/docs/InventoryLedgerPage'))
const WACPage = lazy(() => import('@/pages/docs/WACPage'))
const PurchaseOrdersPage = lazy(() => import('@/pages/docs/PurchaseOrdersPage'))
const ReceivingStockPage = lazy(() => import('@/pages/docs/ReceivingStockPage'))
const SalesOrdersPage = lazy(() => import('@/pages/docs/SalesOrdersPage'))
const ShippingOrdersPage = lazy(() => import('@/pages/docs/ShippingOrdersPage'))
const CustomerReturnsPage = lazy(() => import('@/pages/docs/CustomerReturnsPage'))
const StockAdjustmentsPage = lazy(() => import('@/pages/docs/StockAdjustmentsPage'))
const DamageExpiredPage = lazy(() => import('@/pages/docs/DamageExpiredPage'))
const TransfersPage = lazy(() => import('@/pages/docs/TransfersPage'))
const SalesRevenuePage = lazy(() => import('@/pages/docs/SalesRevenuePage'))
const COGSPage = lazy(() => import('@/pages/docs/COGSPage'))
const GrossProfitPage = lazy(() => import('@/pages/docs/GrossProfitPage'))
const InventoryValuationPage = lazy(() => import('@/pages/docs/InventoryValuationPage'))
const ReturnsFinancialPage = lazy(() => import('@/pages/docs/ReturnsFinancialPage'))
const WriteOffReportsPage = lazy(() => import('@/pages/docs/WriteOffReportsPage'))
const UserManagementPage = lazy(() => import('@/pages/docs/UserManagementPage'))
const WarehouseManagementPage = lazy(() => import('@/pages/docs/WarehouseManagementPage'))
const ManagerAssignmentPage = lazy(() => import('@/pages/docs/ManagerAssignmentPage'))
const ActivityLogsPage = lazy(() => import('@/pages/docs/ActivityLogsPage'))
const ArchitecturePage = lazy(() => import('@/pages/docs/ArchitecturePage'))
const DatabasePage = lazy(() => import('@/pages/docs/DatabasePage'))
const ApiDocumentationPage = lazy(() => import('@/pages/docs/ApiDocumentationPage'))
const AuthenticationPage = lazy(() => import('@/pages/docs/AuthenticationPage'))
const AuthorizationPage = lazy(() => import('@/pages/docs/AuthorizationPage'))
const ConcurrencyPage = lazy(() => import('@/pages/docs/ConcurrencyPage'))
const SecurityPage = lazy(() => import('@/pages/docs/SecurityPage'))
const BusinessRulesPage = lazy(() => import('@/pages/docs/BusinessRulesPage'))
const GlossaryPage = lazy(() => import('@/pages/docs/GlossaryPage'))

const Fallback = () => <LoadingSpinner className="flex min-h-[400px] items-center justify-center" />

const lazyPage = (Page: LazyExoticComponent<ComponentType>) => (
  <Suspense fallback={<Fallback />}>
    <Page />
  </Suspense>
)

const publicRoute = [
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: lazyPage(HomePage) },
      { path: 'about', element: lazyPage(AboutPage) },
      { path: 'features', element: lazyPage(FeaturesPage) },
      { path: 'faq', element: lazyPage(FAQPage) },
      {
        path: 'guide',
        element: <GuideLayout />,
        children: [
          { index: true, element: lazyPage(UserGuidePage) },
          { path: 'admin', element: lazyPage(AdminGuidePage) },
          { path: 'manager', element: lazyPage(ManagerGuidePage) },
        ],
      },
      {
        path: 'docs',
        element: <DocsLayout />,
        children: [
          { index: true, element: lazyPage(IntroductionPage) },
          { path: 'quick-start', element: lazyPage(QuickStartPage) },
          { path: 'system-overview', element: lazyPage(SystemOverviewPage) },
          { path: 'roles', element: lazyPage(RolesPage) },
          { path: 'warehouse-model', element: lazyPage(WarehouseModelPage) },
          { path: 'products-inventory', element: lazyPage(ProductInventoryPage) },
          { path: 'inventory-ledger', element: lazyPage(InventoryLedgerPage) },
          { path: 'wac', element: lazyPage(WACPage) },
          { path: 'purchase-orders', element: lazyPage(PurchaseOrdersPage) },
          { path: 'receiving-stock', element: lazyPage(ReceivingStockPage) },
          { path: 'sales-orders', element: lazyPage(SalesOrdersPage) },
          { path: 'shipping-orders', element: lazyPage(ShippingOrdersPage) },
          { path: 'customer-returns', element: lazyPage(CustomerReturnsPage) },
          { path: 'stock-adjustments', element: lazyPage(StockAdjustmentsPage) },
          { path: 'damage-expired', element: lazyPage(DamageExpiredPage) },
          { path: 'inventory-transfers', element: lazyPage(TransfersPage) },
          { path: 'sales-revenue', element: lazyPage(SalesRevenuePage) },
          { path: 'cogs', element: lazyPage(COGSPage) },
          { path: 'gross-profit', element: lazyPage(GrossProfitPage) },
          { path: 'inventory-valuation', element: lazyPage(InventoryValuationPage) },
          { path: 'returns-financial', element: lazyPage(ReturnsFinancialPage) },
          { path: 'write-off-reports', element: lazyPage(WriteOffReportsPage) },
          { path: 'user-management', element: lazyPage(UserManagementPage) },
          { path: 'warehouse-management', element: lazyPage(WarehouseManagementPage) },
          { path: 'manager-assignment', element: lazyPage(ManagerAssignmentPage) },
          { path: 'activity-logs', element: lazyPage(ActivityLogsPage) },
          { path: 'architecture', element: lazyPage(ArchitecturePage) },
          { path: 'database', element: lazyPage(DatabasePage) },
          { path: 'api', element: lazyPage(ApiDocumentationPage) },
          { path: 'authentication', element: lazyPage(AuthenticationPage) },
          { path: 'authorization', element: lazyPage(AuthorizationPage) },
          { path: 'concurrency', element: lazyPage(ConcurrencyPage) },
          { path: 'security', element: lazyPage(SecurityPage) },
          { path: 'business-rules', element: lazyPage(BusinessRulesPage) },
          { path: 'glossary', element: lazyPage(GlossaryPage) },
        ],
      },
    ],
  },
]

export default publicRoute