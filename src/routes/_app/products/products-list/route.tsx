import ProductsTable from '@/features/products/pages/product-table/components/ProductTable'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/products/products-list')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <ProductsTable></ProductsTable>
  </div>
}
