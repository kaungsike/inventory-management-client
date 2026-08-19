import { lazy, Suspense } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const ProductsPage = lazy(() => import('@/pages/ProductsPage'))
const ProductFormPage = lazy(() => import('@/pages/ProductFormPage'))
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'))
const SuppliersPage = lazy(() => import('@/pages/SuppliersPage'))
const WarehousesPage = lazy(() => import('@/pages/WarehousesPage'))
const WarehouseDetailPage = lazy(() => import('@/pages/WarehouseDetailPage'))
const InventoryPage = lazy(() => import('@/pages/InventoryPage'))
const InventoryTransferPage = lazy(() => import('@/pages/InventoryTransferPage'))
const TransactionsPage = lazy(() => import('@/pages/TransactionsPage'))
const PurchaseOrdersPage = lazy(() => import('@/pages/PurchaseOrdersPage'))
const PurchaseOrderFormPage = lazy(() => import('@/pages/PurchaseOrderFormPage'))
const PurchaseOrderDetailPage = lazy(() => import('@/pages/PurchaseOrderDetailPage'))
const CustomersPage = lazy(() => import('@/pages/CustomersPage'))
const SalesOrdersPage = lazy(() => import('@/pages/SalesOrdersPage'))
const SalesOrderFormPage = lazy(() => import('@/pages/SalesOrderFormPage'))
const SalesOrderDetailPage = lazy(() => import('@/pages/SalesOrderDetailPage'))
const CustomerReturnsPage = lazy(() => import('@/pages/CustomerReturnsPage'))
const CustomerReturnFormPage = lazy(() => import('@/pages/CustomerReturnFormPage'))
const CustomerReturnDetailPage = lazy(() => import('@/pages/CustomerReturnDetailPage'))
const LowStockAlertPage = lazy(() => import('@/pages/LowStockAlertPage'))
const ActivityLogPage = lazy(() => import('@/pages/ActivityLogPage'))
const SalesReportPage = lazy(() => import('@/pages/reports/SalesReportPage'))
const ProfitReportPage = lazy(() => import('@/pages/reports/ProfitReportPage'))
const InventoryValuationPage = lazy(() => import('@/pages/reports/InventoryValuationPage'))
const StockWriteOffReportPage = lazy(() => import('@/pages/reports/StockWriteOffReportPage'))
const ReturnReportPage = lazy(() => import('@/pages/reports/ReturnReportPage'))
const FinancialOverviewPage = lazy(() => import('@/pages/reports/FinancialOverviewPage'))
const UsersPage = lazy(() => import('@/pages/users/UsersPage'))
const UserFormPage = lazy(() => import('@/pages/users/UserFormPage'))

const Fallback = () => <LoadingSpinner className="min-h-[400px]" />

const inventoryRoute = [
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><DashboardPage /></Suspense> },
    ],
  },
  {
    path: '/products',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><ProductsPage /></Suspense> },
      {
        path: 'new',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <Suspense fallback={<Fallback />}><ProductFormPage /></Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: ':id/edit',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <Suspense fallback={<Fallback />}><ProductFormPage /></Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/categories',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><CategoriesPage /></Suspense> },
    ],
  },
  {
    path: '/suppliers',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><SuppliersPage /></Suspense> },
    ],
  },
  {
    path: '/warehouses',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><WarehousesPage /></Suspense> },
      { path: ':id', element: <Suspense fallback={<Fallback />}><WarehouseDetailPage /></Suspense> },
    ],
  },
  {
    path: '/inventory',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><InventoryPage /></Suspense> },
      { path: 'transfer', element: <Suspense fallback={<Fallback />}><InventoryTransferPage /></Suspense> },
    ],
  },
  {
    path: '/transactions',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><TransactionsPage /></Suspense> },
    ],
  },
  {
    path: '/purchase-orders',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><PurchaseOrdersPage /></Suspense> },
      {
        path: 'new',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <Suspense fallback={<Fallback />}><PurchaseOrderFormPage /></Suspense>
          </ProtectedRoute>
        ),
      },
      { path: ':id', element: <Suspense fallback={<Fallback />}><PurchaseOrderDetailPage /></Suspense> },
    ],
  },
  {
    path: '/customers',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><CustomersPage /></Suspense> },
    ],
  },
  {
    path: '/sales-orders',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><SalesOrdersPage /></Suspense> },
      {
        path: 'new',
        element: (
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <Suspense fallback={<Fallback />}><SalesOrderFormPage /></Suspense>
          </ProtectedRoute>
        ),
      },
      { path: ':id', element: <Suspense fallback={<Fallback />}><SalesOrderDetailPage /></Suspense> },
    ],
  },
  {
    path: '/customer-returns',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><CustomerReturnsPage /></Suspense> },
      { path: 'new', element: <Suspense fallback={<Fallback />}><CustomerReturnFormPage /></Suspense> },
      { path: ':id', element: <Suspense fallback={<Fallback />}><CustomerReturnDetailPage /></Suspense> },
      { path: ':id/edit', element: <Suspense fallback={<Fallback />}><CustomerReturnFormPage /></Suspense> },
    ],
  },
  {
    path: '/low-stock',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><LowStockAlertPage /></Suspense> },
    ],
  },
  {
    path: '/activity-logs',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'manager']}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><ActivityLogPage /></Suspense> },
    ],
  },
  {
    path: '/reports/sales',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'manager']}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><SalesReportPage /></Suspense> },
    ],
  },
  {
    path: '/reports/profit',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'manager']}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><ProfitReportPage /></Suspense> },
    ],
  },
  {
    path: '/reports/inventory-valuation',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'manager']}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><InventoryValuationPage /></Suspense> },
    ],
  },
  {
    path: '/reports/write-off',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'manager']}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><StockWriteOffReportPage /></Suspense> },
    ],
  },
  {
    path: '/reports/returns',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'manager']}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><ReturnReportPage /></Suspense> },
    ],
  },
  {
    path: '/reports/financial-overview',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'manager']}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><FinancialOverviewPage /></Suspense> },
    ],
  },
  {
    path: '/users',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><UsersPage /></Suspense> },
      {
        path: 'new',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <Suspense fallback={<Fallback />}><UserFormPage /></Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: ':id/edit',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <Suspense fallback={<Fallback />}><UserFormPage /></Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
]

export default inventoryRoute
