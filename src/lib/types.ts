export interface Category {
  id: number
  name: string
  description: string | null
  status: 'active' | 'inactive'
  products_count?: number
  created_at: string
  updated_at: string
}

export interface Supplier {
  id: number
  name: string
  email: string
  phone: string
  address: string | null
  company: string | null
  contact_person: string | null
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  category_id: number
  supplier_id: number | null
  sku: string
  name: string
  description: string | null
  unit_price: number
  cost_price: number
  average_cost: number
  unit: string
  image: string | null
  status: 'active' | 'inactive' | 'discontinued'
  category?: Category
  supplier?: Supplier
  total_stock?: number
  created_at: string
  updated_at: string
}

export interface Warehouse {
  id: number
  name: string
  location: string
  description: string | null
  manager_name: string | null
  phone: string | null
  status: 'active' | 'inactive'
  inventory_count?: number
  created_at: string
  updated_at: string
}

export interface Inventory {
  id: number
  product_id: number
  warehouse_id: number
  quantity: number
  reserved_quantity: number
  available_quantity: number
  reorder_point: number
  reorder_quantity: number
  product?: Product
  warehouse?: Warehouse
  created_at: string
  updated_at: string
}

export interface InventoryTransaction {
  id: number
  product_id: number
  product_name: string | null
  product_sku: string | null
  warehouse_id: number
  user_id: number | null
  type: 'purchase' | 'sale' | 'transfer' | 'adjustment' | 'return' | 'return_in' | 'damage' | 'expired'
  quantity: number
  unit_cost: number | null
  unit_price: number | null
  reference_number: string | null
  notes: string | null
  transaction_date: string
  product?: Product
  warehouse?: Warehouse
  created_at: string
}

export interface PurchaseOrderItem {
  id: number
  purchase_order_id: number
  product_id: number
  quantity_ordered: number
  quantity_received: number
  unit_cost: number
  total_cost: number
  product?: Product
}

