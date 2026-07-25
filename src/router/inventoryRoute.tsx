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
const InventoryPage = lazy(() => import('@/pages/InventoryPage'))
const InventoryTransferPage = lazy(() => import('@/pages/InventoryTransferPage'))
const TransactionsPage = lazy(() => import('@/pages/TransactionsPage'))
const PurchaseOrdersPage = lazy(() => import('@/pages/PurchaseOrdersPage'))
const PurchaseOrderFormPage = lazy(() => import('@/pages/PurchaseOrderFormPage'))
const PurchaseOrderDetailPage = lazy(() => import('@/pages/PurchaseOrderDetailPage'))
const LowStockAlertPage = lazy(() => import('@/pages/LowStockAlertPage'))
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
    path: '/users',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><UsersPage /></Suspense> },
      { path: 'new', element: <Suspense fallback={<Fallback />}><UserFormPage /></Suspense> },
      { path: ':id/edit', element: <Suspense fallback={<Fallback />}><UserFormPage /></Suspense> },
    ],
  },
]

export default inventoryRoute
