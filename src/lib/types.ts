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
  warehouse_id: number
  user_id: number | null
  type: 'purchase' | 'sale' | 'transfer' | 'adjustment' | 'return'
  quantity: number
  unit_cost: number | null
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

export interface PurchaseOrder {
  id: number
  supplier_id: number
  user_id: number | null
  po_number: string
  status: 'draft' | 'sent' | 'partial' | 'received' | 'cancelled'
  order_date: string
  expected_date: string | null
  received_date: string | null
  total_amount: number
  notes: string | null
  supplier?: Supplier
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