export interface Customer {
  id: number
  name: string
  email: string | null
  phone: string | null
  address: string | null
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface SalesOrderItem {
  id: number
  sales_order_id: number
  product_id: number
  quantity_ordered: number
  quantity_shipped: number
  unit_price: number
  unit_cost: number | null
  total_amount: number
  product?: Product
}

export interface SalesOrder {
  id: number
  customer_id: number
  warehouse_id: number
  user_id: number | null
  so_number: string
  status: 'draft' | 'confirmed' | 'shipped' | 'cancelled'
  order_date: string
  ship_date: string | null
  total_amount: number
  notes: string | null
  customer?: Customer
  warehouse?: Warehouse
  items?: SalesOrderItem[]
  items_count?: number
  created_at: string
  updated_at: string
}

export interface PurchaseOrder {
  id: number
  supplier_id: number
  warehouse_id?: number | null
  user_id: number | null
  po_number: string
  status: 'draft' | 'sent' | 'partial' | 'received' | 'cancelled'
  order_date: string
  expected_date: string | null
  received_date: string | null
  total_amount: number
  notes: string | null
  supplier?: Supplier
  warehouse?: Warehouse
  items?: PurchaseOrderItem[]
  items_count?: number
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  total_products: number
  total_categories: number
  total_suppliers: number
  total_warehouses: number
  low_stock_count: number
  total_inventory_value: number
  recent_transactions: InventoryTransaction[]
  top_products_by_value: { id: number; name: string; sku: string; total_value: number; total_stock: number }[]
  monthly_transaction_summary: { month: string; type: string; count: number; total_quantity: number }[]
  today_financial?: FinancialSummary
  month_financial?: FinancialSummary
  today_write_off?: number
  month_write_off?: number
  today_returns_value?: number
  month_returns_value?: number
  last_30_days_sales?: DailySalesRow[]
  monthly_financial_summary?: MonthlySalesRow[]
}

export interface FinancialSummary {
  revenue: number
  cogs: number
  gross_profit: number
  gross_margin: number
  sales_count: number
  units_sold: number
  average_order_value: number
}

export interface DailySalesRow {
  date: string
  revenue: number
  cogs: number
  gross_profit: number
  gross_margin: number
  sales_count: number
  units_sold: number
}

export interface MonthlySalesRow {
  month: string
  year: number
  month_number: number
  revenue: number
  cogs: number
  gross_profit: number
  gross_margin: number
  sales_count: number
  units_sold: number
}

export interface SalesReportRow {
  id: number
  transaction_date: string
  product_id: number
  product_name: string | null
  product_sku: string | null
  warehouse_id: number
  warehouse_name: string | null
  reference_number: string | null
  quantity: number
  unit_price: number
  unit_cost: number
  revenue: number
  cogs: number
  gross_profit: number
}

export interface SalesReport {
  summary: FinancialSummary
  data: SalesReportRow[]
}

export interface ProfitReport {
  summary: FinancialSummary
  daily: DailySalesRow[]
  monthly: MonthlySalesRow[]
}

export interface InventoryValuationRow {
  product_id: number
  product_name: string
  product_sku: string
  warehouse_id: number
  warehouse_name: string
  quantity: number
  average_cost: number
  inventory_value: number
}

export interface InventoryValuationByWarehouse {
  warehouse_id: number
  warehouse_name: string
  total_units: number
  total_value: number
}

export interface InventoryValuation {
  summary: { total_units: number; total_value: number }
  by_warehouse: InventoryValuationByWarehouse[]
  data: InventoryValuationRow[]
}

export interface StockWriteOffRow {
  id: number
  transaction_date: string
  product_id: number
  product_name: string
  product_sku: string
  warehouse_id: number
  warehouse_name: string | null
  type: 'damage' | 'expired'
  quantity: number
  unit_cost: number
  value: number
  reason: string | null
  user_id: number | null
}

export interface StockWriteOffSummary {
  total_quantity: number
  total_value: number
  damage_quantity: number
  damage_value: number
  expired_quantity: number
  expired_value: number
}

export interface StockWriteOffReport {
  summary: StockWriteOffSummary
  data: StockWriteOffRow[]
}

export interface WriteOffFilters extends ReportFilters {
  type?: 'damage' | 'expired'
}

export interface ReportFilters {
  date_from?: string
  date_to?: string
  warehouse_id?: number
  product_id?: number
  category_id?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    from: number
    last_page: number
    per_page: number
    to: number
    total: number
  }
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ActivityLog {
  id: number
  action: string
  description: string | null
  user: { id: number; name: string } | null
  model_type: string
  model_id: number | null
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export interface ActivityLogFilters {
  user_id?: number
  action?: string
  model_type?: string
  model_id?: number
  date_from?: string
  date_to?: string
  search?: string
  page?: number
  per_page?: number
}

export interface CustomerReturnItem {
  id: number
  customer_return_id: number
  sales_order_item_id: number | null
  product_id: number
  product_name: string
  product_sku: string
  unit_price: number
  unit_cost: number | null
  quantity: number
  total_amount: number
  reason: string | null
  product?: Product
}

export type CustomerReturnStatus = 'draft' | 'completed' | 'cancelled'

export interface CustomerReturn {
  id: number
  return_number: string
  sales_order_id: number
  customer_id: number
  warehouse_id: number
  user_id: number | null
  status: CustomerReturnStatus
  return_date: string | null
  total_amount: number
  reason: string | null
  notes: string | null
  customer?: Customer
  warehouse?: Warehouse
  user?: { id: number; name: string } | null
  sales_order?: SalesOrder
  items?: CustomerReturnItem[]
  items_count?: number
  created_at: string
  updated_at: string
}

export interface ReturnableSalesOrderItem {
  id: number
  product_id: number
  product_name: string
  product_sku: string
  quantity_shipped: number
  already_returned: number
  returnable_quantity: number
  unit_price: string
  unit_cost: string | null
}

export interface ReturnableSalesOrder {
  sales_order: SalesOrder
  items: ReturnableSalesOrderItem[]
}

export interface ReturnReportRow {
  id: number
  return_number: string
  return_date: string
  customer_id: number
  customer_name: string | null
  warehouse_id: number
  warehouse_name: string | null
  sales_order_id: number
  so_number: string | null
  product_id: number
  product_name: string
  product_sku: string
  quantity: number
  unit_price: number
  unit_cost: number
  value: number
  reason: string | null
}

export interface ReturnReportSummary {
  total_returns: number
  total_units: number
  total_value: number
}

export interface ReturnReport {
  summary: ReturnReportSummary
  data: ReturnReportRow[]
}

export interface ReturnFilters {
  status?: string
  customer_id?: number
  warehouse_id?: number
  sales_order_id?: number
  date_from?: string
  date_to?: string
  search?: string
  page?: number
  per_page?: number
}
