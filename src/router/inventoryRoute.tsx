
import { AppLayout } from '@/components/layout/AppLayout'
import { lazy, Suspense } from 'react'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

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

const Fallback = () => <LoadingSpinner className="min-h-[400px]" />

const inventoryRoute = [
  {
    path: '/dashboard',
    element: <AppLayout />,
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><DashboardPage /></Suspense> },
    ],
  },
  {
    path: '/products',
    element: <AppLayout />,
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><ProductsPage /></Suspense> },
      { path: 'new', element: <Suspense fallback={<Fallback />}><ProductFormPage /></Suspense> },
      { path: ':id/edit', element: <Suspense fallback={<Fallback />}><ProductFormPage /></Suspense> },
    ],
  },
  {
    path: '/categories',
    element: <AppLayout />,
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><CategoriesPage /></Suspense> },
    ],
  },
  {
    path: '/suppliers',
    element: <AppLayout />,
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><SuppliersPage /></Suspense> },
    ],
  },
  {
    path: '/warehouses',
    element: <AppLayout />,
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><WarehousesPage /></Suspense> },
    ],
  },
  {
    path: '/inventory',
    element: <AppLayout />,
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><InventoryPage /></Suspense> },
      { path: 'transfer', element: <Suspense fallback={<Fallback />}><InventoryTransferPage /></Suspense> },
    ],
  },
  {
    path: '/transactions',
    element: <AppLayout />,
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><TransactionsPage /></Suspense> },
    ],
  },
  {
    path: '/purchase-orders',
    element: <AppLayout />,
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><PurchaseOrdersPage /></Suspense> },
      { path: 'new', element: <Suspense fallback={<Fallback />}><PurchaseOrderFormPage /></Suspense> },
      { path: ':id', element: <Suspense fallback={<Fallback />}><PurchaseOrderDetailPage /></Suspense> },
    ],
  },
  {
    path: '/low-stock',
    element: <AppLayout />,
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><LowStockAlertPage /></Suspense> },
    ],
  },
]

export default inventoryRoute
