import { DocPage } from '@/components/docs/DocPage'
import { DocsCallout } from '@/components/docs/DocsCallout'
import { H2, LI, P, Strong, Table, UL } from '@/components/docs/primitives'
import { getDocPage } from '@/lib/docs'

const meta = getDocPage('products-inventory')!

export default function ProductInventoryPage() {
  return (
    <DocPage meta={meta}>
      <P>
        <Strong>Products</Strong> are the items you buy and sell. <Strong>Inventory</Strong> is how many of each product
        you hold, tracked separately per warehouse.
      </P>

      <H2>Products</H2>
      <UL>
        <LI>Each product belongs to a category and can have a preferred supplier.</LI>
        <LI>A product has a unique <Strong>SKU</Strong>, a name, a unit, and a description.</LI>
        <LI><Strong>Unit price</Strong> is the selling price; <Strong>cost price</Strong> is the purchase cost used when
          buying stock.</LI>
        <LI>Status is one of <Strong>active</Strong>, <Strong>inactive</Strong>, or <Strong>discontinued</Strong>.</LI>
        <LI>Deleting a product soft-deletes (archives) it. History is kept, and archived products cannot be used in new
          stock operations.</LI>
      </UL>

      <H2>Inventory rows</H2>
      <P>
        Inventory is tracked as one row per <Strong>product + warehouse</Strong> combination. Each row records:
      </P>
      <Table
        head={['Field', 'Meaning']}
        rows={[
          ['quantity', 'The on-hand units in that warehouse.'],
          ['reserved_quantity', 'Units set aside. Available quantity = max(0, quantity − reserved).'],
          ['reorder_point', 'The threshold at which the product is flagged as low stock.'],
          ['reorder_quantity', 'The suggested quantity to reorder.'],
          ['average_cost', 'The product-wide Weighted Average Cost used for valuation (shared across warehouses).'],
        ]}
      />

      <H2>Stock can never go negative</H2>
      <P>
        Every action that removes stock — shipping, transferring, writing off, or a negative manual transaction —
        checks <Strong>available quantity</Strong> first. If there is not enough, the request is rejected and the
        inventory is left untouched.
      </P>

      <H2>Low stock</H2>
      <P>
        Products whose quantity is at or below their reorder point appear in <Strong>Low Stock Alerts</Strong> and can
        be reordered directly from the alert page.
      </P>

      <DocsCallout variant="note" title="Archived products">
        Archived products still appear in history and in the ledger, but they cannot be adjusted, written off, or used
        on new sales orders. Restore the product (via an admin) to use it again.
      </DocsCallout>
    </DocPage>
  )
}